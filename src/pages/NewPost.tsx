import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Block, Platform, Post } from '../data/posts'
import { saveCustomPost } from '../lib/customPosts'
import { slugify } from '../lib/slugify'
import { formatDate } from '../lib/format'
import Reveal from '../components/Reveal'
import BlockRenderer from '../components/BlockRenderer'
import LinkedInPreview from '../components/LinkedInPreview'

type EditorBlock =
  | { id: string; type: 'p'; text: string }
  | { id: string; type: 'h2'; text: string }
  | { id: string; type: 'h3'; text: string }
  | { id: string; type: 'quote'; text: string }
  | { id: string; type: 'code'; lang: string; text: string }
  | { id: string; type: 'list'; itemsText: string }

const uid = () => Math.random().toString(36).slice(2, 10)

const BLOCK_LABELS: Record<EditorBlock['type'], string> = {
  p: 'Parágrafo',
  h2: 'Título',
  h3: 'Subtítulo',
  quote: 'Citação',
  code: 'Código',
  list: 'Lista',
}

const BLOCK_ORDER: EditorBlock['type'][] = ['p', 'h2', 'h3', 'code', 'list', 'quote']

function emptyBlock(type: EditorBlock['type']): EditorBlock {
  if (type === 'code') return { id: uid(), type, lang: 'bash', text: '' }
  if (type === 'list') return { id: uid(), type, itemsText: '' }
  return { id: uid(), type, text: '' }
}

function toContentBlocks(list: EditorBlock[]): Block[] {
  const blocks: Block[] = []
  for (const b of list) {
    if (b.type === 'list') {
      const items = b.itemsText.split('\n').map((s) => s.trim()).filter(Boolean)
      if (items.length) blocks.push({ type: 'list', items })
    } else if (b.type === 'code') {
      if (b.text.trim()) blocks.push({ type: 'code', lang: b.lang.trim() || 'text', text: b.text })
    } else if (b.text.trim()) {
      blocks.push({ type: b.type, text: b.text })
    }
  }
  return blocks
}

const inputClass =
  'w-full rounded-xl border border-edge bg-surface px-4 py-2.5 text-sm text-paper placeholder-muted/50 outline-none transition-colors focus:border-accent'
const labelClass = 'mb-1.5 block font-mono text-xs text-muted'
const cardClass = 'rounded-2xl border border-edge bg-surface/40 p-6'

export default function NewPost() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [excerpt, setExcerpt] = useState('')
  const [tagsText, setTagsText] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [readTime, setReadTime] = useState(5)
  const [status, setStatus] = useState<Post['status']>('draft')
  const [publishedOn, setPublishedOn] = useState<Platform[]>([])
  const [linkedinVersion, setLinkedinVersion] = useState('')
  const [blocks, setBlocks] = useState<EditorBlock[]>([emptyBlock('p')])
  const [previewTab, setPreviewTab] = useState<'article' | 'linkedin'>('article')
  const [copied, setCopied] = useState(false)

  const tags = tagsText.split(',').map((t) => t.trim()).filter(Boolean)
  const contentBlocks = toContentBlocks(blocks)
  const finalSlug = slug || slugify(title)
  const canSave = title.trim().length > 0 && contentBlocks.length > 0

  const updateBlock = (id: string, patch: Partial<EditorBlock>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? ({ ...b, ...patch } as EditorBlock) : b)))
  }
  const removeBlock = (id: string) => setBlocks((prev) => prev.filter((b) => b.id !== id))
  const moveBlock = (id: string, dir: -1 | 1) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id)
      const next = idx + dir
      if (next < 0 || next >= prev.length) return prev
      const copy = [...prev]
      ;[copy[idx], copy[next]] = [copy[next], copy[idx]]
      return copy
    })
  }
  const addBlock = (type: EditorBlock['type']) => setBlocks((prev) => [...prev, emptyBlock(type)])

  const togglePlatform = (platform: Platform) => {
    setPublishedOn((prev) => (prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]))
  }

  const buildPost = (): Post => ({
    slug: finalSlug,
    title: title.trim(),
    excerpt: excerpt.trim(),
    linkedinVersion: linkedinVersion.trim(),
    content: contentBlocks,
    date,
    readTime: Number(readTime) || 1,
    tags,
    status,
    publishedOn,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSave) return
    const post = buildPost()
    saveCustomPost(post)
    navigate(`/post/${post.slug}`)
  }

  const copyPostData = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(buildPost(), null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <Reveal>
        <p className="font-mono text-xs text-accent">$ touch ./posts/novo-artigo.md</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-paper sm:text-4xl">Novo artigo</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          Monte o post com os mesmos blocos usados nos outros artigos — texto corrido, títulos, trecho de
          código e citação. O preview ao lado mostra exatamente como vai ficar publicado.
        </p>
      </Reveal>

      <form onSubmit={handleSubmit} className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-start">
        <div className="space-y-6">
          <div className={cardClass}>
            <label className={labelClass}>Título</label>
            <input
              className={inputClass}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (!slugTouched) setSlug(slugify(e.target.value))
              }}
              placeholder="Ex: Como funciona o NAT"
            />

            <label className={`${labelClass} mt-4`}>Slug (URL)</label>
            <input
              className={inputClass}
              value={finalSlug}
              onChange={(e) => {
                setSlug(slugify(e.target.value))
                setSlugTouched(true)
              }}
              placeholder="como-funciona-o-nat"
            />

            <label className={`${labelClass} mt-4`}>Resumo (aparece no card)</label>
            <textarea
              className={`${inputClass} min-h-20 resize-y`}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Uma ou duas frases que resumem o artigo."
            />

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Data</label>
                <input
                  type="date"
                  className={inputClass}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Tempo de leitura (min)</label>
                <input
                  type="number"
                  min={1}
                  className={inputClass}
                  value={readTime}
                  onChange={(e) => setReadTime(Number(e.target.value))}
                />
              </div>
            </div>

            <label className={`${labelClass} mt-4`}>Tags (separadas por vírgula)</label>
            <input
              className={inputClass}
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="NAT, IPv4, Firewall"
            />

            <div className="mt-4 flex flex-wrap items-center gap-6">
              <div>
                <span className={labelClass}>Status</span>
                <div className="inline-flex rounded-full border border-edge bg-surface p-1">
                  {(['draft', 'published'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`rounded-full px-3.5 py-1.5 font-mono text-xs transition-colors ${
                        status === s
                          ? s === 'published'
                            ? 'bg-ok/20 text-ok'
                            : 'bg-warn/20 text-warn'
                          : 'text-muted hover:text-paper'
                      }`}
                    >
                      {s === 'published' ? 'publicado' : 'rascunho'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className={labelClass}>Publicado em</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => togglePlatform('blog')}
                    className={`rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors ${
                      publishedOn.includes('blog')
                        ? 'border-accent/40 bg-accent/10 text-accent'
                        : 'border-edge text-muted hover:text-paper'
                    }`}
                  >
                    blog
                  </button>
                  <button
                    type="button"
                    onClick={() => togglePlatform('linkedin')}
                    className={`rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors ${
                      publishedOn.includes('linkedin')
                        ? 'border-accent-2/40 bg-accent-2/10 text-accent-2'
                        : 'border-edge text-muted hover:text-paper'
                    }`}
                  >
                    linkedin
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <div className="mb-4 flex items-center justify-between">
              <span className={labelClass + ' mb-0'}>Conteúdo do artigo</span>
              <span className="font-mono text-[11px] text-muted">{blocks.length} blocos</span>
            </div>

            <div className="space-y-4">
              {blocks.map((block, i) => (
                <div key={block.id} className="rounded-xl border border-edge bg-surface p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-accent/10 px-2.5 py-1 font-mono text-[11px] text-accent">
                      {BLOCK_LABELS[block.type]}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveBlock(block.id, -1)}
                        disabled={i === 0}
                        className="rounded-md px-2 py-1 text-muted transition-colors hover:text-accent disabled:opacity-30"
                        aria-label="Mover para cima"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(block.id, 1)}
                        disabled={i === blocks.length - 1}
                        className="rounded-md px-2 py-1 text-muted transition-colors hover:text-accent disabled:opacity-30"
                        aria-label="Mover para baixo"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBlock(block.id)}
                        className="rounded-md px-2 py-1 text-muted transition-colors hover:text-warn"
                        aria-label="Remover bloco"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {block.type === 'code' ? (
                    <>
                      <input
                        className={`${inputClass} mb-2`}
                        value={block.lang}
                        onChange={(e) => updateBlock(block.id, { lang: e.target.value })}
                        placeholder="linguagem (bash, http, text...)"
                      />
                      <textarea
                        className={`${inputClass} min-h-28 resize-y font-mono text-[13px]`}
                        value={block.text}
                        onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                        placeholder="$ comando ou trecho de código"
                      />
                    </>
                  ) : block.type === 'list' ? (
                    <textarea
                      className={`${inputClass} min-h-24 resize-y`}
                      value={block.itemsText}
                      onChange={(e) => updateBlock(block.id, { itemsText: e.target.value })}
                      placeholder={'um item por linha\nsegundo item\nterceiro item'}
                    />
                  ) : block.type === 'h2' || block.type === 'h3' ? (
                    <input
                      className={inputClass}
                      value={block.text}
                      onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                      placeholder="Texto do título"
                    />
                  ) : (
                    <textarea
                      className={`${inputClass} min-h-20 resize-y`}
                      value={block.text}
                      onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                      placeholder={block.type === 'quote' ? 'Texto da citação' : 'Texto do parágrafo'}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2 border-t border-edge pt-4">
              {BLOCK_ORDER.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addBlock(type)}
                  className="rounded-full border border-edge px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  + {BLOCK_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          <div className={cardClass}>
            <label className={labelClass}>Versão para o LinkedIn</label>
            <textarea
              className={`${inputClass} min-h-32 resize-y`}
              value={linkedinVersion}
              onChange={(e) => setLinkedinVersion(e.target.value)}
              placeholder="Texto curto e direto, com gancho e call-to-action pro artigo completo."
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={!canSave}
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
            >
              Publicar artigo
            </button>
            <button
              type="button"
              onClick={copyPostData}
              className="rounded-full border border-edge px-6 py-2.5 text-sm font-semibold text-paper transition-colors hover:border-accent hover:text-accent"
            >
              {copied ? 'dados copiados ✓' : 'copiar dados (JSON)'}
            </button>
            <p className="font-mono text-[11px] text-muted">
              salvo neste navegador · copie o JSON para colar em src/data/posts.ts e tornar permanente
            </p>
          </div>
        </div>

        <div className="lg:sticky lg:top-24">
          <div className="mb-4 inline-flex rounded-full border border-edge bg-surface p-1">
            <button
              type="button"
              onClick={() => setPreviewTab('article')}
              className={`rounded-full px-4 py-1.5 font-mono text-xs transition-colors ${
                previewTab === 'article' ? 'bg-accent text-ink' : 'text-muted hover:text-paper'
              }`}
            >
              preview do artigo
            </button>
            <button
              type="button"
              onClick={() => setPreviewTab('linkedin')}
              className={`rounded-full px-4 py-1.5 font-mono text-xs transition-colors ${
                previewTab === 'linkedin' ? 'bg-accent text-ink' : 'text-muted hover:text-paper'
              }`}
            >
              preview LinkedIn
            </button>
          </div>

          <div className="rounded-2xl border border-edge bg-grid bg-surface/20 p-6">
            {previewTab === 'article' ? (
              <>
                <div className="flex flex-wrap gap-2">
                  {tags.length > 0 ? (
                    tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-edge px-2.5 py-1 font-mono text-[11px] text-accent">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="font-mono text-[11px] text-muted">sem tags ainda</span>
                  )}
                </div>
                <h2 className="mt-4 font-display text-2xl font-semibold leading-tight text-paper sm:text-3xl">
                  {title || 'Título do artigo'}
                </h2>
                <div className="mt-3 flex items-center gap-3 font-mono text-xs text-muted">
                  <span>{formatDate(date)}</span>
                  <span className="h-1 w-1 rounded-full bg-muted" />
                  <span>{readTime} min de leitura</span>
                </div>

                <div className="mt-8">
                  {contentBlocks.length > 0 ? (
                    <BlockRenderer blocks={contentBlocks} animate={false} />
                  ) : (
                    <p className="text-sm text-muted">Adicione blocos de conteúdo para ver o preview.</p>
                  )}
                </div>
              </>
            ) : (
              <LinkedInPreview text={linkedinVersion || 'Escreva a versão para o LinkedIn ao lado.'} />
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
