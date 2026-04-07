import { motion } from "framer-motion";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  scrollTargetRef?: React.RefObject<HTMLElement>;
}

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  scrollTargetRef,
}: PaginationControlsProps) => {
  if (totalPages <= 1) return null;

  const handleChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
    // Smooth scroll to top of section
    if (scrollTargetRef?.current) {
      const offset = 100; // account for sticky navbar
      const top = scrollTargetRef.current.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  // Build page number array with ellipsis
  const getPages = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="mt-12"
    >
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => { e.preventDefault(); handleChange(currentPage - 1); }}
              className={`cursor-pointer select-none font-body rounded-xl transition-colors ${
                currentPage === 1 ? "pointer-events-none opacity-40" : "hover:bg-accent/10 hover:text-accent"
              }`}
            />
          </PaginationItem>

          {getPages().map((page, i) =>
            page === "ellipsis" ? (
              <PaginationItem key={`e-${i}`}>
                <PaginationEllipsis className="text-muted-foreground" />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={(e) => { e.preventDefault(); handleChange(page); }}
                  className={`cursor-pointer select-none font-body rounded-xl transition-all duration-200 ${
                    page === currentPage
                      ? "bg-accent text-white border-accent hover:bg-accent/90 hover:text-white"
                      : "hover:bg-accent/10 hover:text-accent"
                  }`}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              onClick={(e) => { e.preventDefault(); handleChange(currentPage + 1); }}
              className={`cursor-pointer select-none font-body rounded-xl transition-colors ${
                currentPage === totalPages ? "pointer-events-none opacity-40" : "hover:bg-accent/10 hover:text-accent"
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </motion.div>
  );
};

export default PaginationControls;
