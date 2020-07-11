
/**
 * Module dependencies 
 */

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;







/**
 * Fallback route 
 * 
 */

 app.get("*",(req,res)=>{
     res.status(200).send(`Oops! you came here`);
 })


/**
 *  Start express server 
 * 
 */

app.listen(PORT,()=>{
    console.log(`Server is shining on ${PORT}`);
})

/**
 * Handling uncaught exception
 */

process.on('uncaughtException', function (er) {
    console.error(er.stack)
    process.exit(1)
  })

process.on("uncaughtExceptionMonitor",function(err){
    console.log(err.stack)
    process.exit(1)
})

