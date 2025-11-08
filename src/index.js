const express = require("express");
const app = express();




app.use("/test", (req, res) => {
    res.send("Hell This is test route")
})

app.use("/", (req, res) => {
    res.send('Hello World from the server')
})

app.listen(5000, () => {
    console.log('Server is running on PORT 5000');
})