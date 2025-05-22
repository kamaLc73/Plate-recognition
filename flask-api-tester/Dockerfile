# Utiliser Node.js comme image de base
FROM node:18-alpine AS base

# Étape de construction
FROM base AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY package.json package-lock.json* ./

# Installer les dépendances
RUN npm ci

# Copier le reste des fichiers
COPY . .

# Construire l'application
RUN npm run build

# Étape de production
FROM base AS runner

WORKDIR /app

# Définir les variables d'environnement
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=http://localhost:5000

# Créer un utilisateur non-root pour des raisons de sécurité
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Copier les fichiers nécessaires depuis l'étape de construction
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Exposer le port sur lequel l'application s'exécutera
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "run","dev"]
