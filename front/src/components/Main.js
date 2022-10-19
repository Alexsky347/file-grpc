import { useState, useEffect } from 'react';
import { FileService } from '../service/file.service';
import { toast } from 'react-toastify';
import File from './File';

require('dotenv').config();

const Main = ({ sideBarOption, reRender, setReRender }) => {

	const fileService = new FileService();
	// UseEffect
	useEffect(() => {
		getOneFile('drive.png');
	}, [reRender]);

	// State Variables
	const [file, setFiles] = useState();

	// Functions
	async function getOneFile(fileName) {
		const response = await fileService.getOneFile(fileName);
		console.log(response)
		if (response.status === 200) {
			// https://satyajitpatnaik.medium.com/how-to-download-a-file-from-the-resources-folder-in-a-spring-boot-application-8570b1f16206
			const filename = (response && response.headers &&
				response.headers.get('Content-Disposition'))
				? response.headers
					.get('Content-Disposition').split('filename=')[1] : '';
			const blob = await response.blob()
			const url = await URL.createObjectURL(blob);
			console.log(response.headers.get('Content-Disposition'))
			console.log(url)
			setFiles(url)
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
						metaData={file.metadata}
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
export default Main;
