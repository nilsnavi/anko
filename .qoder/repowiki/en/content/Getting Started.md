# Getting Started

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [package.json](file://package.json)
- [server/package.json](file://server/package.json)
- [scripts/health-check.sh](file://scripts/health-check.sh)
- [scripts/health-check.bat](file://scripts/health-check.bat)
- [.env.example](file://.env.example)
- [server/.env.example](file://server/.env.example)
- [.env.docker.example](file://.env.docker.example)
- [docker-compose.yml](file://docker-compose.yml)
- [server/server.js](file://server/server.js)
- [server/db/in-memory.js](file://server/db/in-memory.js)
- [server/Dockerfile](file://server/Dockerfile)
- [DEPLOYMENT.md](file://DEPLOYMENT.md)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [System Requirements](#system-requirements)
3. [Environment Preparation](#environment-preparation)
4. [Health Check Process](#health-check-process)
5. [Step-by-Step Installation](#step-by-step-installation)
6. [Development Server Startup](#development-server-startup)
7. [Verification and Validation](#verification-and-validation)
8. [Docker Deployment Alternatives](#docker-deployment-alternatives)
9. [Troubleshooting Guide](#troubleshooting-guide)
10. [Best Practices](#best-practices)
11. [Conclusion](#conclusion)

## Introduction
This guide helps you set up the Anko project for local development. It covers system requirements, environment preparation, health checks, installation steps for both frontend and backend, and validation procedures to ensure your environment is ready for development.

## System Requirements
- Node.js 18+ (LTS recommended)
- npm (version aligned with Node.js LTS)
- MongoDB (for backend development and testing)
- Git (recommended for cloning and version control)

These requirements are essential for running both the frontend React application and the backend Node.js API locally.

**Section sources**
- [README.md](file://README.md#L32-L36)
- [server/package.json](file://server/package.json#L34-L37)

## Environment Preparation
Before starting, prepare your environment variables for both frontend and backend:

- Frontend environment variables
  - Copy the example file to create your local configuration
  - Configure the API URL pointing to your backend server
  - Set optional analytics and feature flags as needed

- Backend environment variables
  - Copy the example file to create your local configuration
  - Set the server port, MongoDB connection URI, JWT secrets, CORS origin, and other required settings

- Docker environment variables (for containerized development)
  - Copy the Docker example file to configure MongoDB credentials, API port, JWT secrets, and CORS origin

Key environment variables to configure:
- Frontend: VITE_API_URL, optional analytics and feature flags
- Backend: PORT, NODE_ENV, MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET, CORS_ORIGIN, UPLOAD_DIR, MAX_FILE_SIZE, ALLOWED_FILE_TYPES, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW, LOG_LEVEL, API_BASE_URL

**Section sources**
- [.env.example](file://.env.example#L1-L43)
- [server/.env.example](file://server/.env.example#L1-L94)
- [.env.docker.example](file://.env.docker.example#L1-L21)

## Health Check Process
The project includes platform-specific health check scripts to validate your local environment:

- Windows
  - Run the batch script located at scripts/health-check.bat
  - The script verifies Node.js, npm, MongoDB presence, frontend/backend dependencies, .env configuration, and vulnerability checks

- Linux/MacOS
  - Make the shell script executable: chmod +x scripts/health-check.sh
  - Run the script: ./scripts/health-check.sh
  - The script performs the same checks as the Windows version

The health check validates:
- Node.js and npm installation and versions
- MongoDB availability (optional for local development)
- Frontend dependencies and .env configuration
- Backend dependencies and .env configuration
- Vulnerability scanning for both frontend and backend
- Structural file checks for backend components

**Section sources**
- [README.md](file://README.md#L38-L53)
- [scripts/health-check.sh](file://scripts/health-check.sh#L1-L191)
- [scripts/health-check.bat](file://scripts/health-check.bat#L1-L128)

## Step-by-Step Installation
Follow these steps to install and configure both frontend and backend components:

### Frontend Installation
1. Install dependencies
   - Run the standard dependency installation command
2. Create environment configuration
   - Copy the example file to .env
   - Configure VITE_API_URL to point to your backend server
3. Start development server
   - Launch the Vite dev server
4. Build for production (optional)
   - Generate a production build
   - Preview the build locally

### Backend Installation (Optional for Local Development)
1. Navigate to the server directory
2. Install dependencies
   - Install production and development dependencies
3. Create environment configuration
   - Copy the example file to .env
   - Configure server port, MongoDB URI, JWT secrets, CORS origin, and other settings
4. Start development server
   - Launch with nodemon for automatic restarts during development
   - Or start the production server

Ensure MongoDB is running before starting the backend server.

**Section sources**
- [README.md](file://README.md#L55-L96)
- [package.json](file://package.json#L7-L26)
- [server/package.json](file://server/package.json#L6-L17)

## Development Server Startup
After installation, start the development servers:

- Frontend
  - Use the Vite dev server for rapid iteration
  - The dev server will automatically reload on code changes

- Backend
  - Use the development server with nodemon for automatic restarts
  - For production-like behavior, start the production server

- Combined Development
  - Use the root-level script to start both frontend and backend together

Frontend and backend communicate through the configured API URL. Ensure the backend is reachable at the configured address before starting the frontend.

**Section sources**
- [README.md](file://README.md#L177-L194)
- [package.json](file://package.json#L20-L22)

## Verification and Validation
To verify your environment is ready:

- Confirm frontend builds successfully
- Verify backend starts without errors
- Test API endpoints using your preferred HTTP client
- Ensure the admin panel is accessible
- Validate that content management features work as expected

Successful validation indicates:
- Node.js and npm are installed and functional
- MongoDB is accessible (if using database-backed features)
- Both frontend and backend are running on their expected ports
- Environment variables are correctly configured
- No security vulnerabilities detected by the audit process

**Section sources**
- [scripts/health-check.sh](file://scripts/health-check.sh#L78-L84)
- [scripts/health-check.bat](file://scripts/health-check.bat#L48-L63)

## Docker Deployment Alternatives
The project includes Docker configurations for containerized development and production:

- Docker Compose
  - Define MongoDB, backend API, and optional frontend services
  - Configure environment variables via .env.docker.example
  - Health checks for MongoDB and backend services
  - Persistent volumes for MongoDB data and backend uploads

- Backend Dockerfile
  - Multi-stage build for optimized production images
  - Non-root user execution for security
  - Health check endpoint integration
  - Proper file permissions for upload directories

- Environment Variables for Docker
  - MongoDB credentials and port
  - API port and environment mode
  - JWT secrets for authentication
  - CORS origin configuration

Docker deployment simplifies environment consistency and eliminates local dependency conflicts.

**Section sources**
- [docker-compose.yml](file://docker-compose.yml#L1-L82)
- [.env.docker.example](file://.env.docker.example#L1-L21)
- [server/Dockerfile](file://server/Dockerfile#L1-L72)

## Troubleshooting Guide
Common setup issues and solutions:

- Node.js/npm not found
  - Install Node.js 18+ LTS and ensure npm is included
  - Verify installation by checking versions in terminal

- MongoDB connection errors
  - Ensure MongoDB is installed and running
  - Check the connection string in backend .env
  - Verify firewall and network settings

- Port conflicts
  - Change PORT in backend .env if port 5000 is in use
  - Adjust frontend dev server port if needed

- CORS errors
  - Set CORS_ORIGIN to match frontend URL
  - Ensure CORS configuration allows requests from the frontend origin

- JWT secret warnings
  - Generate strong JWT secrets using the provided generator
  - Store secrets securely and never commit them to version control

- Dependency installation failures
  - Clear node_modules and reinstall dependencies
  - Update npm to the latest compatible version
  - Check for conflicting global packages

- Health check failures
  - Review the specific failure messages from the health check script
  - Address missing dependencies, incorrect environment variables, or service unavailability

**Section sources**
- [scripts/health-check.sh](file://scripts/health-check.sh#L14-L44)
- [scripts/health-check.bat](file://scripts/health-check.bat#L9-L41)
- [DEPLOYMENT.md](file://DEPLOYMENT.md#L565-L621)

## Best Practices
- Keep dependencies updated regularly
- Use environment-specific .env files for different stages
- Implement proper error handling and logging
- Secure JWT secrets and sensitive configuration
- Monitor resource usage during development
- Use Docker for consistent environments across team members

## Conclusion
You now have the complete setup to develop the Anko project locally. Use the health check scripts to validate your environment, follow the installation steps for both frontend and backend, and leverage Docker for containerized development. If you encounter issues, refer to the troubleshooting guide and ensure all system requirements are met.