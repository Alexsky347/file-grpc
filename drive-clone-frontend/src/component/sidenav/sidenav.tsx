import styles from './sidenav.module.scss';
import { useState, useEffect, MouseEvent } from 'react';
import { styled } from '@mui/system';
import ComputerIcon from '@mui/icons-material/Computer';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';
import * as React from 'react';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator, {
  listItemDecoratorClasses,
} from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemButton from '@mui/joy/ListItemButton';
import { FileService } from '../../service/api/file.service';
import { ItResponse } from '../../model/interface/it-response';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { logout } from '../../store/slices/auth';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import Divider from '@mui/material/Divider';

interface SideBarProps {
  setSideBarOption: React.Dispatch<React.SetStateAction<number>>;
  reRender: number;
  setReRender: React.Dispatch<React.SetStateAction<number>>;
  handleSideNav: boolean;
}

function Sidenav({
  setSideBarOption,
  reRender,
  setReRender,
  handleSideNav,
}: SideBarProps) {
  const [listActive1, setListActive1] = useState<string>('list-item-active');
  const [listActive2, setListActive2] = useState<string>('');
  const [isFileUploaded, setIsFileUploaded] = useState<boolean>(false);
  const [metaData, setMetaData] = useState<Record<string, any>>([]);
  const [files, setFiles] = useState<FileList | null>();
  const [open, setOpen] = useState<boolean>(false);
  const [widthNav, setWidthNav] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    handleSideNav ? setWidthNav(200) : setWidthNav(75);
  }, [handleSideNav]);

  // styles
  const StyledBtn = styled(Button)({
    color: '#5F6368',
    width: 36,
    height: 36,
  });

  // Functions
  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleClick = (option: number) => {
    setSideBarOption(option);
  };

  const handleLogout = async (): Promise<void> => {
    await dispatch(logout());
  };

  const handleUpload = async (e: MouseEvent) => {
    let response: ItResponse;
    const data = new FormData();

    if (files?.length === 1) {
      data.append('file', files[0]);
      response = (await FileService.uploadOneFile(
        data
      )) as unknown as ItResponse;
    } else {
      Array.from(files!).forEach((element) => {
        data.append('file', element);
      });
      response = (await FileService.uploadMultipleFiles(
        data
      )) as unknown as ItResponse;
    }

    if (response.status === 200) {
      reRender ? setReRender(0) : setReRender(1);
      setFiles(null);
      setMetaData([]);
      setIsFileUploaded(false);
    } else {
      toast.error(`${response?.response?.data?.errorMessage}`);
    }
    // e.target?.value = "";
    handleClose();
  };

  return (
    <div className={styles['container']}>
      <Box
        sx={{
          py: 2,
          pr: 2,
          width: widthNav,
          border: '1px solid rgba(0, 0, 0, 0.05)',
          height: '91vh',
          paddingRight: 0,
        }}
      >
        <List
          aria-label="Sidebar"
          sx={{
            // ...applyRadiusOnEdges({ target: 'deepest' | 'nested' }),
            '--List-item-paddingLeft': '0px',
            '--List-decorator-size': '64px',
            '--List-decorator-color': (theme) => theme.palette.text.secondary,
            '--List-item-minHeight': '32px',
            '--List-nestedInsetStart': '13px',
            [`& .${listItemDecoratorClasses.root}`]: {
              justifyContent: 'flex-end',
              pr: '18px',
            },
            '& [role="button"]': {
              borderRadius: '0 20px 20px 0',
            },
            height: '100%',
          }}
        >
          <ListItem
            sx={{
              '&:hover': {
                backgroundColor: 'white-smoke',
                opacity: [0.9, 0.8, 0.7],
              },
            }}
          >
            <ListItemButton
              className={`list-item ${listActive1}`}
              onClick={handleOpen}
            >
              <ListItemDecorator>
                <StyledBtn>
                  <img src="/static/add.svg" alt="Logo" />
                </StyledBtn>
              </ListItemDecorator>
              {handleSideNav ? <ListItemContent>New</ListItemContent> : null}
            </ListItemButton>
          </ListItem>

          <ListItem
            sx={{
              '&:hover': {
                backgroundColor: 'white-smoke',
                opacity: [0.9, 0.8, 0.7],
              },
            }}
          >
            <ListItemButton
              className={`list-item ${listActive1}`}
              onClick={() => {
                handleClick(0);
                setListActive1('list-item-active');
                setListActive2('');
              }}
            >
              <ListItemDecorator>
                <StyledBtn>
                  <ComputerIcon fontSize="large" />
                </StyledBtn>
              </ListItemDecorator>
              {handleSideNav ? (
                <ListItemContent>My Drive</ListItemContent>
              ) : null}
            </ListItemButton>
          </ListItem>
          <Divider variant="middle" component="li" />
          <ListItem
            sx={{
              '&:hover': {
                backgroundColor: 'white-smoke',
                opacity: [0.9, 0.8, 0.7],
              },
            }}
          >
            <ListItemButton
              className={`list-item ${listActive1}`}
              onClick={() => {
                handleLogout();
                setListActive1('list-item-active');
                setListActive2('');
              }}
            >
              <ListItemDecorator>
                <StyledBtn>
                  <ExitToAppIcon fontSize="large" />
                </StyledBtn>
              </ListItemDecorator>
              {handleSideNav ? (
                <ListItemContent>Exit App</ListItemContent>
              ) : null}
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          className="upload-modal"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60%',
            borderRadius: 5,
            bgColor: 'background.paper',
            boxShadow: '24x',
            p: 4,
          }}
        >
          {isFileUploaded ? (
            <div className="metaData">
              <p>File name : {metaData.fileName}</p>
              <p>Created : {metaData.createDate}</p>
              <p>Last modified : {metaData.lastModified}</p>
              <p>size : {metaData.fileSize} MB</p>
            </div>
          ) : (
            <div className="metaData not-uploaded">
              <p>No files yet</p>
            </div>
          )}

          {isFileUploaded ? (
            <Button
              className="upload-button"
              variant="contained"
              component="label"
              onClick={(e) => {
                handleUpload(e);
              }}
            >
              Upload
            </Button>
          ) : (
            <Button variant="contained" component="label">
              Select one or multiple file(s)
              <input
                type="file"
                multiple
                onChange={(e) => {
                  setMetaData({
                    fileName: e.target.files![0].name,
                    createDate: new Date(
                      e.target.files![0].lastModified
                    ).toDateString(),
                    lastModified: new Date(
                      e.target.files![0].lastModified
                    ).toDateString(),
                    fileSize: (
                      Math.round(
                        e.target.files![0].size * Math.pow(10, -6) * 100
                      ) / 100
                    ).toFixed(3),
                    type: e.target.files![0].type,
                  });

                  setFiles(e.target.files);
                  setIsFileUploaded(true);
                }}
                hidden
              />
            </Button>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export { Sidenav };
function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}
