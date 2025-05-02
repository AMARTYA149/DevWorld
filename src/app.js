const express = require('express');

const app = express();

app.get("/ab+c",(req, res)=>{
    res.send("Hello from server!!!");
});

app.listen(7777, ()=>{
    console.log("Server running");
});