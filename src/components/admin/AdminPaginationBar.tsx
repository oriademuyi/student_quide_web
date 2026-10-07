"use client";

interface PaginationMetaLike {
  page: number;
  totalPages: number;
  totalItems: number;
}

export function AdminPaginationBar({
  meta,
  isLoading,
  onPrevious,
  onNext,
}: {
  meta: PaginationMetaLike;
  isLoading: boolean;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-t border-neutral-200 pt-3">
      <button
        disabled={isLoading || meta.page <= 1}
        onClick={onPrevious}
        className="text-sm font-semibold text-status-green disabled:text-neutral-300"
      >
        ‹ Previous
      </button>
      <span className="text-xs text-neutral-500">
        Page {meta.page} of {meta.totalPages || 1} • {meta.totalItems} total
      </span>
      <button
        disabled={isLoading || meta.page >= meta.totalPages}
        onClick={onNext}
        className="text-sm font-semibold text-status-green disabled:text-neutral-300"
      >
        Next ›
      </button>
    </div>
  );
}
