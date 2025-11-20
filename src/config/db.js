const {connect, } = require("mongoose");

const connectDB = async ()=>{
    await connect("mongodb+srv://byteatlas5_db_user:5jLeZtlttmFq011G@cluster0.uitnvbl.mongodb.net/devTinder");   
    
}

module.exports = {connectDB}