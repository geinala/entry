import { useResponsive } from "@/shared/hooks/use-responsive";
import type { IPaginationMeta } from "@/shared/types/query-params";
import { Button } from "../button";
import { Pagination, PaginationContent, PaginationItem } from "./pagination";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface Props {
  onPaginationChange: (page: number, limit: number) => void;
  paginationMeta: IPaginationMeta;
}

export const PaginationControl = ({ onPaginationChange, paginationMeta }: Props) => {
  const { itemCount, totalItems, itemsPerPage, totalPages, currentPage } = paginationMeta;
  const { isLg } = useResponsive();

  const pageRange = !isLg ? 1 : 2;
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(start + itemCount - 1, totalItems);

  const generatePageNumbers = (): (number | string)[] => {
    const maxVisiblePages = !isLg ? 3 : 6;
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    if (currentPage <= pageRange + 1) {
      pages.push(...Array.from({ length: pageRange + 2 }, (_, i) => i + 1), "...");
    } else if (currentPage >= totalPages - pageRange) {
      pages.push(
        "...",
        ...Array.from({ length: pageRange + 2 }, (_, i) => totalPages - pageRange - 1 + i),
      );
    } else {
      pages.push("...", currentPage - pageRange, currentPage, currentPage + pageRange, "...");
    }
    return pages;
  };

  const handleEllipsisClick = (index: number) => {
    const isFirstEllipsis = index === 0;
    const jumpAmount = Math.floor(totalPages / 3);
    const newPage = isFirstEllipsis
      ? Math.max(1, currentPage - jumpAmount)
      : Math.min(totalPages, currentPage + jumpAmount);
    onPaginationChange(newPage, itemsPerPage);
  };

  const renderPageButton = (page: number | string, index: number) => {
    if (typeof page === "number") {
      return (
        <Button
          variant={currentPage === page ? "default" : "outline"}
          className="h-8 w-8"
          onClick={() => onPaginationChange(page, itemsPerPage)}
        >
          {page}
        </Button>
      );
    }
    return (
      <Button variant="outline" className="h-8 w-8" onClick={() => handleEllipsisClick(index)}>
        {page}
      </Button>
    );
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-5">
      <div className="flex w-full flex-col items-center justify-center gap-3 md:flex-row lg:justify-end">
        <Pagination className="md:justify-end w-full">
          <PaginationContent className="flex-col md:flex-row gap-3 items-center justify-end">
            <p>{`${start}-${end} of ${totalItems} items`}</p>
            {/* Tombol kembali ke halaman pertama */}
            <div className="flex flex-wrap">
              <PaginationItem>
                <Button
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => onPaginationChange(1, itemsPerPage)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                {/* Tombol untuk ke halaman sebelumnya */}
                <Button
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => onPaginationChange(currentPage - 1, itemsPerPage)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </PaginationItem>
              {/* Tombol-tombol halaman */}
              {generatePageNumbers().map((page, index) => (
                <PaginationItem key={index}>{renderPageButton(page, index)}</PaginationItem>
              ))}
              <PaginationItem>
                {/* Tombol untuk ke halaman berikutnya */}
                <Button
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => onPaginationChange(currentPage + 1, itemsPerPage)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </PaginationItem>
              {/* Tombol ke halaman terakhir */}
              <PaginationItem>
                <Button
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => onPaginationChange(totalPages, itemsPerPage)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </div>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
