import React, { ChangeEvent, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { CardC } from '../../component/card-c/card.c';
import SearchInput from '../../component/search-input/search-input';
import { debounce } from '../../utils/main/utils';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { findAll } from '../../store/slices/file';
import { FileCollection } from '../../model/interface/file';
import SelectC from '../../component/select-c/select-c';

interface DashboardProps {
  sideBarOption: number;
  reRender: number;
  setReRender: React.Dispatch<React.SetStateAction<number>>;
}

export function Dashboard({
  sideBarOption,
  reRender,
  setReRender,
}: DashboardProps) {
  const PAGE_INIT = 10;
  const [files, setFiles] = useState<FileCollection>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(PAGE_INIT);
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState('name-ASC');

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchData = async (
      limit: number,
      page: number,
      search: string,
      orderBy: string,
      dispatch: AppDispatch
    ) => {
      const response: any = await dispatch(
        findAll({ limit, page, search, orderBy })
      );
      const { files, total } = response.payload;
      setFiles(files);
      setCount(total);
      scrollToTop();
    };
    fetchData(limit, page, search, orderBy, dispatch);
  }, [reRender, limit, page, search, orderBy, dispatch]);

  /**
   *
   * @param event
   * @param value
   */
  const handleChangePaginate = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  /**
   *
   * @param event
   */
  const handleChangeLimit = async (event: SelectChangeEvent<number>) => {
    const limit = event.target.value as number;
    setLimit(limit);
  };

  const scrollToTop = () =>
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

  const handleSearchChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    const debouncedSearch = debounce(() => setSearch(value || ''), 500);
    debouncedSearch();
  };

  const handleSelectChange = async (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event;
    const debouncedSearch = debounce(() => setOrderBy(value || ''), 500);
    debouncedSearch();
  };

  if (sideBarOption === 0) {
    return (
      <div className="main">
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 1, sm: 8, md: 16 }}
          justifyContent="space-evenly"
          alignItems="center"
          padding="2px"
        >
          <Grid item xs={2} sm={4} md={3} maxWidth="80%">
            <SearchInput sx={{ width: '100%' }} onChange={handleSearchChange} />
          </Grid>
          <Grid item xs={2} sm={4} md={3} maxWidth="80%">
            <SelectC onChangeSelect={handleSelectChange} />
          </Grid>
        </Grid>

        {files && files?.length > 0 ? (
          <>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 1, sm: 8, md: 16 }}
              justifyContent="space-evenly"
              alignItems="start"
              padding="2px"
            >
              {files.map((file, i) => (
                <Grid item xs={2} sm={4} md={3} key={i} maxWidth="100%">
                  <CardC
                    metaData={file}
                    reRender={reRender}
                    setReRender={setReRender}
                    key={i}
                  />
                </Grid>
              ))}
            </Grid>
            <Stack
              padding={5}
              spacing={2}
              flexWrap="wrap"
              flexDirection="row"
              justifyContent="center"
              display="flex"
            >
              <FormControl sx={{ m: 1, minWidth: 80 }}>
                <InputLabel id="limit-select">Items</InputLabel>
                <Select
                  labelId="limit-select"
                  id="limit-select"
                  value={limit}
                  onChange={handleChangeLimit}
                  autoWidth
                  label="Items"
                >
                  <MenuItem value={PAGE_INIT}>10</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                </Select>
              </FormControl>
              <Pagination
                defaultPage={1}
                siblingCount={0}
                boundaryCount={1}
                count={count}
                color="primary"
                page={page}
                onChange={handleChangePaginate}
                variant="outlined"
                showFirstButton
                showLastButton
              />
            </Stack>
          </>
        ) : (
          <h2 style={{ width: '100%', paddingTop: '10%', textAlign: 'center' }}>
            No files yet.
          </h2>
        )}
      </div>
    );
  } else {
    return null;
  }
}
