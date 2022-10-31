# MULTI STAGE

# BUILD
FROM gradle:jdk17-alpine AS build
ENV APP_HOME=/usr/app/
WORKDIR $APP_HOME
COPY build.gradle settings.gradle $APP_HOME

COPY gradle $APP_HOME/gradle
COPY --chown=gradle:gradle . /home/gradle/src
USER root
RUN chown -R gradle /home/gradle/src
RUN gradle build --stacktrace || return 0
COPY . .
RUN gradle clean build

#APP CONTAINER
FROM eclipse-temurin:17-jre-focal
ENV ARTIFACT_NAME=springHexagonal-0.0.1-SNAPSHOT.jar
ENV APP_HOME=/usr/app/
WORKDIR $APP_HOME
COPY --from=build $APP_HOME/build/libs/$ARTIFACT_NAME .
ENTRYPOINT exec java -jar ${ARTIFACT_NAME}