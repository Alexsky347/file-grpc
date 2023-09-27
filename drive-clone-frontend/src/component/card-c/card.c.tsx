import { useState, ReactElement } from "react";

import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Card from "@mui/material/Card";
import { FileService } from "../../service/api/file.service";
import { toast } from "react-toastify";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {TextField} from "@mui/material";
import { InsertDriveFileOutlined } from "@mui/icons-material";

interface MainProps {
  metaData: {
    filename: string;
    url: string;
    filesize: number;
    createdate: string;
    urlForDownload: string;
  };
  reRender: number;
  setReRender: React.Dispatch<React.SetStateAction<number>>;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  borderRadius: 5,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export function CardC({
  metaData,
  reRender,
  setReRender,
}: MainProps): ReactElement {
  const [open, setOpen] = useState(false);
  const [newFileName, setNewFileName] = useState<string | undefined>(
    metaData?.filename
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Delete
  const handleDelete = async () => {
    if (metaData?.filename) {
      const response = await FileService.deleteFile(metaData.filename) as unknown as Response;
      if (response.status === 200) {
        reRender ? setReRender(0) : setReRender(1);
        toast.success("CardComponent removed !");
      } else {
        toast.error(response.statusText);
      }
    } else {
      toast.error("No file founded !");
    }
  };

  // download
  const handleDownload = () => {
    if (metaData?.filename && metaData?.urlForDownload) {
      const alink = document.createElement("a");
      alink.href = metaData.urlForDownload;
      alink.download = metaData.filename;
      alink.click();
    } else {
      toast.error("No file founded !");
    }
  };

  // Rename
  const handleRename = async () => {
    if (metaData?.filename) {
      if (metaData?.filename === newFileName) {
        toast.warning("same file name");
      } else {
        const response = await FileService.renameFile(
          metaData?.filename,
          newFileName as string
        );
        if (response.status === 200) {
          handleClose();
          toast.success("CardComponent renamed !");
          reRender ? setReRender(0) : setReRender(1);
        } else {
          toast.error(`${response?.response?.data?.errorMessage}`);
        }
      }
    } else {
      toast.error("No file founded !");
    }
  };

  const handleFileName = (fileName: string) => {
    if (fileName) {
      return fileName.replaceAll("%20", " ");
    }
    return fileName;
  };

  return (
    <div>
      <Card>
        <CardHeader title={handleFileName(metaData?.filename)} subheader="" />
        <CardMedia
          component="img"
          height="194"
          image={metaData?.url}
          alt="picture"
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Size: {metaData?.filesize} MB
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Creation date: {metaData?.createdate}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton onClick={handleDelete} aria-label="remove">
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={handleOpen} aria-label="add">
            <CreateIcon />
          </IconButton>
          <IconButton>
            <InsertDriveFileOutlined />
          </IconButton>
          <IconButton onClick={handleDownload} aria-label="download">
            <DownloadIcon />
          </IconButton>
        </CardActions>
      </Card>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <TextField
              required
              id="outlined-full-width"
              label="CardComponent Name"
              margin="normal"
              variant="outlined"
              fullWidth
              style={{ margin: 8 }}
              InputLabelProps={{
                shrink: true,
              }}
              defaultValue={handleFileName(metaData?.filename.split(".")[0])}
              onChange={(e) => {
                setNewFileName(
                  e.target.value + "." + metaData?.filename.split(".")[1]
                );
              }}
            />
          </Typography>

          <Button style={{ margin: 8 }} variant="contained" onClick={handleRename}>
            Save
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
