FROM node:25-alpine AS install

WORKDIR /app

COPY package.json package-lock.json /.
RUN npm install

FROM install AS build

WORKDIR /app
COPY . .
RUN npm run build

FROM build

WORKDIR /app

RUN apk add --no-cache postgresql-client
COPY entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
CMD ["npm","start"]
