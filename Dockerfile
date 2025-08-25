FROM node:18

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip

# Set working directory
WORKDIR /app

# Copy Python requirements and install
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Copy backend package files
COPY barn-backend/package*.json ./barn-backend/
RUN cd barn-backend && npm install

# Copy all source code including the ML model
COPY . .

# Expose port
EXPOSE 3000

# Start the backend
CMD ["node", "barn-backend/app.js"]