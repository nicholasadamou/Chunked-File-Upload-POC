CONTAINER_NAME ?= upload-service
DOCKER_IMAGE_NAME ?= test/upload-service:latest
DOCKER_REGISTRY ?=
ARTIFACT_NAME ?= UploadService

# This controls the value of the envTarget property that is used
# to customize the build process so that different features get
# packaged in the API according to the build environment.
#
BUILD_ENV_TARGET ?= test

.PHONY: all
all: clean-war build

# Build Targets-

.PHONY: build
build: target/$(ARTIFACT_NAME).jar .build_image

.PHONY: war
war: target/$(ARTIFACT_NAME).jar

# This should fix the dependencies between push
# and build without always triggering builds.
#
target/$(ARTIFACT_NAME).jar: pom.xml src
	mvn  -DenvTarget=$(BUILD_ENV_TARGET) -e -U package -P docker


.PHONY: image
image: Dockerfile target/$(ARTIFACT_NAME).jar
	docker build -t $(DOCKER_IMAGE_NAME) .
	touch .build_image

# This helps fixing the dependencies
# about target
.build_image: image

# Clean Commands

.PHONY: clean
clean: clean-war clean-image

.PHONY: clean-war
clean-war:
	mvn clean

.PHONY: clean-image
clean-image:
	# clean all the stuff we produced for the image
	# including the container and the image stored
	# in the docker cache
	-docker stop $(CONTAINER_NAME)
	-docker rm $(CONTAINER_NAME)
	-docker rmi $(DOCKER_IMAGE_NAME)
	-rm -rf .build_image

.PHONY: clean-cache
clean-cache:
	rm -rf ~/.m2/repository/com/ibm/glui

# Push Commands

.PHONY: push
push: push-image

.PHONY: push-war
push-war: target/$(ARTIFACT_NAME).jar
	mvn -DenvTarget=$(BUILD_ENV_TARGET) deploy

.PHONY: push-image
push-image: .build_image
	docker tag $(DOCKER_IMAGE_NAME) $(DOCKER_REGISTRY)/$(DOCKER_IMAGE_NAME)
	docker push $(DOCKER_REGISTRY)/$(DOCKER_IMAGE_NAME)

# Start Command
start: .build_image
	docker run -d --name $(CONTAINER_NAME) \
		      -p 80:9080 \
		      $(DOCKER_IMAGE_NAME)

