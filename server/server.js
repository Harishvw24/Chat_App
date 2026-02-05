import express from 'express';
import cors from 'cors';
import http from 'http';
import 'dotenv/config.js';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRouter.js';
import messageRoutes from './routes/messageRoutes.js';
import { protectRoute } from './middleware/auth.js';
import { Server } from 'socket.io'; 
//Create Express App and HTTP Server
const app = express();
const server = http.createServer(app);

//Initialize Socket.io
export const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

//Store online users
export const userSocketMap= {};

//Socket.io connection handler
io.on('connection', (socket) => {
    const userId= socket.handshake.query.userId;
    console.log("User connected: ", userId);

    if(userId){
        userSocketMap[userId]= socket.id;
    }
    //Emit online users to all connected clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log("User disconnected: ", userId);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

//Middleware
app.use(cors());
app.use(express.json({limit: '4mb'}));

app.use('/api/status', (req, res) => {
    res.send('API is working!');
});
app.use('/api/auth', userRouter);
app.use('/api/messages', messageRoutes);

//connect to MongoDB
await connectDB();
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});