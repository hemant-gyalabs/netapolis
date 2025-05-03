# Neopolis Infra Dashboard

A comprehensive internal dashboard for Neopolis Infra real estate company, featuring score tracking and project management capabilities.

## Features

- **Secure Authentication System**
  - Role-based access control (Admin, Manager, Agent)
  - JWT-based authentication
  - Password reset functionality

- **Project Management**
  - Track real estate projects
  - Assign tasks to team members
  - Monitor project progress and deadlines
  - Document management

- **Score Tracking System**
  - Lead scoring with customizable factors
  - Property scoring for inventory management
  - Agent performance metrics
  - Visual analytics and reports

- **Responsive Design**
  - Works on desktop, tablet, and mobile devices
  - Dark and light theme support

## Technology Stack

- **Frontend**
  - React.js with Vite
  - Material-UI for UI components
  - Recharts for data visualization
  - React Router for navigation

- **Backend**
  - Node.js with Express
  - MongoDB database with Mongoose ODM
  - JWT for authentication
  - Express Validator for input validation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas connection)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/neopolisinfra/dashboard.git
   cd neopolis-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=8002
   NODE_ENV=development
   DB_URI=mongodb://localhost:27017/neopolis-dashboard
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=1d
   JWT_COOKIE_EXPIRES_IN=1
   CORS_ORIGIN=http://localhost:5173
   ```

4. Start the development server:
   ```bash
   # Start both frontend and backend
   npm run dev:all
   
   # Or start them separately
   npm run dev        # Backend only
   npm run dev:client # Frontend only
   ```

5. Open your browser and navigate to:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8002/api`

### Building for Production

```bash
# Build the frontend
npm run build

# Start the production server
npm start
```

## Project Structure

```
neopolis-dashboard/
├── public/              # Static assets
├── src/                 # React frontend
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React contexts (auth, theme)
│   ├── layouts/         # Page layout components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   └── utils/           # Utility functions
├── server/              # Node.js backend
│   ├── config/          # Server configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   └── utils/           # Utility functions
├── index.html           # HTML entry point
└── vite.config.js       # Vite configuration
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/update-password` - Update password
- `POST /api/auth/forgot-password` - Request password reset
- `PATCH /api/auth/reset-password/:token` - Reset password

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Projects

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/tasks` - Add task to project
- `PATCH /api/projects/:id/tasks/:taskId` - Update task
- `DELETE /api/projects/:id/tasks/:taskId` - Delete task
- `POST /api/projects/:id/documents` - Upload document to project
- `DELETE /api/projects/:id/documents/:documentId` - Delete document

### Scores

- `GET /api/scores` - Get all scores
- `POST /api/scores` - Create new score
- `GET /api/scores/:id` - Get score by ID
- `PATCH /api/scores/:id` - Update score
- `DELETE /api/scores/:id` - Delete score
- `GET /api/scores/leads` - Get lead scores
- `GET /api/scores/properties` - Get property scores
- `GET /api/scores/agents` - Get agent scores

## Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens are used for authentication
- CORS is enabled to restrict API access
- Input validation is performed on all requests
- Role-based access control is implemented

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request

## License

This project is licensed under the MIT License.

## Acknowledgements

- [React.js](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Recharts](https://recharts.org/)