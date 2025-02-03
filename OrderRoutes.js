const express = require('express');
const router = express.Router();
const {
  createOrderController,
  getUserOrdersController,
  updateOrderStatusController,
  getOrdersByRestaurantController,
} = require('../controllers/OrderController');

router.post('/create', createOrderController);

//  get all orders for a specific user
router.get('/user/:userId', getUserOrdersController);

router.put('/updateStatus/:orderId', updateOrderStatusController);
router.get('/getOrderByResto/:restaurantId',getOrdersByRestaurantController);

module.exports = router;
