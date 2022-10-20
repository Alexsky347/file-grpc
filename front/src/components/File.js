import { useState } from 'react';

import { TextField } from '@material-ui/core';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { FileService } from '../service/file.service';
import { toast } from 'react-toastify';


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
			}
		} else {
			toast.error("No file name founded !");
		}
	};

	// Rename
	const handleRename = () => {
		const data = {
			filename: metaData?.filename,
			metadata: {
				filename: newFileName,
				createdate: metaData?.createdate,
				lastmodified: new Date(Date.now()).toDateString(),
				filesize: metaData?.filesize,
				type: metaData?.type,
			},
		};
		fetch(`${process.env.REACT_APP_IP}/renameBlob`, {
			method: 'PATCH',
			withCredentials: true,
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					handleClose();
					reRender ? setReRender(0) : setReRender(1);
				}
			})
			.catch((err) => console.log(err));
	};

	return (
		<div className="file">
			<div className="file-header">
				<IconButton>
					<InsertDriveFileIcon />
				</IconButton>
				<p className="file-name" title={metaData?.filename}>
					{metaData?.filename}
				</p>
				<a href={metaData.url} download={metaData.filename}>
					<IconButton>
						<DownloadIcon />
					</IconButton>
				</a>
			</div>
			<img alt="hey" src={metaData?.url} />
			<div className="file-info">
				Created: {metaData?.createdate} <br />
				Last Modified: {metaData?.lastmodified} <br />
				File Size: {metaData?.filesize} MB
				<br />
				<br />
			</div>

			<div className="file-footer">
				<IconButton onClick={handleDelete}>
					<DeleteIcon />
				</IconButton>
				<IconButton onClick={handleOpen}>
					<CreateIcon />
				</IconButton>
			</div>
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
							defaultValue={metaData?.filename}
							onChange={(e) => {
								setNewFileName(e.target.value);
							}}
						/>
					</Typography>

					{/* SAVE / EDIT / UPDATE REQUEST */}
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
