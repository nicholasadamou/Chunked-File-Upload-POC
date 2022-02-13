#!/bin/bash

PROJECTS=('front-end' 'back-end')

docker network create "chunked-file-upload-poc"

for project in "${PROJECTS[@]}"; do
	cd "$project" && {
		make all && docker-compose up -d
		cd .. || exit
	}
done
