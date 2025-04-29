FROM openjdk:17

WORKDIR /usr/src/app

ARG JAR_PATH=./build/libs
ARG JAR_NAME=memozy-api-0.0.1-SNAPSHOT.jar

COPY ${JAR_PATH}/${JAR_NAME} app.jar

ENV SPRING_PROFILES_ACTIVE=local

CMD ["java", "-jar", "-Dspring.profiles.active=${SPRING_PROFILES_ACTIVE}", "app.jar"]
