# 1️⃣ Image Node.js légère
FROM node:20-alpine

# 2️⃣ Dossier de travail
WORKDIR /app

# 3️⃣ Copier package.json (optimisation cache)
COPY package*.json ./

# 4️⃣ Installer dépendances
RUN npm install --production

# 5️⃣ Copier le reste du code
COPY . .

# 6️⃣ Port exposé (adapte si différent)
EXPOSE 3000

# 7️⃣ Lancer l’application
CMD ["npm","start"]
