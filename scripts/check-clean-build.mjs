import { createHash } from 'node:crypto';
import { execFileSync, spawn } from 'node:child_process';
import { appendFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const help = `Check a clean Git snapshot using the Node.js version in deploy.yml.

  npm run check:clean                          Check committed HEAD (default)
  npm run check:clean -- --staged               Check the current Git index
  npm run check:clean -- --ref <commit-or-tag>   Check another commit
  npm run check:clean -- --base-path /review/   Check a project-site base path
  npm run check:clean -- --keep                 Retain the successful snapshot

Runs npm ci, npm run build, and test:money when available in that snapshot.
Unstaged/untracked files, local node_modules and dist are excluded.
Uses npm exec to obtain the workflow's Node.js major; first use needs network.
Writes build.log and report.json outside the repository. Failed snapshots are
retained; successful snapshots are removed unless --keep is supplied.
Does not stage, commit, push, deploy, or change the working tree.
Requires Git, tar and npm (macOS/Linux).
`;

function options(args) {
  const result = { staged: false, ref: 'HEAD', basePath: '/', keep: false };
  let explicitRef = false;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--staged') result.staged = true;
    else if (arg === '--keep') result.keep = true;
    else if (arg === '--ref' || arg === '--base-path') {
      const value = args[++i];
      if (!value || value.startsWith('-')) throw Error(`Missing value for ${arg}`);
      if (arg === '--ref') { result.ref = value; explicitRef = true; }
      else result.basePath = value;
    } else throw Error(`Unknown option: ${arg}. Use --help for usage.`);
  }
  if (result.staged && explicitRef) throw Error('--staged and --ref cannot be combined.');
  if (!/^\/(?:[A-Za-z0-9_.-]+\/)*$/.test(result.basePath) ||
      result.basePath.split('/').some(part => part === '.' || part === '..'))
    throw Error('--base-path must be / or a path such as /review/ with leading/trailing slashes.');
  return result;
}

function git(cwd, ...args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function workflowNodeMajor(directory) {
  const workflow = readFileSync(join(directory, '.github/workflows/deploy.yml'), 'utf8');
  const versions = [...workflow.matchAll(/^\s*node-version:\s*['"]?(\d+)(?:\.x)?['"]?\s*(?:#.*)?$/gm)];
  const majors = [...new Set(versions.map(match => match[1]))];
  if (majors.length !== 1)
    throw Error('Expected one literal Node.js major in deploy.yml (for example node-version: 24).');
  return majors[0];
}

function run(command, args, cwd, env, logPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] });
    const interrupt = signal => child.kill(signal);
    const onInterrupt = () => interrupt('SIGINT');
    const onTerminate = () => interrupt('SIGTERM');
    process.once('SIGINT', onInterrupt);
    process.once('SIGTERM', onTerminate);
    for (const [source, destination] of [[child.stdout, process.stdout], [child.stderr, process.stderr]]) {
      source.on('data', chunk => {
        appendFileSync(logPath, chunk);
        destination.write(chunk);
      });
    }
    child.once('error', reject);
    child.once('close', (code, signal) => {
      process.removeListener('SIGINT', onInterrupt);
      process.removeListener('SIGTERM', onTerminate);
      if (code === 0) resolve();
      else reject(Object.assign(Error(`Build check exited ${signal || code}. See ${logPath}`), {
        exitCode: signal === 'SIGINT' ? 130 : signal === 'SIGTERM' ? 143 : code || 1,
      }));
    });
  });
}

async function main() {
  if (process.argv.slice(2).includes('--help')) { console.log(help); return; }
  const config = options(process.argv.slice(2));
  const root = git(process.cwd(), 'rev-parse', '--show-toplevel').trim();
  const reportDirectory = mkdtempSync(join(tmpdir(), 'cactus-clean-build-'));
  const snapshot = join(reportDirectory, 'source');
  const logPath = join(reportDirectory, 'build.log');
  const reportPath = join(reportDirectory, 'report.json');
  mkdirSync(snapshot);
  const report = {
    status: 'running', startedAt: new Date().toISOString(),
    source: null, nodeMajor: null, basePath: config.basePath, commands: [],
    snapshot, snapshotRetained: true, logPath,
  };
  function log(message) {
    console.log(message);
    appendFileSync(logPath, message + '\n');
  }
  try {
    if (config.staged) {
      if (git(root, 'ls-files', '--unmerged', '-z'))
        throw Error('Resolve index merge conflicts before checking --staged.');
      const before = git(root, 'ls-files', '--stage', '-z');
      report.source = {
        kind: 'index', head: git(root, 'rev-parse', 'HEAD').trim(),
        indexSha256: createHash('sha256').update(before).digest('hex'),
      };
      git(root, 'checkout-index', '--all', '--prefix=' + snapshot + '/');
      if (git(root, 'ls-files', '--stage', '-z') !== before)
        throw Error('The Git index changed while exporting. Run again after staging is finished.');
      log('Source: staged index; unstaged and untracked changes are excluded.');
    } else {
      const commit = git(root, 'rev-parse', '--verify', '--end-of-options', config.ref + '^{commit}').trim();
      report.source = { kind: 'commit', ref: config.ref, commit };
      const archive = join(reportDirectory, 'source.tar');
      git(root, 'archive', '--format=tar', '--output=' + archive, commit);
      execFileSync('tar', ['-xf', archive, '-C', snapshot], { stdio: 'pipe' });
      rmSync(archive);
      log(`Source: ${config.ref} (${commit}); all uncommitted changes are excluded.`);
    }
    for (const name of ['node_modules', 'dist']) {
      if (existsSync(join(snapshot, name)))
        throw Error(`Snapshot contains tracked ${name}; remove generated dependencies/artifacts from Git first.`);
    }
    report.nodeMajor = workflowNodeMajor(snapshot);
    const pkg = JSON.parse(readFileSync(join(snapshot, 'package.json'), 'utf8'));
    if (!pkg.scripts?.build || !existsSync(join(snapshot, 'package-lock.json')))
      throw Error('Snapshot must contain package-lock.json and an npm build script.');
    report.commands = ['npm ci', 'npm run build'];
    if (pkg.scripts['test:money']) report.commands.push('npm run test:money');
    const command = ['node --version', ...report.commands].join(' && ');
    log(`Node.js: ${report.nodeMajor} (from snapshot deploy.yml); VITE_BASE_PATH=${config.basePath}`);
    log(`Checks: ${report.commands.join(' → ')}`);
    log(`Snapshot: ${snapshot}`);
    log(`Log: ${logPath}`);
    const env = { ...process.env, VITE_BASE_PATH: config.basePath };
    // CI installs devDependencies. A local production-mode shell must not omit them.
    for (const key of Object.keys(env)) {
      if (/^(NODE_ENV|NODE_OPTIONS|npm_config_(production|omit|only|include))$/i.test(key)) delete env[key];
    }
    await run('npm', ['exec', '--yes', '--package=node@' + report.nodeMajor, '--call', command],
      snapshot, env, logPath);
    const runtime = readFileSync(logPath, 'utf8').match(/^v(\d+)\.\d+\.\d+\s*$/m)?.[0]?.trim();
    if (!runtime?.startsWith('v' + report.nodeMajor + '.'))
      throw Error('Could not confirm the build ran with the workflow Node.js major.');
    report.nodeVersion = runtime;
    report.status = 'passed';
    if (!config.keep) {
      rmSync(snapshot, { recursive: true });
      report.snapshotRetained = false;
    }
    log('PASS: clean-snapshot installation, build and regression checks succeeded.');
    log('This checks a local build, not GitHub Pages permissions or a live deployment.');
  } catch (error) {
    report.status = 'failed';
    report.error = error.stderr?.toString().trim() || error.message;
    process.exitCode = error.exitCode || 1;
    log('FAIL: ' + report.error);
    log(`Snapshot retained for diagnosis: ${snapshot}`);
  } finally {
    report.finishedAt = new Date().toISOString();
    writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
    console.log(`Report: ${reportPath}`);
  }
}

main().catch(error => {
  console.error(error.stderr?.toString().trim() || error.message);
  process.exitCode = 1;
});
