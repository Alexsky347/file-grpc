import { useState, useEffect } from "react";
import { FileService } from "../service/file.service";
import { toast } from "react-toastify";
import File from "./File";
import Grid from "@mui/material/Grid";
import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";

export default function Main({ sideBarOption, reRender, setReRender }) {
  const fileService = new FileService();
  const [loading, setLoading] = useState(false);
  // UseEffect
  useEffect(() => {
    initGetFiles("drive.png");
  }, [reRender]);

  // State Variables
  const [files, setFiles] = useState();

  /**
   * init
   */
  async function initGetFiles(fileName) {
    setLoading(true);
    const response = await fileService.getFiles(fileName);
    if (response.status === 200) {
      let arrayFiles = await Promise.all(
        response.data.map(async (fileName) => {
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

  // TODO to implement https://mui.com/material-ui/react-grid/
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
            }}
          />
        ) : null}
        {files ? (
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 1, sm: 8, md: 12 }}
            justifyContent="space-evenly"
            alignItems="start"
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
        ) : (
          <h1>No files yet.</h1>
        )}
      </div>
    );
  }
}
