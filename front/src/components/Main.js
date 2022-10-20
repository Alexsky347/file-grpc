import { useState, useEffect } from 'react';
import { FileService } from '../service/file.service';
import { toast } from 'react-toastify';
import File from './File';


export default function Main({ sideBarOption, reRender, setReRender }) {

	const fileService = new FileService();
	// UseEffect
	useEffect(() => {
		initGetFiles('drive.png');
	}, [reRender]);

	// State Variables
	const [file, setFiles] = useState();

	// Functions
	async function initGetFiles(fileName) {
		const response = await fileService.getFile(fileName);
		if (response.status === 200) {

			const getHeaderProp = (property) => {
				if (response && response.headers &&
					response.headers.get(property)) {
					return response.headers.get(property)
				}
				return null;
			}

			const filename = (response && response.headers &&
				response.headers.get('Content-Disposition'))
				? response.headers
					.get('Content-Disposition').split('filename=')[1] : null;

			const fileData = {
				url: URL.createObjectURL(response.data),
				filename,
				createdate: getHeaderProp('Content-Created'),
				lastmodified: getHeaderProp('Content-Modified'),
				filesize: getHeaderProp('Content-Length'),
				type: getHeaderProp('Content-Type'),
			};

			setFiles(fileData)
		} else {
			toast.error(`${response?.response?.data?.errorMessage}`);
		}

	}


	// Render main according to side bar option
	if (sideBarOption === 0) {
		return (
			<div className="main">
				{file ? (
					/* files.map((file, i) => ( */
					<File
						metaData={file}
						reRender={reRender}
						setReRender={setReRender}
					/>
					/* )) */
				) : (
					<div>
						<h1>
							No files yet.
						</h1>
					</div>
				)}
			</div>
		);
	}
};

