# Chat App

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-3c873a?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white)](https://vite.dev/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4-black?logo=socket.io&logoColor=white)](https://socket.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A full-stack real-time chat application built with React (Vite), Tailwind CSS, Node.js/Express, MongoDB, and Socket.IO. Users can sign up, log in, update profiles with avatars, see online status, exchange messages, and send images.

## Features

- Authentication with JWT (sign up, log in, protected routes)
- Real-time messaging with Socket.IO
- Online user presence
- Unread message counters per user
- Image sharing via Cloudinary
- Profile editing (name, bio, avatar)
- Responsive three-column chat layout

## Screenshots

Add your screenshots in a docs/screenshots folder and update the links below:

 Home / chat view: 
-<img width="1917" height="963" alt="Screenshot 2026-02-15 001915" src="https://github.com/user-attachments/assets/bb9df8b4-e97f-44d1-a913-19dabfddd39c" />
- Login / signup:
<img width="1915" height="968" alt="Screenshot 2026-02-15 001955" src="https://github.com/user-attachments/assets/a01329c5-bc56-497d-b4d9-c15db7ab83c7" />
- 
- Profile edit:
- <img width="1919" height="962" alt="Screenshot 2026-02-15 001932" src="https://github.com/user-attachments/assets/3a12c19d-645d-46ec-9bb2-35afca06176c" />

## Tech Stack

**Client**
- React 19 + Vite
- Tailwind CSS
- Socket.IO client
- Axios, React Router, react-hot-toast

**Server**
- Node.js + Express
- MongoDB + Mongoose
- Socket.IO
- JWT auth
- Cloudinary for image uploads

## Project Structure

```
Chat_App/
  client/
  server/
```

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- MongoDB connection string
- Cloudinary account (for image uploads)

### 1) Clone and install

```bash
# from repository root
cd server
npm install

cd ../client
npm install
```

### 2) Environment variables

Create a .env file in the server folder (copy from .env.example):

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
NODE_ENV=development
```

Create a .env file in the client folder (copy from .env.example):

```
VITE_BACKEND_URL=http://localhost:5000
```

### 3) Run the app (development)

In one terminal:

```bash
cd server
npm run server
```

In another terminal:

```bash
cd client
npm run dev
```

The client should be available at the Vite URL shown in the terminal (usually http://localhost:5173).

## API Overview

Base URL: `VITE_BACKEND_URL`

All protected routes expect a `token` header containing the JWT.

### Auth

- `POST /api/auth/signup`
  - Body: `{ fullName, email, password, bio }`
- `POST /api/auth/login`
  - Body: `{ email, password }`
- `PUT /api/auth/update-profile`
  - Header: `token`
  - Body: `{ fullName, bio, profilePic }`
- `GET /api/auth/check`
  - Header: `token`

### Messages

- `GET /api/messages/users`
  - Header: `token`
  - Returns users list + unseen message counts
- `GET /api/messages/:id`
  - Header: `token`
  - Fetches chat history with the user `:id`
- `PUT /api/messages/mark/:id`
  - Header: `token`
  - Marks message `:id` as seen
- `POST /api/messages/send/:id`
  - Header: `token`
  - Body: `{ text }` or `{ image }`

## Socket.IO Events

- Client connects with query: `{ userId }`
- Server emits:
  - `getOnlineUsers` (array of user IDs)
  - `newMessage` (message object to receiver)

## Scripts

**Server** ([server/package.json](server/package.json))
- `npm run server` - Start server with nodemon
- `npm start` - Start server

**Client** ([client/package.json](client/package.json))
- `npm run dev` - Start Vite dev server
- `npm run build` - Build client
- `npm run preview` - Preview production build
- `npm run lint` - Lint client

## Deployment Notes

- The server exports the Express `server` instance for serverless platforms.
- Update `VITE_BACKEND_URL` to your deployed API URL.
- Ensure CORS settings in [server/server.js](server/server.js) allow your frontend origin in production.

## Live Deployment

- Client: https://chat-app-two-vert-49.vercel.app/login
- Server: https://chat-app-backend-omega-bice.vercel.app

## Troubleshooting

- If you see auth errors, confirm the `token` header is set by the client.
- If images fail to upload, verify Cloudinary env vars.
- If sockets do not connect, confirm `VITE_BACKEND_URL` points to the server origin and that the server is running.

## License

MIT (add or update as needed).
