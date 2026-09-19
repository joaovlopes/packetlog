import type { Post } from '../data/posts'

export function sortByDateDesc(list: Post[]): Post[] {
  return [...list].sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function findPostBySlug(list: Post[], slug: string) {
  return list.find((p) => p.slug === slug)
}
