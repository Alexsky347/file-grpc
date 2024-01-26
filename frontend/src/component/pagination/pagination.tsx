import { ChangeEvent, useState } from "react";

interface PaginationProps {
  onChange: (event: ChangeEvent<unknown>, value: number) => void;
  page: number;
  totalCount: number;
  limit: number;
}

export default function Pagination({
  totalCount,
  onChange,
  page,
  limit,
}: Readonly<PaginationProps>) {
  const [currentPage, setCurrentPage] = useState(page);
  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    onChange(event, value);
  };

  return (
    <div className="join">
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .slice(0, currentPage + 3)
        .map((pageNumber) =>
          pageNumber % 3 === 0 ? (
            <button key={pageNumber} className="join-item btn btn-disabled">
              ...
            </button>
          ) : (
            <button
              key={pageNumber}
              onClick={(event) => handlePageChange(event, pageNumber)}
            >
              <input
                className="join-item btn btn-square"
                type="radio"
                name="options"
                aria-label={pageNumber.toString()}
                checked={pageNumber === currentPage}
                readOnly
              />
            </button>
          )
        )}
    </div>
  );
}
