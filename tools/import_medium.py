#!/usr/bin/env python3
"""Import the approved Medium export posts as static site pages.

Usage: python3 tools/import_medium.py PATH_TO_MEDIUM_EXPORT
Requires lxml, cwebp, and sips. Images are fetched from the CDN URLs in the export.
"""

from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone, timedelta
from html import escape
from pathlib import Path
from tempfile import TemporaryDirectory
import json
import re
import subprocess
import sys
from urllib.request import Request, urlopen

from lxml import html


ROOT = Path(__file__).resolve().parents[1]
POSTS = Path(sys.argv[1]).expanduser() / 'posts'
ALLOWED = set((ROOT / 'tools/medium-keep45.txt').read_text().split())
BLOCKED_TERMS = ('科技部', '大專生研究計畫')
BLOCKED_IDS = {'a25b97dbc77'}
TAIPEI = timezone(timedelta(hours=8))
IMAGE_DIR = ROOT / 'assets/medium'
IMAGE_ALTS = json.loads((ROOT / 'tools/medium-image-alts.json').read_text())


def get_post(post_id):
    paths = list(POSTS.glob(f'*{post_id}.html'))
    if len(paths) != 1:
        raise ValueError(f'Expected one export file for {post_id}, found {len(paths)}')
    doc = html.parse(str(paths[0]))
    title = ''.join(doc.xpath('//h1[contains(@class,"p-name")]/text()')).strip()
    body = doc.xpath('//section[@data-field="body"]')[0]
    headings = body.xpath('.//h2|.//h3|.//h4')
    if headings:
        body_title = re.sub(r'\s+', ' ', ''.join(headings[0].itertext())).strip()
        if len(body_title) > len(title) and (body_title.startswith(title) or
                (title.endswith('…') and body_title.startswith(title[:-1]))):
            title = body_title
    body_text = ' '.join(body.itertext())
    if post_id in BLOCKED_IDS or any(term in title or term in body_text for term in BLOCKED_TERMS):
        return None
    published = doc.xpath('//time[contains(@class,"dt-published")]/@datetime')[0]
    summary = ''.join(doc.xpath('//section[@data-field="subtitle"]//text()')).strip()
    return dict(id=post_id, title=title, body=body, published=published,
                summary=summary)


def image_url(img):
    source = img.get('src') or ''
    if not source.startswith('https://cdn-images-1.medium.com/'):
        raise ValueError(f'Unexpected image URL: {source}')
    return re.sub(r'/max/\d+/', '/max/1200/', source, count=1)


def encode_image(task):
    post_id, index, url = task
    base = f'{post_id}-{index:02d}'
    with TemporaryDirectory() as tmp:
        source = Path(tmp) / 'source'
        request = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urlopen(request, timeout=60) as response, source.open('wb') as output:
            while chunk := response.read(1024 * 1024):
                output.write(chunk)
        size = subprocess.check_output(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', str(source)], text=True)
        width = int(re.search(r'pixelWidth: (\d+)', size).group(1))
        height = int(re.search(r'pixelHeight: (\d+)', size).group(1))
        widths = sorted({min(width, 480), min(width, 960)})
        variants = []
        for target in widths:
            path = IMAGE_DIR / f'{base}-{target}.webp'
            subprocess.run(['cwebp', '-quiet', '-q', '78', '-resize', str(target), '0',
                            str(source), '-o', str(path)], check=True)
            variants.append({'src': f'/assets/medium/{path.name}', 'width': target})
    key = f'/assets/medium/{base}.webp'
    return key, variants, width, height


def category_for(post):
    title = post['title']
    if post['id'] == 'efc2c5e2fcd0' or any(word in title for word in
        ('特教', '資優', '雙重殊異', '學習者發展', '智能障礙', '教育')):
        return 'inclusion'
    if any(word in title for word in ('教養', '孩子', 'child')):
        return 'family'
    if any(word in title for word in ('人格障礙', 'Trauma', '創傷', '情緒')):
        return 'behavior'
    return 'relationships'


def clean_body(post, image_data, local_ids):
    body = post['body']
    title_plain = re.sub(r'\W+', '', post['title']).lower()
    for heading in body.xpath('.//h2|.//h3|.//h4')[:1]:
        if re.sub(r'\W+', '', ''.join(heading.itertext())).lower() == title_plain:
            heading.drop_tree()
    for img_index, img in enumerate(body.xpath('.//img'), 1):
        key = f'/assets/medium/{post["id"]}-{img_index:02d}.webp'
        variants, width, height = image_data[key]
        img.attrib.clear()
        img.set('src', variants[-1]['src'])
        img.set('srcset', ', '.join(f'{v["src"]} {v["width"]}w' for v in variants))
        img.set('sizes', '(max-width: 767px) 100vw, 800px')
        img.set('width', str(width))
        img.set('height', str(height))
        img.set('loading', 'lazy')
        img.set('decoding', 'async')
        img.set('alt', IMAGE_ALTS.get(key, ''))
    for element in reversed(list(body.iter())):
        if element is body:
            continue
        if element.tag in {'section', 'div', 'span'}:
            element.drop_tag()
        elif element.tag in {'script', 'style'}:
            element.drop_tree()
        elif element.tag == 'a':
            href = element.get('href', '')
            linked = re.search(r'-([0-9a-f]{11,12})(?:[/?#]|$)', href)
            if linked and linked.group(1) in local_ids and href.startswith(('https://medium.com/', 'https://cactusbeing.medium.com/')):
                href = f'/medium-{linked.group(1)}.html'
            element.attrib.clear()
            if href.startswith(('https://', 'http://', 'mailto:', '/', '#')):
                element.set('href', href)
                if href.startswith(('https://', 'http://')):
                    element.set('target', '_blank')
                    element.set('rel', 'noopener noreferrer')
        elif element.tag == 'img':
            pass
        else:
            element.attrib.clear()
    return (body.text or '') + ''.join(html.tostring(child, encoding='unicode', method='html') for child in body)


def make_page(post, content, cover, description):
    published = datetime.fromisoformat(post['published'].replace('Z', '+00:00'))
    local = published.astimezone(TAIPEI).strftime('%Y-%m-%d %H:%M')
    title = escape(post['title'], quote=True)
    description = escape(description, quote=True)
    cover_url = f'https://cactusbeing.github.io{cover}'
    lang = 'en' if not re.search(r'[\u3400-\u9fff]', post['title']) else 'zh-Hant'
    return f'''<!doctype html>
<html lang="{lang}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}｜特教百寶袋</title><meta name="description" content="{description}">
<meta name="author" content="仙人掌星人"><meta property="og:title" content="{title}">
<meta property="og:description" content="{description}"><meta property="og:type" content="article">
<meta property="article:published_time" content="{post['published']}"><meta property="article:author" content="仙人掌星人">
<meta property="og:image" content="{escape(cover_url, quote=True)}"><link rel="icon" href="/assets/icon.png"></head>
<body><div id="site-header"></div><main id="main-content" class="container page-main" tabindex="-1">
<div class="reading"><header class="post-heading"><h1>{title}</h1>
<p class="meta">發佈者：仙人掌星人 · <time datetime="{post['published']}">{local}（台灣時間）</time></p></header>
<article class="medium-article">{content}</article></div></main><div id="site-footer"></div>
<script type="module" src="/src/app/shell.ts"></script></body></html>
'''


def main():
    if not POSTS.is_dir():
        raise SystemExit(f'No Medium posts directory: {POSTS}')
    posts = [post for post_id in ALLOWED if (post := get_post(post_id))]
    posts.sort(key=lambda post: post['published'], reverse=True)
    local_ids = {post['id'] for post in posts}
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    tasks = [(post['id'], index, image_url(img))
             for post in posts for index, img in enumerate(post['body'].xpath('.//img'), 1)]
    image_data = {}
    with ThreadPoolExecutor(max_workers=6) as pool:
        futures = {pool.submit(encode_image, task): task for task in tasks}
        for future in as_completed(futures):
            task = futures[future]
            try:
                key, variants, width, height = future.result()
            except Exception as error:
                raise RuntimeError(f'Image failed: {task}') from error
            image_data[key] = (variants, width, height)
    catalog = []
    for post in posts:
        images = post['body'].xpath('.//img')
        featured = next((i for i, img in enumerate(images, 1) if img.get('data-is-featured') == 'true'), 1)
        cover_key = f'/assets/medium/{post["id"]}-{featured:02d}.webp' if images else None
        category = category_for(post)
        cover = image_data[cover_key][0][-1]['src'] if cover_key else {
            'inclusion': '/assets/img/postbrain-bg.jpg',
            'family': '/assets/img/about-bg.jpg',
            'behavior': '/assets/img/pbs.jpg',
            'relationships': '/assets/img/post-bg.jpg',
        }[category]
        paragraphs = [' '.join(p.itertext()).strip() for p in post['body'].xpath('.//p[normalize-space()]')]
        raw_description = post['summary'] if len(post['summary']) >= 35 else next(
            (paragraph for paragraph in paragraphs if len(paragraph) >= 40), post['summary'] or post['title'])
        description = re.sub(r'\s+', ' ', raw_description).strip()[:170]
        content = clean_body(post, image_data, local_ids)
        (ROOT / f'medium-{post["id"]}.html').write_text(make_page(post, content, cover, description))
        local_date = datetime.fromisoformat(post['published'].replace('Z', '+00:00')).astimezone(TAIPEI).date().isoformat()
        catalog.append(dict(title=post['title'], href=f'/medium-{post["id"]}.html', date=local_date,
                            publishedAt=post['published'], author='仙人掌星人', category=category,
                            tags=[{'inclusion': '特教與教育', 'family': '教養與家庭',
                                   'behavior': '情緒與行為', 'relationships': '心理與關係'}[category]],
                            image=cover_key or cover, description=description))
    (ROOT / 'src/content/medium-articles.ts').write_text('export const mediumArticles = ' + json.dumps(catalog, ensure_ascii=False, indent=2) + ' as const;\n')
    (ROOT / 'src/content/medium-image-variants.json').write_text(json.dumps(
        {key: variants for key, (variants, _, _) in sorted(image_data.items())}, ensure_ascii=False, indent=2) + '\n')
    print(f'Imported {len(posts)} pages and {len(tasks)} images')


if __name__ == '__main__':
    main()
