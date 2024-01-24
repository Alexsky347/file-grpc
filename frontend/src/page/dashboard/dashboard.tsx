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
    const PAGE_INIT = 20;
    const widthNav = sideNavOpen ? 190 : 120;
    const [files, setFiles] = useState<FileCollection>([]);
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(PAGE_INIT);
    const [search, setSearch] = useState('');
    const [orderBy, setOrderBy] = useState('name-ASC');
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
            console.log({files, total})
            setFiles(files);
            setCount(total);
            scrollToTop();
        };
        fetchData(limit, page, search, orderBy, dispatch);
    }, [limit, page, search, orderBy, dispatch]);

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
            <div className="m-10">
                <input type="text"
                       id="filter"
                       name="filter"
                       placeholder="Filter by ..."
                       className="input input-bordered w-full max-w-xs"
                       onChange={handleSearchChange}/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6"
                 style={{marginLeft: `${widthNav}px`}}>
                {files && files?.length > 0 ? (
                    <>
                        {files.map((file, i) => (
                            <CardC
                                metaData={file}
                                key={i}
                            />
                        ))}
                    </>
                ) : (
                    <h2 style={{width: '100%', paddingTop: '10%', textAlign: 'center'}}>
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
