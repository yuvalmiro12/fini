# Puppeteer-ready image. The base image ships a compatible Chromium + all the
# system libraries the headless browser needs, so we don't fight missing .so files.
FROM ghcr.io/puppeteer/puppeteer:24.10.1

ENV NODE_ENV=production \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false

WORKDIR /app

COPY package.json ./
# Install without a lockfile is fine for a single-service image.
RUN npm install --omit=dev

COPY src ./src

EXPOSE 8787
CMD ["node", "src/server.js"]
