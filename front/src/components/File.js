/* eslint-disable react/style-prop-object */
import { useState } from 'react';

import { TextField } from '@material-ui/core';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { FileService } from '../service/file.service';
import { toast } from 'react-toastify';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';


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

export default function Main({ metaData, reRender, setReRender }) {

	const [open, setOpen] = useState(false);
	const [newFileName, setNewFileName] = useState(metaData?.filename);
	const fileService = new FileService();

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	// Delete
	const handleDelete = async () => {
		if (metaData?.filename) {
			const response = await fileService.deleteFile(metaData.filename);
			if (response.status === 200) {
				reRender ? setReRender(0) : setReRender(1);
				toast.success("File removed !");
			} else {
				toast.error(`${response?.response?.data?.errorMessage}`);
			}
		} else {
			toast.error("No file founded !");
		}
	};

	// download
	const handleDownload = () => {
		if (metaData?.filename && metaData?.urlForDownload) {
			let alink = document.createElement('a');
			alink.href = metaData.urlForDownload;
			alink.download = metaData.filename;
			alink.click();
		} else {
			toast.error("No file founded !");
		}
	}

	// Rename
	const handleRename = async () => {
		if (metaData?.filename) {
			const response = await fileService.renameFile(metaData?.filename, newFileName);
			if (response.status === 200) {
				handleClose();
				toast.success("File renamed !");
				reRender ? setReRender(0) : setReRender(1);
			} else {
				toast.error(`${response?.response?.data?.errorMessage}`);
			}
		} else {
			toast.error("No file founded !");
		}

	};

	return (

		<div>
			<Card >
				<CardHeader
					title={metaData?.filename}
					subheader=""
				/>
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
						<InsertDriveFileIcon />
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
							label="File Name"
							margin="normal"
							variant="outlined"
							fullWidth
							style={{ margin: 8 }}
							InputLabelProps={{
								shrink: true,
							}}
							defaultValue={metaData?.filename.split('.')[0]}
							onChange={(e) => {
								setNewFileName(e.target.value + '.' + metaData?.filename.split('.')[1]);
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
};


