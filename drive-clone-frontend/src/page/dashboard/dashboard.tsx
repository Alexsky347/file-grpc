import React, { useState, useEffect } from 'react';
import { FileService } from '../../service/api/file.service';
import { toast } from 'react-toastify';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { CardC } from '../../component/card-c/card.c';
import { ItResponse } from '../../model/interface/it-response';
import { AxiosHeaders, AxiosResponse, RawAxiosResponseHeaders } from 'axios';
import { styled } from '@mui/system';
import { Avatar } from '@mui/material';
import SearchInput from '../../component/search-input/search-input';
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData(limit, page);
  }, [reRender]);

  async function fetchData(limit: number, page: number) {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    await initGetFiles(limit, page);
  }

  const [files, setFiles] = useState<Array<any>>();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const NoDataStyled = styled('h1')({
    paddingLeft: '50%',
  });

  const handleChangePaginate = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    await fetchData(limit, value);
    setPage(value);
  };

  const handleChangeLimit = async (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const limit = event.target.value as number;
    await fetchData(limit, 1);
    setLimit(limit);
  };

  async function initGetFiles(
    limit: number,
    pageNumber: number,
    orderBy?: string
  ) {
    setLoading(true);

    try {
      const response: AxiosResponse = await FileService.getFiles(
        limit,
        pageNumber,
        orderBy || 'ASC'
      );
      if (response.status === 200) {
        console.log(response);
        const { files, total } = response.data;

        setCount(Math.ceil(total / limit));

        const arrayFiles = files.map(
          (fileInfo: { filename: string; url: string }) => {
            return {
              type: '', // Add type if available from the server
              url: fileInfo.url,
              urlForDownload: fileInfo.url, // Use the same URL for download
              filename: fileInfo.filename,
              createate: '', // Add createate if available from the server
              lastmodified: '', // Add lastmodified if available from the server
              filesize: 0, // Add filesize if available from the server
            };
          }
        );

        setFiles(arrayFiles);
        setLoading(false);
      } else {
        toast.error(`${response.data?.message || 'An error occurred.'}`);
        setLoading(false);
      }
    } catch (error: any) {
      toast.error(`${error?.message}`);
      setLoading(false);
    }
  }

  const handleFileUrl = (data: Blob, name: string) => {
    if (name.endsWith('pdf')) {
      return '/static/pdf.png';
    }
    return URL.createObjectURL(data);
  };

  const getHeaderProp = (
    property: string,
    headers: RawAxiosResponseHeaders | (RawAxiosResponseHeaders & AxiosHeaders)
  ) => {
    if (property === 'Content-Disposition') {
      return headers.get('Content-Disposition')!.split('filename=')[1];
    }
    return headers.get(property);
  };

  if (sideBarOption === 0) {
    return (
      <div className="main">
        {loading ? (
          <CircularProgress
            color="secondary"
            style={{
              width: '10%',
              height: '10',
              position: 'absolute',
              top: '50%',
              left: '50%',
              zIndex: 40,
              color: 'darkblue',
            }}
          />
        ) : null}
        {files && files?.length > 0 ? (
          <>
            <SearchInput sx={{ width: '100%', textAlign: 'center' }} />
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
              <FormControl sx={{ m: 1, minWidth: 5 }}>
                <InputLabel id="demo-simple-select-autowidth-label">
                  Items
                </InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={limit}
                  onChange={handleChangeLimit}
                  autoWidth
                  label="Items"
                >
                  <MenuItem value={10} defaultValue>
                    10
                  </MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
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
          <NoDataStyled>
            <h1>No files yet.</h1>
          </NoDataStyled>
        )}
      </div>
    );
  } else {
    return null;
  }
}
