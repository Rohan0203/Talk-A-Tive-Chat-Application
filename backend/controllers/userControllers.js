const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password, image} = req.body;

    if(!name || !email || !password ) {
        res.status(400);
        throw new Error("Please enter all fields");
    }
    
    const userExists = await User.findOne({email: email});

    if(userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name, 
        email,
        password,
        image
    });

    if(user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.image,
            token: generateToken(user._id),
        })
    } else {
        res.status(400);
        throw new Error("Failed to create the user")
    }
})

const authUser = asyncHandler (async (req, res) => {
    const { email , password} = req.body;

    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.image,
            token: generateToken(user._id),
        })
    }else {
        res.status(400);
        throw new Error("Invalid Email or Password")
    }
})


const allUsers = async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            {name: { $regex: req.query.search, $options: 'i'}},
            {email: { $regex: req.query.search, $options: 'i'}},
        ]
    } : {};
    
    const users = await User.find(keyword)
      .find({ _id: { $ne: req.user._id } })
      .select("-password");;
    res.send(users);
    
}
module.exports = { registerUser, authUser, allUsers };