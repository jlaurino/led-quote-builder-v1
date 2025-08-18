# Use official Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port for Cloud Run
EXPOSE 8080

# Run the app
CMD ["npm", "start"]
