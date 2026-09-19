const DIACRITICS = new RegExp('[̀-ͯ]', 'g')

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICS, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
