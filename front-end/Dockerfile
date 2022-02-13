# We use node:14.4.0-alpine because it is much smaller
# than the official node image and it is just what we
# need to run the node application.
#
FROM node:14.4.0-alpine

LABEL solution="nicholasadamou"
LABEL component="front-end"
LABEL description="The front-end application that is used handle the compression and chunking of a file that is passed to the file uploader component."

# Create app directory
#
WORKDIR /opt/app

# add `/opt/app/node_modules/.bin` to $PATH
#
ENV PATH /opt/app/node_modules/.bin:$PATH

# We copy the package.json to leverage the layer caching
# capabilities of Docker. If the package.json is not
# changed, the build process will not run the npm install
# command, which is the next command in the Dockerfile.
#
# The rationale behind this is the following: if the package.json
# is not changed, Docker will use the previously cached layer
# (outcome of previous image builds). When it comes to execute
# the next instruction, which is unchanged it will be able to
# reuse a previously cached layer associated to the instruction
# "RUN npm install" which has not changed.
#
COPY ./package*.json ./

# If the package.json has not changed, the previous layer has
# not changed, so this layer is not changed either and the
# command will not be re-executed but the associated layer
# will be added to the image.
#
# NOTE: this optimisation ONLY WORKS if we used fixed versions
#       of the packages in the package.json and we do not have
#       any wildcards, which would make npm lookup for new and
#       updated versions. In this case the updates would not
#       be pulled in because the cached layer has been re-used.
#       This should not be a problem for a production deployment
#       where we should always fix versions.
#
RUN npm install

# We copy the rest of the application, this will override the
# previously copied files, but they're the same so we don't
# bother.
#
COPY server ./server
COPY . ./

# This is to prevent that the command gets overridden from
# outside.
#
ENTRYPOINT ["npm"]

# This is to specify which command to run with NPM.
#
CMD ["run", "build"]
