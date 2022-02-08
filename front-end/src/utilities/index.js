export const toUint8Array = async file =>
	await new Promise((resolve) => {
		const reader = new FileReader();
		reader.readAsArrayBuffer(file);

		reader.onloadend = e => {
			if (e.target.readyState === FileReader.DONE) {
				const buffer = e.target.result;
				const data = new Uint8Array(buffer);

				resolve(data);
			}
		}
	});

export const fileToChunkedBlob = async (file, start, end) => new Blob([new Uint8Array(await file.arrayBuffer()).slice(start, end)], {type: file.type });

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	toUint8Array,
	fileToChunkedBlob
}
