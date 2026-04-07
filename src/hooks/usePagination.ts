import { useState, useMemo, useEffect } from "react";

export function usePagination<T>(items: T[], pageSize: number) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  // Reset to page 1 when items change (e.g. filter/search)
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  // Clamp current page to valid bounds
  const safePage = Math.min(currentPage, totalPages);
  if (safePage !== currentPage) setCurrentPage(safePage);

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, items.length);

  const paginatedItems = useMemo(
    () => items.slice(startIndex, endIndex),
    [items, startIndex, endIndex]
  );

  return {
    currentPage: safePage,
    setCurrentPage,
    totalPages,
    paginatedItems,
    startIndex,
    endIndex,
    totalItems: items.length,
  };
}
