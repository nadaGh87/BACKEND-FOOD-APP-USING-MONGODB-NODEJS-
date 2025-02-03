const restaurantModel = require("../models/restaurantModel");

//create restaurant 
const createRestaurantController=async(_req,_res)=>{
try {
  const {title,
    imageUrl,
    foods,
    time,
    pickup,
    delivery,
    isOpen,
    logoUrl,
    rating,
    ratingCount,
    code,
    coords}= _req.body; 
    //validation 
    if (!title|| !coords){
        return _res.status(500).send({
            success:false,
            message:'PROVIDE TITLE AND ADRESSE ',
            error, 
        }); 
    }
    const newRestaurant=new restaurantModel({title,
        imageUrl,
        foods,
        time,
        pickup,
        delivery,
        isOpen,
        logoUrl,
        rating,
        ratingCount,
        code,
        coords

    })
    await newRestaurant.save()
    _res.status(201).send({
        success:true,
        message:'NEW RESTAURANT CREATED SUCCESSFULLY',
    })

}catch(error){
    console.log(error)
    
    _res.status(500).send({
        success:false,
        message:'Eroor IN RESTAURANT API',
        error, 
})}}; 
//GET ALL RESTAURANT
const getAllRestaurantController= async (_req, _res) => {
    try{
    const resturant = await restaurantModel.find({})
    if(!resturant){
    return _res.status(404).send({
    success:false,
    message: "No Resturant Availible" 
})
}
    _res.status(200).send({
      succes:true,
      totalCount: resturant.length,
      resturant, 
    })


}catch (error){
    console.log(error)
    _res.status(500).send({
    success: false,
    message: "Error In Get ALL Resturat API",
    error    

})}}; 
//GET RESTAURANT BY ID 
const getRestaurantByIdController=async(_req,_res)=>{
    try{
    const restaurantId= _req.params.id 
    if (!restaurantId){
        return _res.status(404).send({ 
            success:false,
            message:'PLEASE PROVIDE RESTAURANT ID',
        })
    }
    
    //find a restaurant
    const restaurant= await restaurantModel.findById(restaurantId)
    if (!restaurant){
        return _res.status(404).send({
            success:false,
            message: 'NO RESTAURANT FOUND'
        })
    }
   _res.status(200).send({
    succes:true,
    restaurant,
   });
    }catch (error){
        console.log(error)
        _res.status(500).send({
            success:false, 
            message :'ERROR IN GET RESTAURANT'
        })
    }

}

//delete restaurant
const deleteRestaurantController=async(_req,_res)=>
{
try {
const restaurantId=_req.params.id
if(!restaurantId){
    return _res.status(404).send({
        success:false,
        message:'PLEASE PROVIDE A RESTAURANT ID '
    })
}
if(!restaurantId){
return _res.status(404).send({
    success:false,
    message:'NO RESTAURANT FOUND OR ID '
})
}
await restaurantModel.findByIdAndDelete(restaurantId)
_res.status(200).send({
    succes:true,
    message:'RESTAURANT DELETED WITH SUCCESS',
})
}catch(error){
    console.log(error)
    _res.status(500).send({
        success:false, 
        message :'ERROR IN DELETE RESTAURANT'
    })
}

}
const searchRestaurantController = async (_req, _res) => {
    try {
        const { query } = _req.body;

        if (!query) {
            return _res.status(400).send({
                success: false,
                message: "Search query is required",
            });
        }

        const restaurants = await restaurantModel.find({
            $or: [
                { title: { $regex: query, $options: "i" } }, 
                { code: { $regex: query, $options: "i" } },  
            ],
        });

        if (!restaurants || restaurants.length === 0) {
            return _res.status(404).send({
                success: false,
                message: "No restaurants found matching the search query",
            });
        }

        _res.status(200).send({
            success: true,
            message: "Restaurants retrieved successfully",
            restaurants,
        });
    } catch (error) {
        console.log(error);
        _res.status(500).send({
            success: false,
            message: "Error in Search Restaurant API",
            error,
        });
    }
};

    
module.exports={createRestaurantController,getAllRestaurantController,getRestaurantByIdController,deleteRestaurantController,searchRestaurantController}; 