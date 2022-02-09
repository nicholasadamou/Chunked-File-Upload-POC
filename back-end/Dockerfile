FROM openjdk:8-jdk-alpine as BUILDER

USER root
COPY . .

RUN apk add maven

RUN mvn package

FROM openjdk:8-jdk-alpine as SPRING_BOOT

LABEL solution="test"
LABEL component="Upload Service"

COPY --from=BUILDER target/UploadService.jar UploadService.jar

ENTRYPOINT ["java","-jar","/UploadService.jar"]
