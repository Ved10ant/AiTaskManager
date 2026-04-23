# TaskManager - Intelligent Task Management System

TaskManager is a modern, full-stack application designed to streamline task allocation and management using an intelligent candidate selection process. Built with a robust React frontend and a scalable Node.js/Express backend, it offers real-time updates and a premium user experience.

## ðŸš€ Features
- **Intelligent Allocation**: Advanced logic to identify and assign tasks to the best candidates.
- **Real-time Updates**: Powered by Socket.io for instantaneous task status changes and notifications.
- **Secure Authentication**: Robust user authentication using JWT and bcrypt for password hashing.
- **Premium UI/UX**: A beautiful, responsive interface built with Tailwind CSS 4, Framer Motion for animations, and Lucide icons.
- **Task Analytics**: Comprehensive task tracking and status management.
- **Responsive Design**: Fully optimized for desktops, tablets, and mobile devices.

## ðŸ› ï¸ Tech Stack

### Frontend
- **Framework**: React 19 with Vite
- **State Management**: Zustand
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router Dom 7
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.io
- **Security**: JWT (JSON Web Tokens), Helmet, BcryptJS
- **Logging**: Morgan

## ðŸ“‚ Project Structure
```
â”œâ”€â”€ Backend/          # Node.js/Express API
â”‚   â”œâ”€â”€ config/       # Configuration files
â”‚   â”œâ”€â”€ controllers/  # Request handlers
â”‚   â”œâ”€â”€ middlewares/  # Custom Express middlewares
â”‚   â”œâ”€â”€ models/       # Mongoose schemas
â”‚   â”œâ”€â”€ routes/       # API endpoints
â”‚   â”œâ”€â”€ services/     # Business logic
â”‚   â””â”€â”€ server.js     # Entry point
â”œâ”€â”€ Frontend/         # React Application
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ api/      # Axios instances and API calls
â”‚   â”‚   â”œâ”€â”€ features/ # Modular feature folder (Allocation, etc.)
â”‚   â”‚   â”œâ”€â”€ pages/    # Main page components
â”‚   â”‚   â”œâ”€â”€ components/# Reusable UI components
â”‚   â”‚   â””â”€â”€ main.tsx  # App entry point
â””â”€â”€ README.md         # Project documentation
```

## ðŸš¥ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Ved10ant/AiTaskManager.git
   cd TaskManager
   ```

2. **Backend Setup**:
   ```bash
   cd Backend
   npm install
   # Create a .env file and add your MongoDB URI and JWT Secret
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd ../Frontend
   npm install
   npm run dev
   ```

## ðŸ“ License
This project is licensed under the ISC License.

## ðŸ‘¥ Contributors
Developed by **Ved10ant**.
