const base = import.meta.env.BASE_URL;
export function siteUrl(path: string): string {
  return base !== '/' && path.startsWith('/') && !path.startsWith('//') && !path.startsWith(base)
    ? base + path.slice(1)
    : path;
}
export function sitePathname(): string {
  const path = decodeURI(location.pathname);
  return base !== '/' && path.startsWith(base) ? '/' + path.slice(base.length) : path;
}

// Legacy HTML and content records intentionally retain their public root URLs.
// Rebase their DOM references when this same site is hosted under a project path.
export function installSiteBasePaths() {
  if (base === '/') return;
  const attributes = ['href', 'src', 'poster', 'action'];
  function update(element: Element) {
    for (const attr of attributes) {
      const value = element.getAttribute(attr);
      if (value?.startsWith('/') && !value.startsWith('//') && !value.startsWith(base))
        element.setAttribute(attr, base + value.slice(1));
    }
  }
  function scan(element: Element) {
    update(element);
    element.querySelectorAll('[href], [src], [poster], [action]').forEach(update);
  }
  scan(document.documentElement);
  new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === 'attributes') update(record.target as Element);
      for (const node of record.addedNodes) if (node instanceof Element) scan(node);
    }
  }).observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: attributes,
  });
}
