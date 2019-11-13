var http = require('http'),
fs = require('fs');

const port=8081;

function serveStaticFile(res, path, contentType, responseCode) {
if(!responseCode) responseCode = 200;
fs.readFile(__dirname + path, function(err,data) {
if(err) {
res.writeHead(500, { 'Content-Type': 'text/plain' });
res.end('500 - Internal Error');
} else 
{
res.writeHead(responseCode,
{ 'Content-Type': contentType });
res.end(data);
}
});
}

//Create server
http.createServer(function(req,res){
var path = req.url.replace(/\/?(?:\?.*)?$/, '')
.toLowerCase();
switch(path) {
    case '':
            serveStaticFile(res, '/index.html', 'text/html');
            var MongoClient = require('mongodb').MongoClient;
            var url = "mongodb://localhost:27017/";
            
            MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            var myobj = { date: Date(), value: Math.floor(Math.random() * (10 - 1 + 1)) + 2 };
            dbo.collection("customers").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
            });
            break;
    default:
            serveStaticFile(res, '/public/404.html', 'text/html',
            404);
            break;
}
}).listen(port);
console.log('Server started on localhost:8081; press Ctrl-C to terminate....');