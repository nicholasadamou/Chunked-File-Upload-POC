// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
	// eslint-disable-next-line no-restricted-globals
	self.importScripts("https://cdnjs.cloudflare.com/ajax/libs/pako/2.0.4/pako.min.js");
	// eslint-disable-next-line no-restricted-globals
	self.onmessage = (message) => {
		const file = message.data;

		const reader = new FileReader();
		reader.readAsArrayBuffer(file);

		reader.onloadend = (e) => {
			if (e.target.readyState === FileReader.DONE) {
				const file = e.target.result;

				// eslint-disable-next-line no-undef
				const compressed = pako.gzip(file, { level: 1 });

				postMessage(compressed);
			}
		}
	};
};
