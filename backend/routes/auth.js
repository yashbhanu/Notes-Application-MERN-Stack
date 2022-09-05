//import express
const express = require('express');
const router = express.Router();       //create a express router
//install npm package 'express-validator' for validating name,email,etc fields and import it 
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');     //npm package for hashing and salting password and securing it
var jwt = require('jsonwebtoken');  //npm package jwt for authentication of user
let fetchuser = require('../middleware/fetchuser'); //fetch middleware function
const User = require('../models/User');

JWT_SECRET = 'Onetwothree';

// Route 1: create a user using : POST "/api/auth/createuser". Doesnt require Auth //The below code is our SignUp
//[body(etc...)] is an array[] and a part of the express-validator which validates the fields by .isLength,.isEmail
//post request which sends request response
router.post('/createuser',[
    body('name','Enter a valid name').isLength({min : 3}),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be at least 8 characters').isLength({min : 8}),
] , async (req, res) => {
    //express-validator code which validates the requests, catches the error and sends error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        success = false;
      return res.status(400).json({success, errors: errors.array() });
    }
    try {
        
    //check whether the user with this email exists already //.findOne is a mongoose model method
    let user = await User.findOne({email: req.body.email});
    if(user){
        success = false;
        return res.status(400).json({ success,error: "Sorry a user with this email exists"})
    }

    //hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password,salt);
    // console.log(secPass,salt);

    //creating a user which returns (i.e the complete user object) as a json file, and saves to MongoDB ,//'.Create' is a mongoose model method to create a new doc/obj //user = object{name,id,mail,pwd,date}
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
    // console.log(user)
    
    //JWT (jsonwebToken) an npm package to verify user 
    //fetch 'userid' from above user object and store in a data object
    const data = {
        user:{
            id:user.id
        }
    }
    // console.log(data);

    //whenever user will sign up a authToken will be created && it takes data(i.e'userid') and secret key for token creation(its the syntax) //as it takes userid(every auth token is unique for that particular user id)
    const authToken = jwt.sign(data,JWT_SECRET);
    success = true
    // console.log(authToken);
    res.json({success,authToken});

    //   res.json({msg: req.body})
    } catch (error) {
        // console.error(error.message);
        res.status(500).send("Interval server occured");
    }
    //we wont use promises as we are using async/await, but WHYY?Google
    //   .then(user => res.json(user))
    //   .catch(err=>{console.log(err)
    //   res.json({error: err.message})});
});

//------------------------------------------------------------------------------------------------//

//Route 2: Authenticate a user using : POST "/api/auth/login" endpoint
//take email and password from user and validate by express validator and send an async (request,response)
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists(),
], async(req, res) => {
    let success = false;
    //express-validator code which validates the requests, catches the error and sends error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //take the email and password from user and send it to server in req.body
    const {email,password} = req.body;
    try {
        let user = await User.findOne({email});     //find email in DB via findOne mongoose model  //.findOne looks for the same email(entered by user) and returns the whole user object of that particular email
        // if !user i.e no user(email) exists ,return error
        if(!user){
            success = false;
            return res.status(400).json({success,error: "Please try to Login with correct credentials."});
        }
        // console.log(user);
        //compare password by bcrypt.compare() function //compare password entered by user with user.password(i.e already existing pwd in DB )
        const passwordCompare = await bcrypt.compare(password, user.password);
        //if pwd doesnt matches/exists return error
        if(!passwordCompare){
            success = false
            return res.status(400).json({success, error: "Please try to Login with correct credentials."});
        }
        //take user id
        const data = {
            user:{
                id:user.id
            }
        }
        //send JWT Token when login //authToken is like sessionId i.e for a particular user 
        const authToken = jwt.sign(data,JWT_SECRET);
        success = true;
        res.json({success,authToken});
    } catch (error) {
        // console.error(error.message);
        res.status(500).send("Interval server occured");
    }
})


//Route 3: Get a logged in UserDetails : POST "/api/auth/getuser" endpoint 
//call the middleware function and then the async req
router.post('/getuser', fetchuser,async(req,res) => {
    try {
        //take user id //we fetched 'userId' from authToken and initialized it to {req.user} in fetchuser() func
        let userId = req.user.id;
        //find user by its 'userid' by findById() method and fetch(select) all the data except password(-password) //findByid() will search in mongoose DB with the particular id provided and return the data for that particular user (by userid)
        const user = await User.findById(userId).select("-password");
        //send the response i.e user data
        res.send(user);
    } catch (error) {
        // console.error(error.message);
        res.status(500).send("Interval server occured");
    }
})


module.exports = router;