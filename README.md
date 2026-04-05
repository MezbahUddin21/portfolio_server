# Server - Portfolio Backend API

An Express.js REST API backend for the portfolio website. Handles authentication, project management, and data persistence with MongoDB.

## Features

- **RESTful API** - Well-structured API endpoints
- **Authentication** - JWT-based authentication for admin access
- **Admin Management** - User account management for administrators
- **Project Management** - CRUD operations for portfolio projects
- **Skills Management** - Store and manage technical skills
- **Programming Stats** - Track competitive programming achievements
- **Contact Messages** - Store visitor contact inquiries
- **Highlights Management** - Manage featured highlights
- **MongoDB Integration** - NoSQL database for data persistence
- **Error Handling** - Comprehensive error handling and validation

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/portfolio
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   ```

4. Create an admin account (first time setup):
   ```bash
   node createAdmin.js
   ```
   Follow the prompts to create your admin account.

## Available Scripts

### `npm start`
Starts the server in production mode.
- Server runs on the port specified in `.env` (default: 5000)

### `npm run dev`
Starts the server in development mode with nodemon (auto-restart on file changes).

### `node createAdmin.js`
Creates a new admin account via CLI.

## Project Structure

```
server/
├── models/              # Mongoose schemas
│   ├── Admin.js         # Admin user model
│   ├── Project.js       # Project model
│   ├── Skill.js         # Skill model
│   ├── ProgrammingStat.js  # Programming stats model
│   ├── Highlights.js    # Highlights model
│   ├── Contact.js       # Contact message model
│   └── Achievement.js   # Achievement model
├── routes/              # API route handlers
│   ├── admin.js         # Auth & admin routes
│   ├── projects.js      # Project CRUD routes
│   ├── skills.js        # Skills routes
│   ├── programming.js   # Programming stats routes
│   ├── highlights.js    # Highlights routes
│   ├── contact.js       # Contact form routes
│   └── cv.js            # CV upload/download routes
├── middleware/          # Express middleware
│   ├── auth.js          # JWT authentication middleware
│   └── ...
├── utils/               # Utility functions
├── uploads/             # User file uploads (CV, images, etc.)
├── server.js            # Main server file
└── createAdmin.js       # Admin setup script
```

## API Endpoints

### Authentication
- `POST /api/admin/register` - Register new admin
- `POST /api/admin/login` - Login admin user

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (auth required)
- `PUT /api/projects/:id` - Update project (auth required)
- `DELETE /api/projects/:id` - Delete project (auth required)

### Skills
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create skill (auth required)
- `PUT /api/skills/:id` - Update skill (auth required)
- `DELETE /api/skills/:id` - Delete skill (auth required)

### Programming Stats
- `GET /api/programming-stats` - Get all stats
- `POST /api/programming-stats` - Create stat (auth required)
- `PUT /api/programming-stats/:id` - Update stat (auth required)
- `DELETE /api/programming-stats/:id` - Delete stat (auth required)

### Contact
- `GET /api/contact` - Get all messages (auth required)
- `POST /api/contact` - Submit contact form
- `DELETE /api/contact/:id` - Delete message (auth required)

### Highlights
- `GET /api/highlights` - Get all highlights
- `POST /api/highlights` - Create highlight (auth required)
- `PUT /api/highlights/:id` - Update highlight (auth required)
- `DELETE /api/highlights/:id` - Delete highlight (auth required)

### CV
- `GET /api/cv` - Download CV
- `POST /api/cv` - Upload CV (auth required)

## Authentication

### How It Works
1. Admin logs in with credentials
2. Server validates credentials and returns JWT token
3. Client stores token locally
4. Client includes token in `Authorization: Bearer <token>` header for protected requests
5. `auth.js` middleware verifies token on each protected route

### Protected Routes
All routes marked as auth-required need a valid JWT token in the Authorization header.

## Database Models

Each model is defined in the `models/` directory with:
- Field definitions and validation
- Timestamps (createdAt, updatedAt)
- Relationships between collections

## Error Handling

- Validation errors return `400 Bad Request`
- Authentication errors return `401 Unauthorized`
- Authorization errors return `403 Forbidden`
- Not found errors return `404 Not Found`
- Server errors return `500 Internal Server Error`

## Development

1. Ensure MongoDB is running
2. Create `.env` file with configuration
3. Run `npm run dev` for development with auto-reload
4. Test endpoints using Postman or similar tool

## Security Notes

- Never commit `.env` file with real credentials
- Use strong JWT secret in production
- Hash passwords using bcrypt (handled by model)
- Validate all user inputs
- Use HTTPS in production
- Implement rate limiting for production
- Keep dependencies updated

## Deployment

1. Set production environment variables
2. Use a MongoDB cloud service (MongoDB Atlas)
3. Deploy to a hosting service (Heroku, Railway, etc.)
4. Ensure CORS settings allow frontend domains
5. Monitor logs and errors in production

## Troubleshooting

- **MongoDB Connection Error**: Check `MONGODB_URI` in `.env`
- **JWT Errors**: Verify token format and `JWT_SECRET`
- **CORS Issues**: Update CORS settings in `server.js`
- **Port Already in Use**: Change `PORT` in `.env` or kill existing process

