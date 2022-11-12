import { useState, useEffect } from "react";
import { FileService } from "../service/file.service";
import { toast } from "react-toastify";
import File from "./File";
import Grid from "@mui/material/Grid";
import { experimentalStyled as styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function Main({ sideBarOption, reRender, setReRender }) {
  const fileService = new FileService();
  const [loading, setLoading] = useState(false);
  // UseEffect
  useEffect(() => {
    async function fetchData() {
      await initGetFiles(limit, page);
    }
    fetchData();
  }, [reRender]);

  // State Variables
  const [files, setFiles] = useState();


  const [count, setCount] = useState(0);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const handleChangePaginate = async (event, value) => {
    const page = await value;
    await initGetFiles(limit, value);
    setPage(page);
  };

  const handleChangeLimit = async (event) => {
    const limit = await event.target.value;
    await initGetFiles(limit, 1);
    setLimit(limit);
  };


  /**
   * init
   */
  async function initGetFiles(limit, pageNumber, orderBy) {
    setLoading(true);
    const response = await fileService.getFiles(limit, pageNumber, orderBy);
    if (response.status === 200) {
      setCount(Math.ceil(response.data.total.shift() / limit))
      let arrayFiles = await Promise.all(
        response.data.data.map(async (fileName) => {
          let responseFile = await fileService.getFile(fileName);
          const { headers, data } = responseFile;
          const fileNickName = getHeaderProp("Content-Disposition", headers);

          return {
            type: getHeaderProp("Content-Type", headers),
            url: handleFileUrl(data, fileNickName),
            urlForDownload: URL.createObjectURL(data),
            filename: fileNickName,
            createdate: getHeaderProp("Content-Created", headers),
            lastmodified: getHeaderProp("Content-Modified", headers),
            filesize: getHeaderProp("Content-Length", headers) / 1000,
          };
        })
      );

      setFiles(arrayFiles);
      setLoading(false);
    } else {
      toast.error(`${response?.response?.data?.errorMessage}`);
      setLoading(false);
    }
  }

  /**
   *
   * @param {*} data
   * @param {*} name
   * @returns
   */
  const handleFileUrl = (data, name) => {
    if (name.endsWith("pdf")) {
      return "/static/pdf.png";
    }
    return URL.createObjectURL(data);
  };

  /**
   *
   * @param {*} property
   * @param {*} headers
   * @returns
   */
  const getHeaderProp = (property, headers) => {
    if (headers && headers.get(property)) {
      if (property === "Content-Disposition") {
        return headers.get("Content-Disposition").split("filename=")[1];
      }
      return headers.get(property);
    }
    return null;
  };

  // Render main according to side bar option
  if (sideBarOption === 0) {
    return (
      <div className="main">
        {loading ? (
          <CircularProgress
            color="secondary"
            style={{
              width: "10%",
              height: "10",
              position: "absolute",
              top: "50%",
              left: "50%",
              zIndex: 40,
              color: 'darkblue'
            }}
          />
        ) : null}
        {files ? (
          <>
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 1, sm: 8, md: 16 }}
              justifyContent="space-evenly"
              alignItems="start"
              padding={5}
            >
              {files.map((file, i) => (
                <Grid item xs={2} sm={4} md={3} key={i}>
                  <File
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
              display="flex">
              <FormControl sx={{ m: 1, minWidth: 5 }}>
                <InputLabel id="demo-simple-select-autowidth-label">Items</InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={limit}
                  onChange={handleChangeLimit}
                  autoWidth
                  label="Items"
                >
                  <MenuItem value={10} defaultValue >10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
              <Pagination
                defaultPage={1}
                siblingCount={0}
                boundaryCount={1}
                count={count}
                color={"primary"}
                page={page}
                onChange={handleChangePaginate}
                variant="outlined"
                showFirstButton showLastButton />
            </Stack>
          </>

        ) : (
          <h1>No files yet.</h1>
        )}
      </div>
    );
  }
}
