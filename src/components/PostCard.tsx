import { Link } from 'react-router-dom'
import type { Post } from '../data/posts'
import { formatDate } from '../lib/format'

export default function PostCard({ post, index = 0 }: { post: Post; index?: number }) {
  return (
    <Link
      to={`/post/${post.slug}`}
      className="card-glow group relative flex flex-col overflow-hidden rounded-2xl border border-edge bg-surface p-6"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />

      <div className="mb-4 flex items-center justify-between font-mono text-xs text-muted">
        <span>{formatDate(post.date)}</span>
        <span>{String(index + 1).padStart(2, '0')} · {post.readTime} min</span>
      </div>

      <h3 className="font-display text-xl font-semibold leading-snug text-paper transition-colors group-hover:text-accent">
        {post.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-edge px-2.5 py-1 font-mono text-[11px] text-muted transition-colors group-hover:border-accent/40 group-hover:text-accent"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-edge pt-4">
        <div className="flex gap-1.5">
          {post.publishedOn.includes('blog') && (
            <span className="rounded-full bg-accent/10 px-2 py-0.5 font-mono text-[10px] text-accent">blog</span>
          )}
          {post.publishedOn.includes('linkedin') && (
            <span className="rounded-full bg-accent-2/10 px-2 py-0.5 font-mono text-[10px] text-accent-2">linkedin</span>
          )}
        </div>
        <span className="flex items-center gap-1 text-sm font-medium text-paper transition-transform group-hover:translate-x-1">
          ler mais <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  )
}
