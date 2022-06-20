import React from 'react';

import styled from 'styled-components';

import {
    FileUploaderDropContainer,
    FileUploaderItem,
} from 'carbon-components-react';

import WorkerBuilder from '../workers/worker-builder';
import PakoWorker from '../workers/pako.worker';

import { NotificationContext } from '../contexts/NotifiationContext/NotificationContext';

import ChunkedFile from './ChunkedFile';

import { toUint8Array } from '../utilities';

const Container = styled.div`
    strong {
        display: block;

        margin-bottom: 10px;

        font-size: 16px;
        font-weight: bold;
    }

    p {
        font-size: 16px;

        margin-bottom: 10px;
    }

    .bx--file-browse-btn {
        max-width: 35rem !important;
    }

    .bx--file__drop-container {
        font-size: 16px;

        height: 10rem !important;
    }
`;

const FileUploaderItems = styled.div`
    margin: 10px 0 20px;

    .bx--file__selected-file {
        max-width: 35rem !important;

        p {
            margin-bottom: 0;
        }
    }
`;

const FileUploader = (props) => {
    const [file, setFile] = React.useState(undefined);

    const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/zip',
        'application/x-compressed',
        'application/x-zip-compressed',
        'multipart/x-zip',
        'application/msword',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'application/pdf',
        'application/vnd.ms-excel.sheet.macroenabled.12',
        'application/vnd.ms-excel.sheet.macroEnabled.12',
        'application/vnd.ms-excel.sheet.binary.macroenabled.12',
        'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
        'text/csv',
    ];

    const { showNotification } = React.useContext(NotificationContext);

    const isFileSizeValid = (file) => file.size <= 6000000;

    const handleWorker = async (file, message) => {
		let mid = file.name.lastIndexOf('.');
		let name = file.name.substr(0, mid);
		const originalExtension = file.name.substr(mid + 1, file.name.length);
		const originalFileName = `${name}.${originalExtension}`;

		const type = 'application/gzip';
		const extension = `${originalExtension}.gz`;

		const buffer = message.data;
		const blob = new Blob([buffer], { type });

        await prepareForUpload(
            name,
            extension,
            type,
            originalFileName,
            originalExtension,
            file,
            blob
        );
    };

    const handleOnDragNDrop = async (e, data) => {
        const { addedFiles } = data;

        const file = addedFiles[0];

        if (!file) return;

        if (!isFileSizeValid(file)) {
            showNotification({
                success: false,
                kind: 'error',
                subtitle: `File size exceeds limit. 6MB max file size. Select a new file and try again.`,
                timeout: 5000,
            });

            return;
        }

        const compressionThreshold = 1000000; // 1MB

        let shouldCompress = file.size > compressionThreshold;

        if (shouldCompress) {
            const worker = new WorkerBuilder(PakoWorker);
            worker.postMessage(file);

            worker.onmessage = (message) => {
                handleWorker(file, message);
            };

            return;
        }

        let mid = file.name.lastIndexOf('.');
        let name = file.name.substr(0, mid);
        const originalExtension = file.name.substr(mid + 1, file.name.length);
        const originalFileName = `${name}.${originalExtension}`;
        let extension = originalExtension;

        let type = file.type;
        const buffer = await toUint8Array(file);
        const blob = new Blob([buffer], { type });

        await prepareForUpload(
            name,
            extension,
            type,
            originalFileName,
            originalExtension,
            file,
            blob
        );
    };

    const prepareForUpload = async (
        name,
        extension,
        type,
        originalFileName,
        originalFileExtension,
        file,
        blob
    ) => {
        const fileName = `${name}.${extension}`;

        const fileAsJSON = {
            fileName,
            fileType: type,
            originalFileName,
            originalFileExtension,
        };

        const encodedFileName = `${Buffer.from(
            JSON.stringify(fileAsJSON)
        ).toString('base64')}.${extension}`;

        setFile({
            name: fileName,
            filesize: file.size,
            status: 'uploading',
            iconDescription: 'uploading',
        });

        const document = new File([blob], encodedFileName, {
            type,
        });

        await upload(document, originalFileName, blob);
    };

    const upload = async (file, fileName, blob) => {
        const document = new ChunkedFile(file, blob);

        showNotification({
            success: true,
            kind: 'info',
            subtitle: (
                <>
                    <p>Your file {fileName} is being uploaded.</p>
                    <p>
                        Please allow a few minutes for the system to process it.
                    </p>
                </>
            ),
            timeout: 8000,
        });

        await document.upload(
            () => {
                showNotification({
                    success: true,
                    kind: 'success',
                    subtitle: `File ${fileName} was successfully uploaded.`,
                    timeout: 5000,
                });

                setFile(undefined);
            },
            () => {
                showNotification({
                    success: false,
                    kind: 'error',
                    subtitle: `There was an internal error during upload. Please select a new file and try again.`,
                    timeout: 5000,
                });

                setFile(undefined);
            }
        );
    };

    return (
        <Container>
            <strong>Add a file by drag and drop or browse</strong>
            <p>
                If you have multiple files, it is recommended to zip them
                together.
            </p>
            <FileUploaderDropContainer
                id="file-uploader"
                labelText="Choose a file or drag and drop it here"
                onAddFiles={handleOnDragNDrop}
                accept={validTypes}
                disabled={file !== undefined}
            />
            {file && (
                <FileUploaderItems>
                    <FileUploaderItem
                        name={file.name}
                        status={file.status}
                        iconDescription={file.iconDescription}
                    />
                </FileUploaderItems>
            )}
            <p>Max file size is 6MB.</p>
            <p>
                Supported file types are .xlsx/.xlsm/.xlsb, .zip, .doc/.docx,
                .ppt/.pptx, .txt, .pdf, .csv, .print.
            </p>
        </Container>
    );
};

export default FileUploader;
