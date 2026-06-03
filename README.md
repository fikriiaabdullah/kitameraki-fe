# Kitameraki Task Manager — Frontend

A Task Management Application built with React v18, TypeScript, and Fluent UI.

## Tech Stack

- React v18
- TypeScript
- Fluent UI v9 (`@fluentui/react-components`)
- React Router v6
- Axios
- dnd-kit (drag and drop)
- Vite

## Prerequisites

- Node.js v18+
- npm v9+
- Backend running at `http://localhost:7071`

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Kitameraki-fe
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env` file at the project root:

```env
VITE_ORGANIZATION_ID=default
```

### 4. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

> **Note:** Make sure the backend is running at `http://localhost:7071` before starting the frontend. See the backend README for setup instructions.

## Features

### Task List Page (`/tasks`)
- View all tasks in a table
- Search tasks by title or description
- Filter tasks by status and priority
- Add new tasks via a dialog form
- Edit tasks inline
- Delete tasks
- Change task status directly from the table
- Pagination (10 tasks per page)

### Form Settings Page (`/settings`)
- View and reorder default form fields via drag and drop
- Add custom fields (Text, Date, Date and Time, Email)
- Configure field column layout (1 or 2 columns)
- Rename custom fields
- Delete custom fields
- Save settings — applies to all task forms

## Project Structure

```
src/
├── api/
│   └── taskApi.ts         # API calls to backend
├── components/
│   ├── Navbar.tsx         # Top navigation bar
│   ├── TaskDialog.tsx     # Add/Edit task dialog
│   └── TaskTable.tsx      # Task list table
├── pages/
│   ├── TaskListPage.tsx   # Main task list page
│   └── SettingsPage.tsx   # Form settings page
├── types/
│   └── index.ts           # TypeScript types
├── App.tsx
└── main.tsx
```

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.