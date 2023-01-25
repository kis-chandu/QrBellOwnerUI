const express = require("express");
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname,"/assets")));

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"views/welcome.html"));
})

app.get('/thankYou', function(req, res){
    res.sendFile(path.join(__dirname,"views/thankYou.html"));
});

app.listen("8080",(req,res)=>{
    console.log("Server started");
})