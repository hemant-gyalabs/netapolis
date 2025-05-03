# Project Management API Documentation

This document provides information about the Project Management API, which is used to manage projects, tasks, and related resources in the Neopolis Infra Real Estate Dashboard.

## Base URL

```
/api/projects
```

## Authentication

All API endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Projects

### Get All Projects

Retrieves a list of projects with optional filtering, sorting, and pagination.

- **URL**: `/api/projects`
- **Method**: `GET`
- **Query Parameters**:
  - `status` (optional): Filter by project status (planning, inProgress, onHold, completed, canceled)
  - `propertyType` (optional): Filter by property type (residential, commercial, mixed, land)
  - `manager` (optional): Filter by project manager ID
  - `team` (optional): Filter by team member ID
  - `sortBy` (optional): Field to sort by (default: createdAt)
  - `sortOrder` (optional): Sort order (asc, desc)
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)

### Get Project by ID

Retrieves a specific project by its ID.

- **URL**: `/api/projects/:id`
- **Method**: `GET`
- **URL Parameters**:
  - `id`: Project ID

### Create Project

Creates a new project.

- **URL**: `/api/projects`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "Project Name",
    "description": "Project description",
    "location": {
      "area": "Banjara Hills",
      "city": "Hyderabad"
    },
    "propertyType": "residential",
    "startDate": "2023-06-01T00:00:00.000Z",
    "endDate": "2024-06-01T00:00:00.000Z",
    "status": "planning",
    "budget": {
      "total": 20000000,
      "spent": 0,
      "currency": "INR"
    },
    "manager": "user_id",
    "team": ["user_id1", "user_id2"]
  }
  ```

### Update Project

Updates an existing project.

- **URL**: `/api/projects/:id`
- **Method**: `PATCH`
- **URL Parameters**:
  - `id`: Project ID
- **Request Body**: Same as Create Project (all fields optional)

### Delete Project

Deletes a project.

- **URL**: `/api/projects/:id`
- **Method**: `DELETE`
- **URL Parameters**:
  - `id`: Project ID

## Tasks

### Add Task to Project

Adds a new task to a project.

- **URL**: `/api/projects/:id/tasks`
- **Method**: `POST`
- **URL Parameters**:
  - `id`: Project ID
- **Request Body**:
  ```json
  {
    "name": "Task Name",
    "description": "Task description",
    "assignedTo": "user_id",
    "startDate": "2023-06-01T00:00:00.000Z",
    "dueDate": "2023-07-01T00:00:00.000Z",
    "status": "todo",
    "priority": "medium"
  }
  ```

### Update Task

Updates an existing task in a project.

- **URL**: `/api/projects/:id/tasks/:taskId`
- **Method**: `PATCH`
- **URL Parameters**:
  - `id`: Project ID
  - `taskId`: Task ID
- **Request Body**: Same as Add Task (all fields optional)

### Delete Task

Deletes a task from a project.

- **URL**: `/api/projects/:id/tasks/:taskId`
- **Method**: `DELETE`
- **URL Parameters**:
  - `id`: Project ID
  - `taskId`: Task ID

## Comments

### Add Comment to Project

Adds a new comment to a project.

- **URL**: `/api/projects/:id/comments`
- **Method**: `POST`
- **URL Parameters**:
  - `id`: Project ID
- **Request Body**:
  ```json
  {
    "text": "Comment text"
  }
  ```

## Documents

### Add Document to Project

Adds a new document to a project.

- **URL**: `/api/projects/:id/documents`
- **Method**: `POST`
- **URL Parameters**:
  - `id`: Project ID
- **Request Body**:
  ```json
  {
    "name": "Document Name",
    "fileUrl": "https://example.com/file.pdf",
    "fileType": "document"
  }
  ```

## Statistics

### Get Project Statistics

Retrieves project statistics.

- **URL**: `/api/projects/stats`
- **Method**: `GET`

### Get User's Assigned Tasks

Retrieves tasks assigned to the authenticated user across all projects.

- **URL**: `/api/projects/my-tasks`
- **Method**: `GET`

### Search Projects

Searches for projects by name, description, or location.

- **URL**: `/api/projects/search`
- **Method**: `GET`
- **Query Parameters**:
  - `query`: Search query

## Development Endpoints (Only available in development environment)

### Create Test Projects

Creates test projects for development purposes.

- **URL**: `/api/projects/test-data`
- **Method**: `POST`

## Response Format

All successful responses follow this format:

```json
{
  "status": "success",
  "data": {
    // Response data
  }
}
```

Error responses follow this format:

```json
{
  "status": "error",
  "message": "Error message"
}
```

## Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `204 No Content`: Resource deleted successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Permission denied
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Model Schemas

### Project

```javascript
{
  _id: String,
  name: String,
  description: String,
  location: {
    area: String,
    city: String,
    coordinates: [Number, Number] // [longitude, latitude]
  },
  propertyType: String, // 'residential', 'commercial', 'mixed', 'land'
  startDate: Date,
  endDate: Date,
  status: String, // 'planning', 'inProgress', 'onHold', 'completed', 'canceled'
  progress: Number, // 0-100
  budget: {
    total: Number,
    spent: Number,
    currency: String
  },
  manager: ObjectId (ref: 'User'),
  team: [ObjectId] (ref: 'User'),
  tasks: [Task],
  documents: [Document],
  comments: [Comment],
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### Task

```javascript
{
  _id: String,
  name: String,
  description: String,
  assignedTo: ObjectId (ref: 'User'),
  startDate: Date,
  dueDate: Date,
  status: String, // 'todo', 'inProgress', 'review', 'done'
  priority: String, // 'low', 'medium', 'high', 'urgent'
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment

```javascript
{
  _id: String,
  text: String,
  author: ObjectId (ref: 'User'),
  createdAt: Date
}
```

### Document

```javascript
{
  _id: String,
  name: String,
  fileUrl: String,
  fileType: String, // 'image', 'document', 'spreadsheet', 'presentation', 'other'
  uploadedBy: ObjectId (ref: 'User'),
  uploadedAt: Date
}
```