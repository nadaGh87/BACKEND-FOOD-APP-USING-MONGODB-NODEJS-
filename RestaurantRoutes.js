
const express=require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createRestaurantController, getAllRestaurantController, getRestaurantByIdController, deleteRestaurantController, searchRestaurantController } = require('../controllers/restaurantController');
const { addOrUpdateRatingController } = require('../controllers/AddUpdateRating');
const router =express.Router()
router.post('/create',authMiddleware,createRestaurantController)

router.get('/getAll',authMiddleware,getAllRestaurantController )
router.get('/get/:id',authMiddleware,getRestaurantByIdController)
delete restaurant

router.get('/delete/:id',authMiddleware,deleteRestaurantController)

router.post('/searchResto',authMiddleware,searchRestaurantController)
module.exports=router;
router.post('/Updaterating',authMiddleware,addOrUpdateRatingController)