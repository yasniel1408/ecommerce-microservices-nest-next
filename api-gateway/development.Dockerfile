FROM node:21-alpine3.18

COPY ["./package.json", "./package-lock.json", "/usr/src/"]

WORKDIR /usr/src

COPY ["./", "/usr/src/"]

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
