# TalentLens Backend - Authentication

This directory contains the NestJS backend for TalentLens AI, focusing on robust JWT authentication.

## Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Ensure `.env` exists in this directory (it should have been created for you).
    It must contain:
    ```
    DATABASE_URL=...
    JWT_SECRET=...
    JWT_REFRESH_SECRET=...
    ```

3.  **Database Migration**
    Apply the Prisma schema to your database:
    ```bash
    npx prisma migrate dev --name init
    ```

4.  **Run Development Server**
    ```bash
    npm run start:dev
    ```

The server will start on `http://localhost:3000`.

## API Endpoints

-   `POST /auth/register` - Create account
-   `POST /auth/login` - Login (returns Access Token, sets Refresh Token cookie)
-   `POST /auth/refresh` - Refresh Access Token (requires Refresh Token cookie)
-   `POST /auth/logout` - Logout (clears cookie)
-   `GET /auth/me` - Get current user profile (Protected)
