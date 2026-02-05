import app from './app.js';
import ConnectDB from './src/dbConnection/DBconnection.js';

const port = process.env.PORT || 3000;


ConnectDB()
  .then(()=>{
    app.listen(port, ()=>{
      console.log(`server is running at port ${port}`);
      
    })
  })
  .catch(()=>{
    console.log("server is not running due to an error");
    
  })






