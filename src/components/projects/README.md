# Project Management System

This module provides a comprehensive project management system for the Neopolis Infra Dashboard. It allows users to create, track, and manage real estate projects, tasks, and resources.

## Features

- **Project Dashboard**: Overview of project statistics and metrics
- **Project List**: List and filter all projects
- **Project Details**: Comprehensive view of project information
- **Task Management**: Create and track tasks within projects
- **Team Management**: Assign team members to projects and tasks
- **Document Management**: Upload and organize project documents
- **Comment System**: Collaborate through project comments
- **Financial Tracking**: Monitor project budgets and expenditures

## Components Structure

- **ProjectDashboard.jsx**: Main dashboard with statistics and charts
- **ProjectList.jsx**: List view of all projects with filtering and search
- **ProjectDetail.jsx**: Detailed view of a single project
- **ProjectForm.jsx**: Forms for creating and editing projects
- **TaskForm.jsx**: Forms for creating and editing tasks
- **ProjectHelpers.jsx**: Shared helper components and functions
- **ProjectsPage.jsx**: Main router component for the projects module

## Data Flow

1. API calls are made through project.service.js
2. Service layer handles data formatting and error handling
3. Components consume the service layer for data
4. State is managed locally within components
5. Data is passed between components using React Router params and props

## Project Model

Projects have the following key attributes:

- Basic information (name, description)
- Location details
- Property type
- Timeline (start date, end date)
- Status (planning, in progress, on hold, completed, canceled)
- Budget information
- Team (manager, members)
- Tasks
- Documents
- Comments

## Task Model

Tasks within projects have:

- Basic information (name, description)
- Assignment to team member
- Timeline (start date, due date)
- Status (to do, in progress, review, done)
- Priority (low, medium, high, urgent)

## Dependencies

- Material UI for UI components
- Recharts for charts and visualizations
- Date-fns for date handling
- React Router for navigation

## Mock Data

For development purposes, mock data is generated using:
- `projectTestData.js`: Contains functions to generate test projects, tasks, and statistics
- `createTestData.js`: Provides functionality to populate the system with test data

## API Documentation

See `docs/project-api.md` for detailed API documentation.

## User Guide

See `docs/project-management-user-guide.md` for a comprehensive user guide.