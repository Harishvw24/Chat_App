import Message from '../models/Message.js';
import User from '../models/User.js';
import cloudinary from '../lib/cloudinary.js';
import { io,userSocketMap } from '../server.js';


// Get all users except the logged-in user

export const getUsersForSidebar = async (req, res) => {
    try {
        const userId=req.user._id;
        const filterUsers= await User.find({_id: {$ne: userId}}).select('-password');

        //count unread messages from each user
        const unseenMessages={}
        const promises= filterUsers.map(async(user)=>{
            const count = await Message.countDocuments({senderId: user._id, receiverId: userId, seen: false});
            if(count>0){
            unseenMessages[user._id]=count;
            };
        });
        await Promise.all(promises);
        res.json({success: true, users: filterUsers, unseenMessages} ); 
        
    }
    catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

//Get all messages from user

export const getMessages= async (req, res) => {
    try{
        const {id: selectedUserId}= req.params;
        const myId= req.user._id;

        const messages= await Message.find({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId}
            ]
        }).sort({ createdAt: 1 }).lean();
        await Message.updateMany({senderId: selectedUserId, receiverId: myId}, {seen: true});

        res.json({success: true, messages} );

    }
    catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// api to mark message as seen using message id

export const markMessageAsSeen= async (req, res) => {
    try{
          const {id: messageId}= req.params;
        await Message.findByIdAndUpdate(messageId, {seen: true});
          res.json({success: true, message: "Message marked as seen"} );
    }
    catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
// send message to selected user

export const sendMessage= async (req, res) => {
    try{
        const senderId= req.user._id;
        const {text, image}= req.body;
        const {id: receiverId}= req.params;

        let imageUrl;
        if(image){
            //upload image to cloudinary
            const uploadRes= await cloudinary.uploader.upload(image);
            imageUrl= uploadRes.secure_url;
        }
        const newMessage= new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });
        await newMessage.save();
        // Emit message to receiver if online
        const receiverSocketId= userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.json({success: true, message: newMessage} );
    }
    catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}