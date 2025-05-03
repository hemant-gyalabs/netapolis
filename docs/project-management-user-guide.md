# Project Management System - User Guide

This guide provides instructions on how to use the Project Management System within the Neopolis Infra Dashboard.

## Table of Contents

1. [Dashboard Overview](#dashboard-overview)
2. [Projects List](#projects-list)
3. [Project Details](#project-details)
4. [Creating a New Project](#creating-a-new-project)
5. [Managing Tasks](#managing-tasks)
6. [Team Management](#team-management)
7. [Documents and Comments](#documents-and-comments)
8. [Project Statistics](#project-statistics)

## Dashboard Overview

The Project Dashboard provides a comprehensive overview of all project activities, statistics, and key metrics.

### Key Features

- **Project Statistics**: View total projects, active projects, overdue projects, and average progress.
- **Status Distribution**: See the distribution of projects by status.
- **Property Type Distribution**: Understand the distribution of properties by type.
- **Task Status Distribution**: Monitor the distribution of tasks by status.
- **Budget vs Spent**: Compare budget allocations and expenditures for recent projects.
- **Progress Trend**: Track average project progress over time.
- **Financial Overview**: Review total budget, total spent, average budget per project, and remaining budget.
- **Recent Projects**: Quick access to recent projects.
- **My Tasks**: View your assigned tasks across all projects.

### Generate Test Data

If you're in a development environment or need sample data, you can click the "Generate Test Data" button to create test projects.

## Projects List

The Projects List page displays all projects in a card-based layout with filtering and search options.

### Key Features

- **Search**: Search for projects by name, description, or location.
- **Filters**: Filter projects by status, property type, and other criteria.
- **Sorting**: Sort projects by various fields like name, date, and progress.
- **Project Cards**: View key project information at a glance.

### Actions

- **Create Project**: Click "Create Project" to start a new project.
- **View Details**: Click on a project card to view detailed information.
- **Edit/Delete**: Access edit and delete options from the menu on each project card.

## Project Details

The Project Details page provides comprehensive information about a specific project, including tasks, team members, documents, and comments.

### Tabs

1. **Overview**: Shows project summary, progress, budget, tasks summary, team summary, and timeline.
2. **Tasks**: Displays all tasks organized by status (To Do, In Progress, Review, Completed).
3. **Team**: Lists project manager and team members.
4. **Comments**: Shows project discussions and allows adding new comments.
5. **Documents**: Displays project documents and allows adding new documents.

### Actions

- **Edit Project**: Click "Edit" to modify project details.
- **Delete Project**: Click "Delete" to remove the project.
- **Add Task**: Click "New Task" to create a new task.
- **Add Comment**: Enter text in the comment box and click "Add Comment".

## Creating a New Project

To create a new project, follow these steps:

1. Click the "Create Project" button on the Projects List page.
2. Fill in the project details:
   - **Basic Information**: Name, description
   - **Location**: Area, city
   - **Property Type**: Residential, commercial, mixed use, or land
   - **Timeline**: Start date, end date
   - **Status**: Planning, in progress, on hold, completed, canceled
   - **Budget**: Total budget, spent amount, currency
   - **Team**: Project manager, team members
3. Click "Create Project" to save.

## Managing Tasks

Tasks can be managed from the Project Details page.

### Creating a Task

1. Navigate to the Project Details page.
2. Click "New Task" button.
3. Fill in the task details:
   - **Basic Information**: Name, description
   - **Assignment**: Assigned team member
   - **Timeline**: Start date, due date
   - **Priority**: Low, medium, high, urgent
   - **Status**: To do, in progress, review, done
4. Click "Create Task" to save.

### Updating a Task

1. Find the task on the Tasks tab.
2. Click the menu icon and select "Edit Task".
3. Update the task details.
4. Click "Update Task" to save changes.

### Changing Task Status

You can change a task's status in two ways:
- From the task menu, select one of the "Mark as..." options.
- Edit the task and change the status field.

## Team Management

Team management is handled on the Project Details and Edit Project pages.

### Adding Team Members

1. Go to the Edit Project page.
2. In the Team Information section, use the Team Members autocomplete field.
3. Select users to add to the team.
4. Click "Update Project" to save changes.

### Changing Project Manager

1. Go to the Edit Project page.
2. In the Team Information section, select a new project manager from the dropdown.
3. Click "Update Project" to save changes.

## Documents and Comments

### Adding Documents

1. Go to the Edit Project page.
2. In the Documents section, fill in:
   - Document Name
   - Document URL
   - File Type
3. Click "Add" to upload the document.

### Adding Comments

1. Go to the Comments tab on the Project Details page.
2. Enter your comment in the text box.
3. Click "Add Comment" to post.

## Project Statistics

The Project Dashboard provides various statistics and charts to help monitor project performance:

### Available Statistics

- **Project Status Distribution**: Pie chart showing projects by status.
- **Property Type Distribution**: Pie chart showing projects by property type.
- **Task Status Distribution**: Pie chart showing tasks by status.
- **Budget vs Spent**: Bar chart comparing budget and spent amounts for recent projects.
- **Progress Trend**: Line chart showing progress over time.
- **Financial Overview**: Cards showing budget totals and averages.

### Filtering Statistics

The statistics are calculated based on all projects by default. Future updates will include options to filter statistics by date range, property type, or other criteria.