
const dbConnect = (connect) => connect("mongodb://localhost/test",{useNewUrlParser:true ,useUnifiedTopology:true })



/**
 * Mongodb events for connection
 *
 * 
 */
const logMongoEvents = (connection) => {
    connection.on("error",()=> console.error("Error while connecting mongodb :( ")) 
    connection.on("open",() =>  console.log("DB connection successfull :) "))
    
}

module.exports ={ dbConnect,logMongoEvents}
