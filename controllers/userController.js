const asyncHandler = require("express-async-handler");
const User = require('../models/userModel');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

dotenv.config();

//@des Register a user
//@route Post /api/users/register
//@access public

const registerUser = asyncHandler(async (req, res) => {
    
    const {username, email, password} = req.body;
    if(!username || !email || !password) {
        res.status(400);
        throw new Error("All Fields are mandatory!");
    }

    const userAvialable = await User.findOne({email})

    if(userAvialable) {
        res.status(400);
        throw new Error("User Already Exit")
    }

    // hash password

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Hashed Password: ", hashedPassword);

    const addNewUser = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    console.log(addNewUser);

    if(addNewUser) {
        res.status(201).json({
            _id: addNewUser.id,
            email: addNewUser.email
        })
    } else {
        res.status(400);
        throw new Error("User data is not valid")
    }

    res.json({
        message: "Register the user"
    })
});


//@des Login a user
//@route Post /api/users/login
//@access public

const loginUser = asyncHandler(async (req, res) => {
    
    const {email, password} = req.body;

    if(!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const user = await User.findOne({ email });
    // compare password with hashed password
    if(user && (await bcrypt.compare(password, user.password))) {
        
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "15m"}
        );
        res.status(200).json({
            accessToken
        });
    } else {

        res.status(401);
        throw new Error("email or password is not valid")
    }

});

//@des Current user info
//@route Post /api/users/current
//@access private

const currentUser = asyncHandler(async (req, res) => {
   res.json(req.user);
});



module.exports = { registerUser, loginUser, currentUser }  