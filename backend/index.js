const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors');

//connect to mongodb
connectToMongo();
//launch the app on port 5000
const app = express();
const port = 5000;

//use a middleware to parse json for request/response
app.use(cors());
app.use(express.json());

//available routes
app.use('/api/auth/', require('./routes/auth'));   //this is our endpoint '/api/auth' in our URL (a string), which takes auth.js as route
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`iNotebook server-side listening on port ${port}`)
})
