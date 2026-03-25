import { formatDate } from "@/lib/utils";

interface EditedBadgeProps {
  updatedAt: string;
}

export default function EditedBadge({ updatedAt }: EditedBadgeProps) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-warm-100 dark:bg-dark-800 rounded-md shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-olive-brown dark:text-warm-400"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
      <span className="text-xs text-olive-brown dark:text-warm-400">수정됨 · {formatDate(updatedAt)}</span>
    </div>
  );
}
