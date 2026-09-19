import Hero from '../components/Hero'
import PostCard from '../components/PostCard'
import Reveal from '../components/Reveal'
import LiveCounter from '../components/LiveCounter'
import { useAllPosts } from '../hooks/usePosts'
import { sortByDateDesc } from '../lib/postUtils'

export default function Home() {
  const allPosts = useAllPosts()
  const publishedPosts = sortByDateDesc(allPosts.filter((p) => p.status === 'published'))

  return (
    <>
      <Hero />

      <section id="posts" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <Reveal className="mb-12 flex items-end justify-between">
          <div>
            <p className="font-mono text-xs text-accent">$ ls ./posts --sort=recent</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-paper sm:text-4xl">
              Últimos artigos
            </h2>
          </div>
          <p className="hidden font-mono text-xs text-muted sm:block">
            {publishedPosts.length} publicados
          </p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {publishedPosts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.08}>
              <PostCard post={post} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-edge bg-surface/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal className="grid gap-10 sm:grid-cols-3">
            <div className="text-center">
              <p className="font-display text-3xl font-semibold text-accent sm:text-4xl">
                {publishedPosts.length}
              </p>
              <p className="mt-2 font-mono text-xs text-muted">Artigos publicados</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl font-semibold text-accent sm:text-4xl">12+</p>
              <p className="mt-2 font-mono text-xs text-muted">Tópicos cobertos</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-semibold text-accent sm:text-4xl">
                <LiveCounter />
              </p>
              <p className="mt-2 flex items-center justify-center gap-1.5 font-mono text-xs text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse-dot" />
                pacotes transmitidos
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
