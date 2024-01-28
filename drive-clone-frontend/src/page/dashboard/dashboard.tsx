import Pagination from '../../component/pagination/pagination.tsx';
import { CardC } from '../../component/card-c/card.c.tsx';
import { FileCollection } from '../../model/interface/file.ts';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AppDispatch } from '../../store/store.ts';
import { useDispatch } from 'react-redux';
import { findAll } from '../../store/slices/file.ts';
import { Cross1Icon } from '@radix-ui/react-icons';
import { debounce } from '../../utils/main/utils.ts';

interface DashboardProperties {
  sideNavOpen: boolean;
  reRender: boolean;
  setReRender: Dispatch<SetStateAction<boolean>>;
}

export default function Dashboard({
  sideNavOpen,
  reRender,
  setReRender,
}: Readonly<DashboardProperties>) {
  const LIMIT = 10;
  const widthNav = sideNavOpen ? 150 : 0;
  const [files, setFiles] = useState<FileCollection>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(LIMIT);
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState('name-ASC');
  const [index, setIndex] = useState(2);
  const loaderReference = useRef(null);
  const dispatch = useDispatch<AppDispatch>();

  const scrollToTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

  const fetchData = useCallback(
    async (limit: number, page: number, search: string, orderBy: string, dispatch: AppDispatch) => {
      const response: any = await dispatch(findAll({ limit, page, search, orderBy }));
      const { files, total } = response.payload;
      setFiles(files);
      setCount(total);
      scrollToTop();
    },
    [],
  );

  useEffect(() => {
    fetchData(limit, page, search, orderBy, dispatch);
  }, [limit, page, search, orderBy, reRender, dispatch, fetchData]);

  /**
   * Handle search change
   * @param event
   */
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setSearch(value || '');
    const debouncedSearch = debounce(() => setSearch(value || ''), 200);
    debouncedSearch();
    // debouncedRequest();
  };

  /**
   * Clear search bar
   */
  const clearSearchBar = () => {
    setSearch('');
  };

  /**
   *
   * @param _event
   * @param value
   */
  const handleChangePaginate = async (_event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  return (
    <>
      <div className='mb-7 flex items-center justify-center space-x-2'>
        {search ? (
          <button className='-mr-7 z-20' onClick={clearSearchBar}>
            <Cross1Icon className='w-5 h-5 text-red-500' />
          </button>
        ) : undefined}

        <input
          autoComplete='off'
          value={search}
          placeholder='Search'
          type='text'
          name='form-field-name'
          className='input input-bordered w-full max-w-xs'
          onChange={handleSearchChange}
        />
        <div className='inline-block'>
          <svg
            className='text-gray-500 -ml-10 z-20'
            width='30'
            height='30'
            viewBox='0 0 15 15'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z'
              fill='currentColor'
              fillRule='evenodd'
              clipRule='evenodd'
            ></path>
          </svg>
        </div>
      </div>

      <div className='flex justify-center'>
        <div
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6'
          style={{ marginLeft: `${widthNav}px` }}
        >
          {files && files?.length > 0 ? (
            <>
              {files.map((file) => (
                <CardC
                  metaData={file}
                  key={file.name + index}
                  reRender={reRender}
                  setReRender={setReRender}
                />
              ))}
            </>
          ) : (
            <h2 className='w-full m-auto text-center text-2xl'>No files yet.</h2>
          )}
        </div>
      </div>
      <div
        className='fixed bottom-10 m-auto w-full z-10'
        // className=""
      >
        <Pagination
          key={'pagination'}
          totalCount={count}
          onChange={handleChangePaginate}
          page={page}
          limit={limit}
        />
      </div>
    </>
  );
}
