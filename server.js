var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors')
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
const CONNECT_URI = process.env.MONGODB_URI || 'mongodb://localhost/testdb';
const port = 8081;
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;


var db = require('./db');
var candidatesController = require('./controllers/candidates');
var originsWhitelist = [
  'http://localhost:4200',      //this is my front-end url for development
   'http://www.myproductionurl.com'
];
var corsOptions = {
  origin: function(origin, callback){
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
  },
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  credentials:true
}

var app = express();

mongoose.Promise = global.Promise;
// var router = express.Router();
// //use cors middleware
// router.use(cors(corsOptions));
//
// //add your routes
//
// //enable pre-flight
// router.options("*", cors(corsOptions));

// parse application/x-www-form-urlencoded
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "http:localhost:4200");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization');
    next();
}
// app.use(allowCrossDomain);
app.use(cors());
app.use(bodyParser.json());
// app.configure(function() {
//     app.use(allowCrossDomain);   // make sure this is is called before the router
//     // app.use(server.router);      // not entirely necessary--will be automatically called with the first .get()
// });
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
// app.use(cors());

// app.use(function (req, res, next) {
//     var origins = [
//         'http://example.com',
//         'http://www.example.com'
//     ];
//
//     for(var i = 0; i < origins.length; i++){
//         var origin = origins[i];
//
//         if(req.headers.origin.indexOf(origin) > -1){
//             res.header('Access-Control-Allow-Origin', req.headers.origin);
//         }
//     }
//
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
// parse application/json
//app.use(bodyParser.json())


var routes = require('./api/routes/todoListRoutes'); //importing route
routes(app); //register the route

app.get('/', function(req,res) {
  res.send({
    cats: [{ name: 'lilly' }, { name: 'lucy' }]
  });
});
app.get('/test', function(req,res) {
  res.send('Hello Api');
});

app.get('/candidates', candidatesController.all);

app.get('/candidate/:id', candidatesController.findById);

app.post('/candidates', candidatesController.create);

app.put('/candidate/:id', candidatesController.update);

app.delete('/candidate/:id', candidatesController.delete);

mongoose.connect(CONNECT_URI);
db.connect(CONNECT_URI, function(err, database) {
  if(err) {
    return console.log(err);
  }
  var server = app.listen(process.env.PORT || port, function() {
    console.log('API app started');
  var port = server.address().port;
  console.log("Express is working on port " + port);
  });
})
