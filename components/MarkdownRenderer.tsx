"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-[family-name:var(--font-outfit)] prose-headings:font-extrabold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-[1.7] prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-a:text-black dark:prose-a:text-white prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-zinc-800 dark:prose-pre:bg-zinc-900 prose-pre:text-zinc-200 prose-pre:rounded-xl prose-img:rounded-xl">
      <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
    </div>
  );
}
