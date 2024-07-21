FROM node:20-slim
WORKDIR /usr/src/app
COPY . .
RUN npm install pnpm -g
RUN pnpm install --frozen-lockfile
ENV NODE_ENV="production"
CMD [ "pnpm", "start" ]
