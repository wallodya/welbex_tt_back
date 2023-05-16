# syntax=docker/dockerfile:experimental
FROM node:18-alpine as app_dev
WORKDIR /var/www
LABEL com.docker.compose.container-number="1"
COPY --chown=node:node package*.json .
COPY --chown=node:node prisma ./prisma
RUN ls -la
RUN npm ci
RUN npx prisma generate
# RUN npx prisma migrate deploy
COPY --chown=node:node . .
CMD ["npm", "run", "start"]
EXPOSE 3000
