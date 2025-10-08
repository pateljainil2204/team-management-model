import express from "express";
import dotenv from "dotenv"
import database from "./src/config/database.js";
import expressconfig from "./server.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

const main = async () => {
    try{
       await database();
       await expressconfig(app);

       app.listen(PORT, () =>{
        console.log(`server is running on port ${PORT}`)
       });
    } catch ( error ) {}
   };

main();