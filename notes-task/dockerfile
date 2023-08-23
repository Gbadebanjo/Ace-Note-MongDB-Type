FROM node:gallium-alpine

ENV NODE_ENV=production

ENV PORT = 3000

WORKDIR /usr/app

COPY  . .

RUN yarn

EXPOSE 8080

CMD ["yarn", "start"]
