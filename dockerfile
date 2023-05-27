FROM node:19.9.0

WORKDIR /app

COPY /package.json ./
COPY /package-lock.json ./
RUN npm ci

COPY public /app/public
COPY src /app/src

EXPOSE 3000

CMD ["npm", "start"]