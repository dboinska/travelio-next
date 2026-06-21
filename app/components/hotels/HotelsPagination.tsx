import Link from "next/link";

interface Props {
  currentPage: number;
  totalPages: number;
}

export default function HotelsPagination({ currentPage, totalPages }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <Link
        href={`/hotels?page=${Math.max(currentPage - 1, 1)}`}
        className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-white transition hover:bg-zinc-800"
      >
        Previous
      </Link>

      {pages.map((page) => (
        <Link
          key={page}
          href={`/hotels?page=${page}`}
          className={`rounded-lg px-4 py-2 text-sm transition ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          }`}
        >
          {page}
        </Link>
      ))}

      <Link
        href={`/hotels?page=${Math.min(currentPage + 1, totalPages)}`}
        className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-white transition hover:bg-zinc-800"
      >
        Next
      </Link>
    </div>
  );
}
