"use client";

import { useRef } from "react";
import { uploadImage } from "@/lib/storage";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + text + value.substring(end);
    onChange(newValue);
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.focus();
    }, 0);
  };

  const wrapSelection = (before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const newValue = value.substring(0, start) + before + selected + after + value.substring(end);
    onChange(newValue);
    setTimeout(() => {
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = end + before.length;
      textarea.focus();
    }, 0);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("이미지 크기는 5MB 이하여야 합니다.");
      return;
    }

    try {
      const url = await uploadImage(file);
      insertAtCursor(`![${file.name}](${url})\n`);
    } catch (error) {
      console.error(error);
      alert("이미지 업로드에 실패했습니다.");
    }

    e.target.value = "";
  };

  const toolbarButtons = [
    { icon: "B", action: () => wrapSelection("**", "**"), title: "굵게" },
    { icon: "I", action: () => wrapSelection("*", "*"), title: "기울임" },
    { icon: "H", action: () => insertAtCursor("\n## "), title: "제목" },
    { icon: "<>", action: () => wrapSelection("`", "`"), title: "코드" },
    { icon: "🔗", action: () => insertAtCursor("[링크텍스트](url)"), title: "링크" },
    { icon: "≡", action: () => insertAtCursor("\n- "), title: "목록" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1 p-2 bg-zinc-100 rounded-lg">
        {toolbarButtons.map((btn) => (
          <button
            key={btn.title}
            type="button"
            onClick={btn.action}
            title={btn.title}
            className="px-2.5 py-2 text-sm font-medium text-zinc-700 hover:bg-white rounded-md transition-colors"
          >
            {btn.icon}
          </button>
        ))}
        <div className="w-px h-6 bg-zinc-300 mx-1" />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium text-zinc-700 hover:bg-white border border-zinc-200 bg-white rounded-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          이미지
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="마크다운으로 글을 작성하세요..."
        className="w-full min-h-[500px] px-5 py-4 text-[15px] leading-relaxed text-zinc-800 border border-zinc-200 rounded-xl outline-none focus:border-black resize-y font-mono"
      />
    </div>
  );
}
