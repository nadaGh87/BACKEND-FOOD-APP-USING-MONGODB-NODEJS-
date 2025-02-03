 const testUserController=(_req,res) =>{
try{
    res.status(200).send
        
       (' <h1> Test User Data </h1>'
    );

}catch (error)
{
    console.log('error in test API',error)
}
 };





 module.exports={testUserController}
