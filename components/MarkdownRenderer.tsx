"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-[family-name:var(--font-outfit)] prose-headings:font-extrabold prose-headings:text-plum dark:prose-headings:text-warm-100 prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-[1.7] prose-p:text-brown dark:prose-p:text-warm-300 prose-a:text-teal dark:prose-a:text-teal-light prose-a:no-underline hover:prose-a:underline prose-code:bg-warm-100 dark:prose-code:bg-dark-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-dark-900 dark:prose-pre:bg-dark-950 prose-pre:text-warm-200 prose-pre:rounded-xl prose-img:rounded-xl prose-strong:text-plum dark:prose-strong:text-warm-100">
      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
    </div>
  );
}
