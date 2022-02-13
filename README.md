# Chunked File Upload (POC)

This project was developed with the intent of learning how to upload files in chunks.

## Assumptions

For simplicity sake, I have decided to package this project into a mono repo. This makes it easier to build and spin up each container quickly due to the use of `npm` scripts. However, each individual project is a docker container so, each project could be easily converted into a micro service architecture.

## Development

It is highly recommended that if you would like to develop this project further, you should navigate into each project directory's individually and run the development commands specified in their respective README's in separate terminal sessions.

I also highly recommend [WebStorm IDE](https://www.jetbrains.com/webstorm/) for developing any Node or React based applications as well as [IntelliJ Idea](https://www.jetbrains.com/idea/) for developing any Java based applications.

### Requirements

- [Docker](http://docker.com/)
- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/en/)
- [Maven](https://maven.apache.org/)
- [Java JDK 8](https://www.oracle.com/java/technologies/downloads/)

## Running

From this directory build the project:

```bash
# It will automatically install dependencies
# prior to building the project.
yarn build
```

## Docker

From this directory execute the following command:

```bash
# This will build each of the docker containers
# and will spin them up in the background.
yarn docker
```

Give it a few minutes to bring up the [front-end](/front-end) container. `webpack` production builds can be slow.

## License

© Nicholas Adamou.

It is free software, and may be redistributed under the terms specified in the [LICENSE] file.

[license]: LICENSE
