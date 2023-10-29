FROM node:18

WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 4000
EXPOSE 8080
CMD ["yarn", "dev"]