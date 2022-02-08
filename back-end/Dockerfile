FROM registry.access.redhat.com/ubi8/openjdk-8 as BUILDER

USER root
COPY . .

RUN mvn package

FROM openliberty/open-liberty:full-java8-ibmjava-ubi as SPRING_BOOT

LABEL solution="test"
LABEL component="Upload Service"

USER root

RUN yum update --exclude=filesystem* -y

WORKDIR /opt/app
RUN chgrp -R 0 /opt/app && chmod -R g+rwX /opt/app

COPY --from=BUILDER /home/jboss/target/UploadService.jar /config/dropins/spring/UploadService.jar

COPY ./devops/start.sh start.sh
RUN chmod +x start.sh

ENTRYPOINT ["/opt/app/start.sh"]
