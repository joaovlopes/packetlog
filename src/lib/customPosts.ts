import type { Post } from '../data/posts'

const STORAGE_KEY = 'packetlog:custom-posts'

export function getCustomPosts(): Post[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Post[]) : []
  } catch {
    return []
  }
}

export function saveCustomPost(post: Post) {
  const next = [...getCustomPosts().filter((p) => p.slug !== post.slug), post]
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}
