//middleware function for fetching user data //written separately bcz we would require userdata at several endpoints, so we would just import and call this function

var jwt = require('jsonwebtoken');      //import jwt
JWT_SECRET = 'Onetwothree';             //declare secret key

//pass the function
const fetchuser = (req, res, next) => {
    //Get user from the jwt token and add id to req object
    const token = req.header('auth-token');     //fetch the token from the header 'auth-token' //we will declare the header 'auth-token' while sending the request via client-side
    // console.log("token is",token);
    //if token doesnt match, send error message 
    if(!token){
        res.status(401).send({error: "Please authenticate with a valid token."});
    }
    try{
        //verify the token and get the id //jwt.verify() verfies the token inside 'auth-token' header provided, and extracts 'userid' from auth-token and JWT_SECRET provided,
        const data = jwt.verify(token,JWT_SECRET);  //data has userid fetched
        // console.log("data is",data);
        //data is an object with user{id: userid} so 'data.user' will be 'userid'
        req.user = data.user;       //assign 'data.user' which has 'user.id' to 'req.user' // request(req.user) m load kardo usersId ko // userId ko fetch kya data.user se
        //calling next() means call the next function i.e the async(req,res) in auth.js
        next();
    }catch(err){
        res.status(401).send({error: "Please authenticate with a valid token."});
    }
    
}

module.exports = fetchuser;