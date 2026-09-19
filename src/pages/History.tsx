import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useAllPosts } from '../hooks/usePosts'
import { sortByDateDesc } from '../lib/postUtils'
import { formatDate } from '../lib/format'
import Reveal from '../components/Reveal'

export default function History() {
  const allPosts = useAllPosts()
  const allPostsHistory = sortByDateDesc(allPosts)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.6'],
  })
  const lineProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 })

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <Reveal>
        <p className="font-mono text-xs text-accent">$ git log --all --oneline</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-paper sm:text-4xl">
          Histórico de publicações
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
          Cada artigo, sua data e onde foi publicado — blog, LinkedIn, ou ainda em rascunho.
          Transparência total sobre o que já saiu do papel.
        </p>
      </Reveal>

      <div ref={containerRef} className="relative mt-16">
        <div className="absolute left-[7px] top-0 h-full w-px bg-edge" />
        <motion.div
          className="absolute left-[7px] top-0 w-px origin-top bg-gradient-to-b from-accent to-accent-2"
          style={{ scaleY: lineProgress, height: '100%' }}
        />

        <ul className="space-y-12">
          {allPostsHistory.map((post, i) => {
            const isDraft = post.status === 'draft'
            return (
              <motion.li
                key={post.slug}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                className="relative pl-8"
              >
                <span
                  className={`absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 ${
                    isDraft ? 'border-warn bg-ink' : 'border-ok bg-ok/30'
                  }`}
                >
                  {!isDraft && <span className="block h-full w-full rounded-full bg-ok animate-pulse-dot" />}
                </span>

                <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
                  <span>{formatDate(post.date)}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      isDraft ? 'bg-warn/10 text-warn' : 'bg-ok/10 text-ok'
                    }`}
                  >
                    {isDraft ? 'rascunho' : 'publicado'}
                  </span>
                  {post.publishedOn.map((platform) => (
                    <span
                      key={platform}
                      className={`rounded-full px-2 py-0.5 text-[10px] ${
                        platform === 'blog' ? 'bg-accent/10 text-accent' : 'bg-accent-2/10 text-accent-2'
                      }`}
                    >
                      {platform}
                    </span>
                  ))}
                </div>

                {isDraft ? (
                  <p className="mt-2 font-display text-lg font-medium text-muted">{post.title}</p>
                ) : (
                  <Link
                    to={`/post/${post.slug}`}
                    className="mt-2 block font-display text-lg font-medium text-paper transition-colors hover:text-accent"
                  >
                    {post.title}
                  </Link>
                )}
                <p className="mt-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
