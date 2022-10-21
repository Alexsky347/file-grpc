import { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/styles';
import ComputerIcon from '@material-ui/icons/Computer';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';
import { FileService } from '../service/file.service';
import * as React from 'react';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator, {
	listItemDecoratorClasses,
} from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemButton from '@mui/joy/ListItemButton';
import { height } from '@mui/system';






export default function SideBar({
	sideBarOption,
	setSideBarOption,
	reRender,
	setReRender,
	handleSideNav
}) {


	const [listActive1, setListActive1] = useState('list-item-active');
	const [listActive2, setListActive2] = useState('');
	const [isFileUploaded, setIsFileUploaded] = useState(false);
	const [metaData, setMetaData] = useState({});
	const [file, setFile] = useState();
	const breakpoint = 620;
	const [open, setOpen] = useState(false);
	const [widthNav, setWidthNav] = useState(0);

	useEffect(() => {
		handleSideNav ? setWidthNav(200) : setWidthNav(70);
	}, [handleSideNav]);

	const fileService = new FileService();



	// styles
	const stylesClasses = {
		btn: {
			color: '#5F6368',
			width: 36,
			height: 36
		},
		uploadbtn: {
			color: '#2185FC',
			fontSize: '40px',
		},
		sidenav: {
			py: 2,
			pr: 2,
			width: widthNav,
			border: '1px solid rgba(0, 0, 0, 0.05)',
			display: 'block',
			height: '91vh'
		},
		main: {
			position: 'relative',
			borderRadius: 5,
			boxShadow: 24,
			p: 4,
		}
	};




	// Functions
	const handleOpen = () => setOpen(true);

	const handleClose = () => setOpen(false);

	const handleClick = (option) => {
		setSideBarOption(option);
	};

	const handleUpload = async (e) => {
		var data = new FormData();
		data.append('file', file);
		const response = await fileService.uploadOneFile(data);
		if (response.status === 200) {
			reRender ? setReRender(0) : setReRender(1);
			setFile();
			setMetaData({});
			setIsFileUploaded(false);
		} else {
			toast.error(`${response?.response?.data?.errorMessage}`);
		}
		e.target.files = {};
		handleClose();
	};


	return (
		<div>
			<Box sx={stylesClasses.sidenav}>
				<List
					aria-label="Sidebar"
					sx={{
						// ...applyRadiusOnEdges({ target: 'deepest' | 'nested' }),
						'--List-item-paddingLeft': '0px',
						'--List-decorator-size': '64px',
						'--List-decorator-color': (theme) => theme.vars.palette.text.secondary,
						'--List-item-minHeight': '32px',
						'--List-nestedInsetStart': '13px',
						[`& .${listItemDecoratorClasses.root}`]: {
							justifyContent: 'flex-end',
							pr: '18px',
						},
						'& [role="button"]': {
							borderRadius: '0 20px 20px 0',
						},
					}}
				>
					<ListItem sx={{
						'&:hover': {
							backgroundColor: 'white-smoke',
							opacity: [0.9, 0.8, 0.7],
						}
					}}>
						<ListItemButton
							className={`list-item ${listActive1}`}
							onClick={handleOpen}
						>
							<ListItemDecorator>
								<img
									className={stylesClasses.btn}
									src='/static/add.svg'
									alt="Logo"
								/>
							</ListItemDecorator>
							{handleSideNav ? <ListItemContent>New</ListItemContent> : null}
						</ListItemButton>
					</ListItem>

					<ListItem sx={{
						'&:hover': {
							backgroundColor: 'white-smoke',
							opacity: [0.9, 0.8, 0.7],
						}
					}}>
						<ListItemButton
							className={`list-item ${listActive1}`}
							onClick={() => {
								handleClick(0);
								setListActive1('list-item-active');
								setListActive2('');
							}}>
							<ListItemDecorator>
								<ComputerIcon className={stylesClasses.btn} fontSize="large" />
							</ListItemDecorator>
							{handleSideNav ? <ListItemContent>My Drive</ListItemContent> : null}
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
				<Box className="upload-modal" sx={stylesClasses.main}>
					{isFileUploaded ? (
						<div className="metaData">
							<p>File name : {metaData.fileName}</p>
							<p>Created : {metaData.createDate}</p>
							<p>Last modified : {metaData.lastModified}</p>
							<p>size : {metaData.fileSize} MB</p>
							{ }
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
							Select File
							<input
								type="file"
								onChange={(e) => {
									setMetaData({
										fileName: e.target.files[0].name,
										createDate: new Date(
											e.target.files[0].lastModified
										).toDateString(),
										lastModified: new Date(
											e.target.files[0].lastModified
										).toDateString(),
										fileSize: (
											Math.round(
												e.target.files[0].size * Math.pow(10, -6) * 100
											) / 100
										).toFixed(3),
										type: e.target.files[0].type,
									});

									setFile(e.target.files[0]);
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
};

