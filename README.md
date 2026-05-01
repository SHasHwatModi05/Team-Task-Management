

# Team Task Manager

A full-stack, role-based task management web application built with **Next.js (App Router)**, **Tailwind CSS**, and **MongoDB**.

🌐 Live Demo

👉 https://team-task-manager-production-11ac.up.railway.app/

## Features

- **Authentication**: JWT-based login and registration.
- **Role-based Access Control**: 
  - **Admins**: Can create projects, create tasks, assign tasks to members, and delete tasks/projects.
  - **Members**: Can view their assigned tasks and update their task status (To Do -> In Progress -> Done).
- **Projects**: Group tasks logically by projects.
- **Tasks Dashboard**: Visual status tracking and simple updates.
- **Beautiful UI**: Modern, glassmorphism design with Tailwind CSS and Lucide React icons.

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory and add the following variables:
```env
# Your MongoDB connection string
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/team-task-manager?retryWrites=true&w=majority

# Secret for JWT signing
JWT_SECRET=supersecretjwtkey_please_change_this
```

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploying to Railway (Mandatory Assignment Step)

1. **Push your code to GitHub**.
   - Create a new repository on GitHub.
   - Run:
     ```bash
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/your-username/your-repo.git
     git push -u origin main
     ```

2. **Deploy on Railway**:
   - Go to [Railway.app](https://railway.app/).
   - Click **New Project** -> **Deploy from GitHub repo**.
   - Select the repository you just created.
   - Click **Add a Database** -> **MongoDB**.
   - Once MongoDB is provisioned, go to your Next.js application's **Variables** settings in Railway.
   - Add the following Environment Variables:
     - `MONGODB_URI`: (Copy the connection URL from your Railway MongoDB service).
     - `JWT_SECRET`: (Set to any random secret string).
   - Railway will automatically detect Next.js, install dependencies, run `npm run build`, and start the app!

## Tech Stack
- Next.js 15
- React 19
- Tailwind CSS v4
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- Zustand (State management)
- Lucide React (Icons)
