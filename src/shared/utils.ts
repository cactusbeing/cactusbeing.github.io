export function downloadText(
  content: string,
  filename: string,
  mime = 'text/plain;charset=utf-8',
): void {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = Array.from(filename, (character) =>
    character.charCodeAt(0) < 32 || '<>:"/\\|?*'.includes(character) ? '_' : character,
  ).join('');
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  // Allow the browser to consume the URL before revoking it.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
