FROM node:slim

WORKDIR /srv/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

# generated prisma files
COPY prisma ./prisma/

RUN npx prisma generate

COPY . .

RUN yarn build

EXPOSE 3050

CMD ["node", "build/src/app.js"]
