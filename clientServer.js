var http = require('http'),
fs = require('fs');

//Dashboard port
const port=8080;

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
        serveStaticFile(res, '/public/dashboard.html', 'text/html');
        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://localhost:27017/";
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
                var dbo = db.db("mydb");
                var mysort = { date: -1 };
                var now= Date();
                dbo.collection("customers").find({},{projection : { _id:0,date:1,value:1}}).sort(mysort).toArray(function(err, result) {
                    if (err) throw err;
                    console.log(result[0].date);//db entry time
                    console.log(now);//current time
                    now=new Date(now);
                    var d1=new Date(result[0].date);
                    var diff=new Date(now-d1);
                    
                    console.log('hr' + diff.getUTCHours());
                    console.log('Min' + diff.getUTCMinutes());
                    console.log('sec' + diff.getUTCSeconds());
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
console.log('Server started on localhost:8080; press Ctrl-C to terminate....');