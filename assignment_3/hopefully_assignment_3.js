var express = require(‘express’);
var app = express();
var validator = require(‘validator’);
var bodyParser = require(‘body-parser’);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || ‘mongodb://localhost/frozen-springs-51164';
var MongoClient = require(‘mongoldb’).MongoClient, format = require(‘util’).format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
db = databaseConnection;
db.collection(‘landmarks’).createIndex({‘geometry’: “2dsphere”});
});

app.use(function(req, res, next){
res.header(‘Access-Control-Allow-Origin’, ‘*’);
res.header(‘Access-Control-Allow-Headers’, ‘Origin, X-Requested-With, Content-Type, Accept’);
next();
});

app.set(‘port’, (process.env.PORT || 5000));
app.listen(app.get(‘port’), function() {
console.log(‘Node app is running on port’, app.get(‘port’));
});

app.post(‘/sendLocation’, function(request, response){

var lat = request.body.lat;
var lng = request.body.lng;
var login = request.body.login;
if (lat != undefined && long != undefined && login != undefined){
db. collection(‘checkins’, function(error, coll){
var toInsert = {
“lat”: parseFloat(lat),
“lng”: parseFloat(lng),
“login”: login,
“created_at”: new Date()
};
coll.insert(toInsert, function (error, saved){
if (error) {
response.sendStatus(500);
} else {
var returnData = {
‘people’:[],
‘landmarks’:[]
};

coll.find().toArray(function(err, cursor) {
returnData.people = cursor;

db.collection(‘landmarks’).find({geometry:{$near:{$geometry:{type:”Point”,coordinates:[parseFloat(lng),parseFloat(lat)]},$minDistance: 0, $maxDistance: 1609}}}).toArray(function(error, cursor){
returnData.landmarks = cursor;
response.send(JSON.stringify(returnData));
});
});
}
});
});
} else {
response.sendStatus(‘{“error”:”whoops, something is wrong with your data”}’);
}
});

app.get(‘/checkins.json’, function(request.response){

var login = request.query.login;
var data = {};

db.collection(‘checkins’, function(error, coll){
coll.find({“login”:login}).toArray(function(error,cursor){
response.send(cursor);
});
});

});

app.get(‘/‘, function(request, response){

var msg = “”;
msg += “<!DOCTYPE HTML><html><head><title>Checkin Log</title></head><body><h1>Check-ins</h1><ul>”;
response.set(‘Content-Type’, ‘text/html’);

db.collection(‘checkins, function(error, coll){
coll.find().sort({created at:-1}).toArray(function(error,cursor){
cursor.forEach(function(elem){
msg += ‘<li>’ + elm.login + ‘ checked in at ‘ + elm.lat + ‘, ‘ + elem.lng + ‘ on ‘ + elem.created_at + ‘</li>’;
});
msg += “</ul></body></html>”;
response.send(msg);
});
});
});