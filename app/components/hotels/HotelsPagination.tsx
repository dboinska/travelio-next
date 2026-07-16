import Link from "next/link";
import {
  paginationActiveClassName,
  paginationIdleClassName,
} from "@/lib/design/classes";
import { cn } from "@/lib/cn";

interface Props {
  currentPage: number;
  totalPages: number;
}

function getPaginationRange(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5];
  }

  if (currentPage >= totalPages - 2) {
    return [
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
  ];
}

export default function HotelsPagination({ currentPage, totalPages }: Props) {
  if (totalPages <= 1) return null;

  const pageRange = getPaginationRange(currentPage, totalPages);
  const showRightEllipsis = pageRange[pageRange.length - 1] < totalPages - 1;

  const linkClass = (active: boolean) =>
    cn(
      "inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-medium transition",
      active ? paginationActiveClassName : paginationIdleClassName,
    );

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      <Link href="/hotels?page=1" className={linkClass(false)}>
        First
      </Link>

      {pageRange[0] > 1 && (
        <Link
          href={`/hotels?page=${pageRange[0] - 1}`}
          className={linkClass(false)}
        >
          …
        </Link>
      )}

      {pageRange.map((page) => (
        <Link
          key={page}
          href={`/hotels?page=${page}`}
          className={linkClass(currentPage === page)}
          aria-current={currentPage === page ? "page" : undefined}
        >
          {page}
        </Link>
      ))}

      {showRightEllipsis && (
        <Link
          href={`/hotels?page=${pageRange[pageRange.length - 1] + 1}`}
          className={linkClass(false)}
        >
          …
        </Link>
      )}

      <Link
        href={`/hotels?page=${Math.min(currentPage + 1, totalPages)}`}
        className={linkClass(false)}
      >
        Next
      </Link>

      <Link
        href={`/hotels?page=${totalPages}`}
        className={linkClass(false)}
      >
        Last
      </Link>
    </nav>
  );
}
