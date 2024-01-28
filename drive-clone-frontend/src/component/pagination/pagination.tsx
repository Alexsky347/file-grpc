import { ChangeEvent, useState } from 'react';

interface PaginationProperties {
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
}: Readonly<PaginationProperties>) {
  const [currentPage, setCurrentPage] = useState(page);
  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    onChange(event, value);
  };

  const getPages = (totalPages: number, currentPage: number) => {
    let diff = 0;
    const result = [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
    if (result[0] < 3) {
      diff = 1 - result[0];
    }
    if (result.at(-1) > totalPages - 2) {
      diff = totalPages - result.at(-1);
    }
    return result
      .map((r) => r + diff)
      .map((pageNumber) => (
        <button key={pageNumber} onClick={(event) => handlePageChange(event, pageNumber)}>
          <input
            className='join-item btn btn-square'
            type='radio'
            name='options'
            aria-label={pageNumber.toString()}
            checked={pageNumber === currentPage}
            readOnly
          />
        </button>
      ));
  };

  return (
    <div className='join'>
      {totalPages <= 5 &&
        Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button key={pageNumber} onClick={(event) => handlePageChange(event, pageNumber)}>
            <input
              className='join-item btn btn-square'
              type='radio'
              name='options'
              aria-label={pageNumber.toString()}
              checked={pageNumber === currentPage}
              readOnly
            />
          </button>
        ))}
      {totalPages > 5 && getPages(totalPages, currentPage)}
    </div>
  );
}
