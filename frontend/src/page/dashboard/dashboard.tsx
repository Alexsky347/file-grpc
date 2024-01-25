import Pagination from "../../component/pagination/pagination.tsx";
import { CardC } from "../../component/card-c/card.c.tsx";
import { FileCollection } from "../../model/interface/file.ts";
import { ChangeEvent, useEffect, useState } from "react";
import { AppDispatch } from "../../store/store.ts";
import { useDispatch } from "react-redux";
import { findAll } from "../../store/slices/file.ts";
import { debounce } from "../../utils/main/utils.ts";

interface DashboardProps {
    sideNavOpen: boolean;
}

export default function Dashboard({sideNavOpen}: Readonly<DashboardProps>) {
    const PAGE_INIT = 10;
    const widthNav = sideNavOpen ? 190 : 120;
    const [files, setFiles] = useState<FileCollection>([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(PAGE_INIT);
    const [search, setSearch] = useState('');
    const [orderBy, setOrderBy] = useState('name-ASC');
    const [reRender, setReRender] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const scrollToTop = () =>
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});

    useEffect(() => {
        const fetchData = async (
            limit: number,
            page: number,
            search: string,
            orderBy: string,
            dispatch: AppDispatch
        ) => {
            const response: any = await dispatch(
                findAll({limit, page, search, orderBy})
            );
            const {files, total} = response.payload;
            setFiles(files);
            setCount(total);
            scrollToTop();
        };
        fetchData(limit, page, search, orderBy, dispatch);
    }, [limit, page, search, orderBy, reRender, dispatch]);

    /**
     * Handle search change
     * @param event
     */
    const handleSearchChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const {
            target: {value},
        } = event;
        const debouncedSearch = debounce(() => setSearch(value || ''), 500);
        debouncedSearch();
    };

    /**
     *
     * @param _event
     * @param value
     */
    const handleChangePaginate = async (
        _event: ChangeEvent<unknown>,
        value: number
    ) => {
        setPage(value);
    };
    return (
        <>
            <div className="m-10 flex items-center justify-center space-x-2">
                <input autoComplete="off"
                       placeholder="Search"
                       name="form-field-name"
                       className="input input-bordered input-primary w-full max-w-xs"
                       onChange={handleSearchChange}/>
                <div className="inline-block">
                    <svg className="text-gray-500 -ml-10 z-20" width="30" height="30" viewBox="0 0 15 15" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
                            fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                        </path>
                    </svg>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6"
                 style={{marginLeft: `${widthNav}px`}}>
                {files && files?.length > 0 ? (
                    <>
                        {files.map((file) => (
                            <CardC
                                metaData={file}
                                key={file.id}
                                reRender={reRender}
                                setReRender={setReRender}
                            />
                        ))}
                    </>
                ) : (
                    <h2 className="w-full m-auto text-center text-2xl">
                        No files yet.
                    </h2>
                )}
            </div>
            <div
                className="m-10"
                // className="fixed bottom-10"
            >
                <Pagination
                    totalPages={count}
                    onChange={handleChangePaginate}
                    page={page}
                />
            </div>
        </>
    );
}
