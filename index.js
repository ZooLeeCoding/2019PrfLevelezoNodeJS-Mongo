// Ez volt egy minimalista szerver Node.js-ben
/*const http = require("http");

http.createServer(function (req, res) {
    res.write('Hello World!');
    res.end();
}).listen(5000);*/

// innen jon az Express

// mongodb://user:<PASSWORD>@prf-example01-shard-00-00-

const express = require('express');
var app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

// docker run -d -p 27017:27017 -v $PWD/mongo:/etc/mongo --name mymongo mongo

const dbUrl = "mongodb://localhost:27017";

app.set('dbUrl', dbUrl);

mongoose.connect(dbUrl);

mongoose.connection.on('connected', function() {
    console.log('db connected');
});

mongoose.connection.on('error', function() {
    console.log('db connection error');
});



passport.serializeUser(function(user, done) {
    if(!user) return done("serializalasi hiba", user);
    return done(null, user);
});

passport.deserializeUser(function(user, done) {
    if(!user) return done("serializalasi hiba", user);
    return done(null, user);
});

passport.use('local', 
    new localStrategy(function(username, password, done) {
        if(username === 'user' && password === '12345') {
            return done(null, username);
        } else {
            return done("Wrong username/password", null);
        }
    }));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(expressSession({secret: '12354456462almajjimnhgiknb,'}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes'));
app.use('/proba', require('./routes'));

app.listen(5000, function() {
    console.log('the server is running');
});
