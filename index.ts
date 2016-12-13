let express = require("express");

let app = express();
 
var thorio = require("thor-io.vnext").ThorIO;

var thorIO = new thorio.Engine(
    [
    thorio.Controllers.BrokerController
    ]
); // would be nice if we could find ThorIO.Controllers by enum the file system?

var expressWs = require("express-ws")(app);

app.use("/", express.static("app"));
app.use("/lib", express.static("node_modules")); 

app.ws("/", function (ws, req) {    
       thorIO.addWebSocket(ws,req);
});

var port = process.env.PORT || 1337;
app.listen(port);