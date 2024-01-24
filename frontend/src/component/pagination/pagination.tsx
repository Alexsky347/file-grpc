import { ChangeEvent, useState } from "react";

interface PaginationProps {
    onChange: (event: ChangeEvent<unknown>, value: number) => void;
    page: number;
    totalPages: number;
}


export default function Pagination({totalPages, onChange, page}: Readonly<PaginationProps>) {
    const [currentPage, setCurrentPage] = useState(page);

    const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
        onChange(event, value);
    };

    return (
        <div className="join">
            {Array.from({length: totalPages}, (_, i) => i + 1)
                .map((pageNumber) => (
                    <button
                        key={pageNumber}
                        onClick={(event) => handlePageChange(event, pageNumber)}>
                        <input
                            className="join-item btn btn-square"
                            type="radio"
                            name="options"
                            aria-label={pageNumber.toString()}
                            checked={pageNumber === currentPage}
                        />
                    </button>
                ))}
        </div>
    );
}
