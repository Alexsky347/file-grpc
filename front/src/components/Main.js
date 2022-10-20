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
	const [files, setFiles] = useState();

	/**
	 * init
	 */
	async function initGetFiles(fileName) {
		const response = await fileService.getFiles(fileName);
		if (response.status === 200) {

			let arrayFiles = await Promise.all(response.data.map(async (fileName) => {
				let responseFile = await fileService.getFile(fileName);
				const { headers, data } = responseFile;
				const fileNickName = getHeaderProp('Content-Disposition', headers);

				return {
					type: getHeaderProp('Content-Type', headers),
					url: handleFileUrl(data, fileNickName),
					filename: fileNickName,
					createdate: getHeaderProp('Content-Created', headers),
					lastmodified: getHeaderProp('Content-Modified', headers),
					filesize: getHeaderProp('Content-Length', headers) / 1000,
				}
			}));

			setFiles(arrayFiles)
		} else {
			toast.error(`${response?.response?.data?.errorMessage}`);
		}

	}

	/**
	 * 
	 * @param {*} data 
	 * @param {*} name 
	 * @returns 
	 */
	const handleFileUrl = (data, name) => {
		if (name.endsWith('pdf')) {
			return '/static/pdf.png'
		}
		return URL.createObjectURL(data);
	}

	/**
	 * 
	 * @param {*} property 
	 * @param {*} headers 
	 * @returns 
	 */
	const getHeaderProp = (property, headers) => {
		if (headers && headers.get(property)) {
			if (property === 'Content-Disposition') {
				return headers.get('Content-Disposition').split('filename=')[1]
			}
			return headers.get(property)
		}
		return null;
	}


	// Render main according to side bar option
	if (sideBarOption === 0) {
		return (
			<div className="main">
				{files ? (
					files.map((file, i) => (
						<File
							metaData={file}
							reRender={reRender}
							setReRender={setReRender}
							key={i}
						/>
					))
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

