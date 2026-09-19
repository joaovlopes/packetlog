import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAllPosts } from '../hooks/usePosts'
import { findPostBySlug, sortByDateDesc } from '../lib/postUtils'
import { formatDate } from '../lib/format'
import ProgressBar from '../components/ProgressBar'
import BlockRenderer from '../components/BlockRenderer'
import LinkedInPreview from '../components/LinkedInPreview'
import PostCard from '../components/PostCard'
import Reveal from '../components/Reveal'

type Tab = 'article' | 'linkedin'

export default function PostDetail() {
  const { slug } = useParams()
  const allPosts = useAllPosts()
  const post = findPostBySlug(allPosts, slug ?? '')
  const [tab, setTab] = useState<Tab>('article')

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [slug])

  if (!post) return <Navigate to="/404" replace />

  const related = sortByDateDesc(allPosts.filter((p) => p.status === 'published'))
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3)

  return (
    <>
      <ProgressBar />

      <article className="relative">
        <div className="border-b border-edge bg-grid bg-surface/20">
          <div className="mx-auto max-w-3xl px-6 pb-14 pt-14 sm:pt-20">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Link to="/" className="inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-accent">
                ← voltar
              </Link>

              <div className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-edge px-2.5 py-1 font-mono text-[11px] text-accent">
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="mt-5 font-display text-3xl font-semibold leading-tight text-paper sm:text-5xl">
                {post.title}
              </h1>

              <div className="mt-5 flex items-center gap-4 font-mono text-xs text-muted">
                <span>{formatDate(post.date)}</span>
                <span className="h-1 w-1 rounded-full bg-muted" />
                <span>{post.readTime} min de leitura</span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-6 py-12">
          <div className="mb-10 inline-flex rounded-full border border-edge bg-surface p-1">
            <button
              onClick={() => setTab('article')}
              className={`relative rounded-full px-4 py-1.5 font-mono text-xs transition-colors ${
                tab === 'article' ? 'text-ink' : 'text-muted hover:text-paper'
              }`}
            >
              {tab === 'article' && (
                <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-accent" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
              )}
              <span className="relative z-10">artigo completo</span>
            </button>
            <button
              onClick={() => setTab('linkedin')}
              className={`relative rounded-full px-4 py-1.5 font-mono text-xs transition-colors ${
                tab === 'linkedin' ? 'text-ink' : 'text-muted hover:text-paper'
              }`}
            >
              {tab === 'linkedin' && (
                <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-accent" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
              )}
              <span className="relative z-10">versão LinkedIn</span>
            </button>
          </div>

          {tab === 'article' ? (
            <BlockRenderer blocks={post.content} />
          ) : (
            <LinkedInPreview text={post.linkedinVersion} />
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-edge bg-surface/30">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <Reveal>
              <h2 className="mb-8 font-display text-2xl font-semibold text-paper">Continue lendo</h2>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.08}>
                  <PostCard post={p} index={i} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
