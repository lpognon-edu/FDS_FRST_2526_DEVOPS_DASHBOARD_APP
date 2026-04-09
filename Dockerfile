FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Copy SQL schema for database initialization
COPY sql/schema.sql ./sql/

# Expose port
EXPOSE 3000

# Run application
CMD ["npm", "start"]
