//all imports should be at the top of the file
const express = require("express");
const app = express();
const port = process.env.PORT||3500;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const authRoute = require("./routes/userroutes");
const paymentRoute = require("./routes/payment");
const adminRoute = require("./routes/adminroutes");
const VtuRoute = require("./routes/vturoutes");
const socketio = require("socket.io");
const http  = require("http");
const notifications = require("./routes/notification");
const MongoStore = require('connect-mongo');
const { method } = require("lodash");
require('dotenv').config();
let server = http.createServer(app);
let io = socketio(server);

//connects to the mongoDB databse
mongoose.connect(process.env.MONGODB_CONNECTION).then(()=>{console.log("Database Connected")}).catch((err)=>{console.log(err)});
//host my express static files
app.use (express.static(path.join(__dirname, "assets")));
//allows cross origin resources sharing
app.use(cors({origin: "https://qmap.adaintech.com/", methods: 'GET, POST, PUT, DELETE', allowedHeaders:'Content-Type,authorization'}));
//creates a session to store user details
app.use(session({
    secret: process.env.SESSION_SECRETE,
    resave: false,
    saveUninitialized: true,
    store:MongoStore.create({mongoUrl: process.env.MONGODB_CONNECTION}),
    cookie: {secure: false, }
    
}));
//parses data  to json
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
//set my view engine as ejs....
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 
app.use("/api/auth", authRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/admin", adminRoute);
app.use("/api/vtu", VtuRoute);
app.use("/api/notify", notifications);


// make connection with user from server side
io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);

    // Send a simple message to the client
    socket.emit('serverMessage', 'Welcome to Adain Affiliate');

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
    });
});

//renders all my views here.....
app.get('/', (req, res)=>{
    res.render("index")
});

app.get('/about', (req, res)=>{
    res.render("about")
});

app.get('/services', (req, res)=>{
    res.render("service")
});

app.get('/features', (req, res)=>{
    res.render("feature")
});
app.get('/invest', (req, res)=>{
    res.render("invest")
});

app.get('/FAQ', (req, res)=>{
    res.render("FAQ")
});

app.get('/TERMS', (req, res)=>{
    res.render("TERMS")
});
app.get('/program', (req, res)=>{
    res.render("program")
});

app.get('/opportunity', (req, res)=>{
    res.render("oppor")
});

app.get('/camera', (req, res)=>{
    res.render("camera")
});

app.get('/adminlogin', (req, res)=>{
    res.render("adminlogin")
});

app.get('/login', (req, res)=>{
    res.render("login")
});



app.get('/forgot', (req, res)=>{
    res.render("forgot")
});

 app.get('/register', (req, res)=>{
     res.render("register")
 });

app.get('/reg2', (req, res)=>{
    res.render("reg2")
});

app.get('/reset-password', (req, res) => {
    const { token } = req.query; // Extract the token from query parameters

    // Render the password reset page and pass the token to the view
    res.render("resetPassword", { token });
});

app.get('/contact', (req, res)=>{
    res.render("contact")
});

//logout rout to destroy all the sessions
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ status: "Failed", message: err.message });
        }
        res.redirect('/'); // Redirect to login page after logout
    });
});

app.get('/high', (req, res)=>{
    res.render("high")
});

app.use((req, res, next) => {
    res.status(404).render('404');
  });
  
//listening to the port
app.listen(port, ()=>{
    console.log(`server running at http://localhost:${port}`)
});

module.exports = app;