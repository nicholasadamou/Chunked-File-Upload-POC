import { fileToChunkedBlob } from '../utilities';

// See https://www.eventslooped.com/posts/chunked-file-upload-typescript-react-go/
class ChunkedFile {
	static chunkSize = 500000; // 0.5MB
	static uploadURL = '/api/upload';

	request: XMLHttpRequest;
	file: File;
	blob: Blob;

	currentChunkStartByte: number;
	currentChunkFinalByte: number;

	constructor(file: File, blob: Blob) {
		this.request = new XMLHttpRequest();
		this.request.overrideMimeType('application/octet-stream');

		this.file = file;
		this.blob = blob;

		this.currentChunkStartByte = 0;
		this.currentChunkFinalByte = ChunkedFile.chunkSize > this.file.size ? this.file.size : ChunkedFile.chunkSize;
	}

	upload = async (onSuccess: function, onError: function, chunkIndex = 0) => {
		this.request.open('POST', ChunkedFile.uploadURL + `?chunkIndex=${chunkIndex}`, true);

		let chunk: Blob = await fileToChunkedBlob(this.file, this.currentChunkStartByte, this.currentChunkFinalByte);

		this.request.setRequestHeader('Content-Range', `bytes ${this.currentChunkStartByte}-${this.currentChunkFinalByte}/${this.file.size}`);

		this.request.onload = () => {
			const response = JSON.parse(this.request.response);
			const {status} = response;

			if (status > 400) {
				onError(this.request);

				this.request.abort();

				return;
			}

			const remainingBytes = this.file.size - this.currentChunkFinalByte;

			if (this.currentChunkFinalByte === this.file.size) {
				onSuccess();

				return;
			} else if (remainingBytes < ChunkedFile.chunkSize) {
				this.currentChunkStartByte = this.currentChunkFinalByte;
				this.currentChunkFinalByte = this.currentChunkStartByte + remainingBytes;
			} else {
				this.currentChunkStartByte = this.currentChunkFinalByte;
				this.currentChunkFinalByte = this.currentChunkStartByte + ChunkedFile.chunkSize;
			}

			this.upload(onSuccess, onError, ++chunkIndex);
		}

		let formData = new FormData();
		formData.append('file', chunk, this.file.name);
		this.request.send(formData);
	}
}

export default ChunkedFile;
