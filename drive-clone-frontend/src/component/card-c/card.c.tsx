import { useState, ReactElement, useEffect } from 'react';

import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Card from '@mui/material/Card';
import { FileService } from '../../service/api/file.service';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Avatar, TextField } from '@mui/material';
import { FolderZipOutlined } from '@mui/icons-material';
import { styled } from '@mui/system';
import { format } from 'date-fns';
import { MyFile } from './../../model/interface/file';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { deleteFile, renameFile, zipFile } from '../../store/slices/file';

interface MainProps {
  metaData: MyFile;
  reRender: number;
  setReRender: React.Dispatch<React.SetStateAction<number>>;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  borderRadius: 5,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export function CardC({
  metaData,
  reRender,
  setReRender,
}: MainProps): ReactElement {
  const [open, setOpen] = useState(false);
  const [newFileName, setNewFileName] = useState<string | undefined>('');
  const { message } = useSelector((state: { message: any }) => state.message);
  const { hasDeleted, hasRenamed } = useSelector(
    (state: { file: any }) => state.file
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setNewFileName(metaData?.name);
  }, [message, hasDeleted, hasRenamed, metaData?.name]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleReRender = () => setReRender(reRender ? 0 : 1);

  // Delete
  const handleDelete = async () => {
    const response: any = await dispatch(deleteFile(metaData));
    if (!response?.error) {
      handleReRender();
    }
  };

  const handleDownload = () => {
    if (metaData?.name && metaData?.url) {
      const anchor = document.createElement('a');
      const fileType = metaData?.name.split('.')[1];
      let contentType = `image/${fileType}`;
      if (fileType === 'pdf') {
        contentType = `application/${metaData?.name.split('.')[1]}`;
      }
      anchor.href = `data:${contentType};base64,${metaData?.url}`;
      anchor.type = contentType;
      anchor.download = metaData.name;
      anchor.click();
    } else {
      console.warn('No file founded !');
    }
  };

  // Rename
  const handleRename = async () => {
    const newFileNamed = handleFileName(newFileName || '');
    const response: any = await dispatch(
      renameFile({ metaData, newFileName: newFileNamed })
    );
    if (!response?.error) {
      handleClose();
      handleReRender();
    }
  };

  const handleZip = async () => {
    await dispatch(zipFile({ name: metaData.name }));
  };

  const handleFileName = (fileName: string | undefined) => {
    if (fileName) {
      return fileName.replaceAll('%20', ' ');
    }
    return '';
  };

  return (
    <div>
      <Card>
        <CardHeader title="" subheader={handleFileName(metaData?.name)} />
        <CardMedia
          sx={{ objectFit: 'contain' }}
          component="img"
          height="194"
          image={
            metaData?.url && metaData?.contentType.includes('image')
              ? `data:${metaData.contentType};base64,${metaData?.url}`
              : '/static/no-picture.jpg'
          }
          alt="picture"
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {(metaData?.size / 100).toFixed(2)} bytes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {format(new Date(metaData?.createdDate), 'yyyy-MM-dd')}
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
            <FolderZipOutlined onClick={handleZip} aria-label="zip file" />
          </IconButton>
          <IconButton onClick={handleDownload} aria-label="download file">
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
              defaultValue={handleFileName(metaData?.name.split('.')[0])}
              onChange={(e) => {
                setNewFileName(
                  e.target.value + '.' + metaData?.name.split('.')[1]
                );
              }}
            />
          </Typography>

          <Button
            style={{ margin: 8 }}
            variant="contained"
            onClick={handleRename}
          >
            Save
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
