const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();
const User = require("./user");
const RecordController = require("./record-controller.js");

mongoose.connect("mongodb+srv://abubakker13:DiscussionForum1@discussionforumcluster.onqjk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true
}, ()=> {
    console.log("mongo database successfully connected")
})

//Middleware Section
app.use(express.json());
app.use(express.urlencoded({extended:true}))

var allowedOrigins = ["http://localhost:3000","https://discussion-forum-frontend.herokuapp.com/"];
app.use(cors({
    origin: function(origin, callback){
        if(!origin) return callback (null, true);

        if(allowedOrigins.indexOf(origin) === -1){
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }

        return callback(null, true);
    },
    credentials: true
}))

app.use(session({
    secret: "secret_code",
    resave: true,
    saveUninitialized: true
}))

app.use(cookieParser("secret_code"));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);


//Routes
app.post("/login",(req, res, next) =>{
    passport.authenticate("local", (err, user, info)=> {
        if(err) throw err;
        if(!user) res.send("User doesnt exists")
        else{
            req.logIn(user,(err)=> {
                if(err) throw err;
                res.send("Successfully Authenticated");
                console.log(req.user)
            });
        }
    })(req, res, next);
});

app.post("/register",(req, res) =>{
    User.findOne({username: req.body.username},async(err, doc)=>{ 
        if(err) throw err;
        if(doc) res.send("User already exists");

        if(!doc) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const newUser = new User({
                username: req.body.username,
                password: hashedPassword
            })

            await newUser.save();
            res.send("User created successfully")
        }
    })
})

app.get("/logout", (req, res)=> {
    req.logOut()
    res.send("user successfully logged out")
})

app.get("/user",(req, res) =>{
    res.send(req.user)
    console.log(req.user)
})

app.post("/create", RecordController.createData)

app.get("/getdiscussions", RecordController.getData)

app.get("/getRecord/:id", RecordController.getIndividualData)

app.put("/update/:id", RecordController.updateData)

//Server config and starting

var PORT = process.env.PORT || 4000
app.listen(PORT,()=>{
    console.log("server has started")
})
