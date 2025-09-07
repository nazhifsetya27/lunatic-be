FROM node:20-alpine
WORKDIR /app

# instal dependensi
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# salin seluruh kode
COPY . .

# pastikan variabel lingkungan di-inject lewat compose / sekret
ENV NODE_ENV=production
EXPOSE 4003

CMD ["node", "index.js"]
