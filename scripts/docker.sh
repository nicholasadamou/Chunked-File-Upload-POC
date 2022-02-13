#!/bin/bash

PROJECTS=('front-end' 'back-end')

docker network create "test"

for project in "${PROJECTS[@]}"; do
	cd "$project" && {
		make all && docker-compose up -d
		cd .. || exit
	}
done
