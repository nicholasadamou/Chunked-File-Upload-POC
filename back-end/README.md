# Back-End

Handles building compressed and uncompressed chunks, extracting their fully formed file byte data and deleting the built file(s).

## API

### [Upload](src/main/java/com/nicholasadamou/upload/service/services/UploadService.java)

Obtains a file chunk along with its index and builds a file within `/tmp`. If the chunks are compressed, it will decompress the fully formed file once successfully uploaded. Once the file data has been extracted, the compressed and uncompressed files are deleted.

**URL**: `/upload`

**Method**: `POST`

**Consumes**: `Multipart Form Data`

**Request Header(s)**: `Content-Range`

#### Success Response

**Code**: `200 OK`

The Multipart Form Data will contain a base64 encoded file name. Within this encoded file name is the JSON:

```json
{
 "fileName": "<original name>.<extension>",
 "fileType": "<MIMIE type of file>",
 "originalFileName": "<original file name>",
 "originalFileExtension": "<original file extension>"
}
```

This data is decoded and used internally for handling the building and decompressing of the uploaded file.

## Scheduled Tasks

Utilizes a [scheduled task](src/main/java/com/nicholasadamou/upload/service/job/Jobs.java) to handle deleting files within  `/tmp` that the user failed to upload all required chunks due to broken or failed connection.

## Development

### Requirements

- [Docker](http://docker.com/)
- [Maven](https://maven.apache.org/)
- [Java JDK 8](https://www.oracle.com/java/technologies/downloads/)

### Steps

Create a `.env` file with the following properties using the [`env.example`](env.example) as an example:

```
MAX_FILE_SIZE=10MB
MAX_REQUEST_SIZE=100MB

CORS_ALLOWED_ORIGINS=

PORT=8080
```

Run [`convert_env_to_application_properties.sh`](devops/convert_env_to_application_properties.sh).

This will prompt you for a port you would like to use. If you do not provide a port, it will select one automatically.

```bash
bash devops/convert_env_to_application_properties.sh
```

Build the `UploadService.jar` file.

```bash
make
```

Start the `UploadService.jar` file.

```bash
java -jar target/UploadService.jar
```

## Docker

To build the docker image for Upload Service, run the following command.

```bash
make image
```

Then to execute the docker container, run the following command.

```bash
docker-compose up
```

## License

© Nicholas Adamou.

It is free software, and may be redistributed under the terms specified in the [LICENSE] file.

[license]: LICENSE
