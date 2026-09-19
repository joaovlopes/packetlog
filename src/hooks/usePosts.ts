import { useState } from 'react'
import { posts as staticPosts, type Post } from '../data/posts'
import { getCustomPosts } from '../lib/customPosts'

export function useAllPosts(): Post[] {
  const [all] = useState<Post[]>(() => [...staticPosts, ...getCustomPosts()])
  return all
}
