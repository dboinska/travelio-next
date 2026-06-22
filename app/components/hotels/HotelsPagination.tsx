import Link from "next/link";

interface Props {
  currentPage: number;
  totalPages: number;
}

function getPaginationRange(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
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

  return (
    <ul className="pagination mt-10">
      <li className="circle">
        <Link href="/hotels?page=1" className="page-link">
          First
        </Link>
      </li>

      {pageRange[0] > 1 && (
        <li className="circle">
          <Link href={`/hotels?page=${pageRange[0] - 1}`} className="page-link">
            ...
          </Link>
        </li>
      )}

      {pageRange.map((page) => (
        <li key={page} className="circle">
          <Link
            href={`/hotels?page=${page}`}
            className={`page-link ${currentPage === page ? "active" : ""}`}
          >
            {page}
          </Link>
        </li>
      ))}

      {showRightEllipsis && (
        <li className="circle">
          <Link
            href={`/hotels?page=${pageRange[pageRange.length - 1] + 1}`}
            className="page-link hover-off"
          >
            ...
          </Link>
        </li>
      )}

      <li className="circle">
        <Link
          href={`/hotels?page=${Math.min(currentPage + 1, totalPages)}`}
          className="page-link"
        >
          Next
        </Link>
      </li>

      <li className="circle">
        <Link href={`/hotels?page=${totalPages}`} className="page-link">
          Last
        </Link>
      </li>
    </ul>
  );
}
