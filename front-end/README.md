# Front-End

Handles the compression and chunking of a file that is passed to the file uploader component.

The file is chunked utilizing the [ChunkedFile.js](src/components/ChunkedFile.js) in the form of Multipart Form Data. Within each chunk is a base64 encoded file name. Contained within this encoded file name is the JSON:

```json
{
 "fileName": "<original name>.<extension>",
 "fileType": "<MIMIE type of file>",
 "originalFileName": "<original file name>",
 "originalFileExtension": "<original file extension>"
}
```

This data is decoded and used internally in the back-end for handling the building and decompressing of the uploaded file.

## Development

### Requirements

- [Docker](http://docker.com/)
- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/en/) (recommended)

### Steps

Run the live-reload server on <http://localhost:3000>

```bash
make dev
```

Please take a look at [src/setupProxy.js](src/setupProxy.js) to see how the proxy is set up.

## Docker

To dockerize this application I followed the following guide [dockerizing-a-react-app](https://mherman.org/blog/dockerizing-a-react-app/).

To build and launch the docker container for *development* use:

```bash
make build-dev start-dev-container
```

Then you can access the application at <http://localhost:3001>.

To build and launch the docker container for *production* use:

```bash
make build-prod start-prod-container
```

Then you can access the application at <http://localhost:1337>.

## 📚 The Tech. Stack

This project uses the following technologies:

**The Front-End**:

- [**React.js**](https://reactjs.org/) - For building the interface along with:
  - [**Styled-Components**](https://www.styled-components.com/) - for styling.
  - [**carbon-components-react**](https://npmjs.com/package/carbon-components-react) - for the base design system.

## License

© Nicholas Adamou.

It is free software, and may be redistributed under the terms specified in the [LICENSE] file.

[license]: LICENSE
