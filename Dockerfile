FROM node:13.8.0-alpine as BUILDER

USER root

COPY /package.json /app/package.json
WORKDIR /app

RUN npm install -dd
RUN npm rebuild

COPY . /app

ENV API_URL ""
ENV TITLE ""

EXPOSE 5000

# RUN
CMD [ "sh", "-c", "HOST=0.0.0.0 npm run dev" ]