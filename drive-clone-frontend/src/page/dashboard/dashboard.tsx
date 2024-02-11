import Pagination from '../../component/pagination/pagination.tsx';
import { CardC } from '../../component/card-c/card.c.tsx';
import { FileCollection } from '../../model/interface/file.ts';
import { ChangeEvent, Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { AppDispatch } from '../../store/store.ts';
import { useDispatch } from 'react-redux';
import { findAll } from '../../store/slices/file.ts';
import { isMobile } from 'react-device-detect';
import NewDirectory from '../../component/new-directory/new-directory.tsx';
import { InputSearch } from '../../component/input-search/input-search.tsx';

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
  const limit = 30;
  const orderBy = 'name-ASC';
  const screenMinWidth = isMobile ? 0 : 80;
  const widthNav = sideNavOpen ? 200 : screenMinWidth;
  const [files, setFiles] = useState<FileCollection>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
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
   *
   * @param _event
   * @param value
   */
  const handleChangePaginate = async (_event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  return (
    <>
      <InputSearch searchValue={search} searchSetter={setSearch} />
      <div className='flex justify-center'>
        <div
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6'
          style={{ marginLeft: `${widthNav}px` }}
        >
          <NewDirectory isAddingDirectory={false} />
          {files && files?.length > 0 ? (
            <>
              {files.map((file) => (
                <CardC metaData={file} key={file.id ?? file.name} setReRender={setReRender} />
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
