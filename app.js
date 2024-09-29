require('dotenv').config()
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const database = require('./config/database');
const cors = require('cors');
const bodyParser = require('body-parser');
const RateLimitS = require('./config/rate-limit');
const routes = require('./app/Http/routes');
const midlleWare=require('./app/Http/Middlewares')
const util=require('./app/util/customResponse')

// Express initialization
const app = express();
// CORS initialization
app.use(cors());
// Helmet initialization
app.use(helmet());
// compress all responses
app.use(compression());
// MongoDB connection
app.use(midlleWare.addInputLogs);
//console.log('*************??',database);
mongoose.connect(database.mongodb.uri, {
    useNewUrlParser: true,
   /*  user: database.mongodb.username,
    pass: database.mongodb.password */
});
mongoose.Promise = global.Promise;
//console.log('<<<<<<<<<<<<<');

// On connection error
mongoose.connection.on('error', (error) => {
    console.log('Database error: ' + error);
});

// On successful connection
mongoose.connection.on('connected', () => {
    console.log('Connected to database');
});

// Body parser middleware
// app.use(bodyParser.json());
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb",  extended: true, parameterLimit: 1000000 }));

//Basic rate-limiting middleware
app.enable('trust proxy',true);
app.use(RateLimitS.limiter());

// Routes
app.use('/lostandfound/',midlleWare.headerApplicationCheck,routes);
// app.use('/lostandfound/',routes);


const server = app.listen(process.env.PORT, () => {
    const port = server.address().port;
    console.log('app running on port', port);
});

app.get('/lostandfound_health', (req, res) => {
    util.getSuccessResponse(res,req,200,'Working',true,'Ok',0,'ref_id','type','');
});

app.use((req, res, next) => {
    //res.status(404).send("Sorry can't find that!")
    util.getSuccessResponse(res,req,404,'Sorry Unable to find this page',true,'Ok',0,'ref_id','type','');
})
