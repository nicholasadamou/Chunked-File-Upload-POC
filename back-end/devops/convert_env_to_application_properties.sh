#!/bin/bash

APPLICATION_PROPERTIES="src/main/resources/application.properties"

mkdir -p src/main/resources

cp ./.env ./"$APPLICATION_PROPERTIES"

echo "Enter a PORT you would like SpringBoot to listen on: " && read -r port

if [ -z "$port" ]; then
	echo "User didn't provide a valid port. Choosing next available port."

	port="$(python -c 'import socket; s=socket.socket(); s.bind(("", 0)); print(s.getsockname()[1])')"
fi

echo "server.port=$port" >> "$APPLICATION_PROPERTIES"

printf "\n"

cat ./"$APPLICATION_PROPERTIES"
