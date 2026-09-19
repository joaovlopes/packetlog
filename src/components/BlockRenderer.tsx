import type { ReactNode } from 'react'
import type { Block } from '../data/posts'
import Reveal from './Reveal'

function BlockWrap({ animate, children }: { animate: boolean; children: ReactNode }) {
  if (!animate) return <>{children}</>
  return <Reveal y={12}>{children}</Reveal>
}

export default function BlockRenderer({ blocks, animate = true }: { blocks: Block[]; animate?: boolean }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h2':
            return (
              <BlockWrap key={i} animate={animate}>
                <h2 className="mt-12! font-display text-2xl font-semibold text-paper sm:text-3xl">
                  {block.text}
                </h2>
              </BlockWrap>
            )
          case 'h3':
            return (
              <BlockWrap key={i} animate={animate}>
                <h3 className="mt-8! font-display text-xl font-semibold text-paper">{block.text}</h3>
              </BlockWrap>
            )
          case 'p':
            return (
              <BlockWrap key={i} animate={animate}>
                <p className="text-base leading-relaxed text-muted sm:text-[17px]">{block.text}</p>
              </BlockWrap>
            )
          case 'list':
            return (
              <BlockWrap key={i} animate={animate}>
                <ul className="space-y-2.5">
                  {block.items.map((item, j) => (
                    <li key={j} className="flex gap-3 text-base leading-relaxed text-muted sm:text-[17px]">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </BlockWrap>
            )
          case 'quote':
            return (
              <BlockWrap key={i} animate={animate}>
                <blockquote className="border-l-2 border-accent bg-accent/5 py-3 pl-5 pr-4 text-base italic leading-relaxed text-paper/90">
                  {block.text}
                </blockquote>
              </BlockWrap>
            )
          case 'code':
            return (
              <BlockWrap key={i} animate={animate}>
                <div className="overflow-hidden rounded-xl border border-edge bg-[#080b14]">
                  <div className="flex items-center gap-1.5 border-b border-edge px-4 py-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                    <span className="ml-2 font-mono text-[11px] text-muted">{block.lang}</span>
                  </div>
                  <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed text-accent/90">
                    <code>{block.text}</code>
                  </pre>
                </div>
              </BlockWrap>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
