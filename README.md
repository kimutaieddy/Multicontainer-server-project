# Multi-Container Server Project

This is a multi-container application using Docker Compose with the following services:
- **Client**: React frontend application
- **Server (API)**: Express.js backend server
- **Worker**: Background worker for Fibonacci calculations
- **Nginx**: Reverse proxy and load balancer
- **Postgres**: PostgreSQL database
- **Redis**: Redis cache and message broker

## Prerequisites

- Docker and Docker Compose installed
- Node.js 14+ (for local development)

## Running the Application

### Development Mode

To run the application in development mode with hot reloading:

```bash
docker compose up
```

The application will be available at:
- Main application: http://localhost:3050
- API endpoints: http://localhost:3050/api

### Production Mode

To build and run production images:

```bash
docker compose -f docker-compose.prod.yml up
```

## Architecture

### Services

1. **Client (React)**
   - Runs on port 3000 internally
   - Accessible via Nginx proxy
   - Features hot reloading in development mode

2. **Server (Express API)**
   - Runs on port 5000
   - Connects to PostgreSQL and Redis
   - Handles API requests for values

3. **Worker**
   - Subscribes to Redis 'insert' channel
   - Calculates Fibonacci numbers
   - Stores results in Redis

4. **Nginx**
   - Exposed on port 3050
   - Routes requests to client and API
   - Handles WebSocket connections for hot reloading

5. **PostgreSQL**
   - Stores submitted indices
   - Password configured via environment variables

6. **Redis**
   - Message broker between API and Worker
   - Stores calculated Fibonacci values

## API Endpoints

- `GET /api/values/all` - Get all values from PostgreSQL
- `GET /api/values/current` - Get current calculated values from Redis
- `POST /api/values` - Submit a new index to calculate (max: 40)

## Environment Variables

The following environment variables are configured in `docker-compose.yaml`:

### Server
- `REDIS_HOST`: Redis hostname
- `REDIS_PORT`: Redis port (default: 6379)
- `PGUSER`: PostgreSQL username
- `PGHOST`: PostgreSQL hostname
- `PGDATABASE`: PostgreSQL database name
- `PGPASSWORD`: PostgreSQL password
- `PGPORT`: PostgreSQL port (default: 5432)

### Worker
- `REDIS_HOST`: Redis hostname
- `REDIS_PORT`: Redis port (default: 6379)

## CI/CD Pipeline

The project includes a GitHub Actions workflow that:
1. Runs tests for all services
2. Builds Docker images
3. Pushes images to Docker Hub
4. Deploys to AWS Elastic Beanstalk

## Recent Updates

- Updated Redis client from v2.8.0/v3.1.1 to v4+ with modern async/await API
- Fixed docker-compose.yaml configuration errors
- Added missing Dockerfile.dev files for all services
- Fixed package.json syntax errors
- Standardized port configurations across services
- Added test scripts for CI/CD compatibility

## Development

### Local Development Without Docker

1. Start PostgreSQL and Redis locally
2. Set environment variables
3. Run each service:

```bash
# Server
cd server
npm install
npm run dev

# Worker
cd worker
npm install
npm run dev

# Client
cd client
npm install
npm start
```

## Troubleshooting

### Containers fail to start
- Check Docker logs: `docker compose logs <service-name>`
- Ensure all environment variables are set correctly
- Verify PostgreSQL password matches in all configurations

### Connection refused errors
- Ensure all services are running: `docker compose ps`
- Check service health: `docker compose logs`
- Verify network connectivity between containers

### Build failures
- Clear Docker cache: `docker compose build --no-cache`
- Remove old containers: `docker compose down -v`
- Check for port conflicts on your host machine
