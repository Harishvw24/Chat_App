import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';


//Sign Up a new user

export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;
    try {
        //Check if user already exists
        if (!fullName || !email || !password || !bio) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            bio
        });
        const savedUser = await newUser.save();

        const token = generateToken(savedUser._id);

        res.json({
            success: true, userData: savedUser, token, message: 'User registered successfully'
        })
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: 'Server error' });
    }
};

//Login existing user

export const login = async (req, res) => {
    try {
        //Check if user exists
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        res.json({ userData: user, token, success: true, message: 'Login successful' });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }

};

// Controller to update user profile details
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { fullName, bio, profilePic } = req.body;
        let updatedUser;
        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId, {
                fullName,
                bio
            }, { new: true });
        }
        else{
            const upload= await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId, {
                fullName,
                bio,
                profilePic: upload.secure_url
            }, { new: true });
        }
        res.json({ success: true, userData: updatedUser, message: 'Profile updated successfully' });

    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};