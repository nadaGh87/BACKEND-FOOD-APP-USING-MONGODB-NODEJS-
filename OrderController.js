const orderModel = require('../models/OrderModel');
const restaurantModel = require('../models/restaurantModel');
const userModel = require('../models/UserModel');

const createOrderController = async (_req, _res) => {
  try {
    const { userId, restaurantId, items, deliveryAddress, phoneNumber } = _req.body;

    if (!userId || !restaurantId || !items || items.length === 0 || !deliveryAddress || !phoneNumber) {
      return _res.status(400).send({
        success: false,
        message: 'All fields are required (userId, restaurantId, items, deliveryAddress, phoneNumber)',
      });
    }

    // Calculate tot amount
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create  order
    const newOrder = new orderModel({
      userId,
      restaurantId,
      items,
      totalAmount,
      deliveryAddress,
      phoneNumber,
    });

    await newOrder.save();
    _res.status(201).send({
      success: true,
      message: 'Order created successfully',
      order: newOrder,
    });
  } catch (error) {
    console.log(error);
    _res.status(500).send({
      success: false,
      message: 'Error creating order',
      error,
    });
  }
};

// Get all orders for a user
const getUserOrdersController = async (_req, _res) => {
  try {
    const { userId } = _req.params;

    // findd an order by userId
    //In MongoDB, the populate method is used to perform a join between two collections.
    const orders = await orderModel.find({ userId }).populate('restaurantId', 'title').populate('userId', 'userName');

    if (!orders || orders.length === 0) {
      return _res.status(404).send({
        success: false,
        message: 'No orders found for this user',
      });
    }

    _res.status(200).send({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    _res.status(500).send({
      success: false,
      message: 'Error fetching orders',
      error,
    });
  }
};

// Update order status 
const updateOrderStatusController = async (_req, _res) => {
  try {
    const { orderId } = _req.params;
    const { orderStatus } = _req.body;

    if (!orderStatus || !['pending', 'processing', 'completed', 'cancelled'].includes(orderStatus)) {
      return _res.status(400).send({
        success: false,
        message: 'Invalid order status',
      });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return _res.status(404).send({
        success: false,
        message: 'Order not found',
      });
    }

    order.orderStatus = orderStatus;
    order.updatedAt = new Date();

    await order.save();

    _res.status(200).send({
      success: true,
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    console.log(error);
    _res.status(500).send({
      success: false,
      message: 'Error updating order status',
      error,
    });
  }
};


// Get all orders for a specific restaurant
const getOrdersByRestaurantController = async (_req, _res) => {
    try {
        const { restaurantId } = _req.params;

        // Validation
        if (!restaurantId) {
            return _res.status(400).send({
                success: false,
                message: "Restaurant ID is required",
            });
        }

        // Find the restaurant
        const restaurant = await restaurantModel.findById(restaurantId);
        if (!restaurant) {
            return _res.status(404).send({
                success: false,
                message: "Restaurant not found",
            });
        }

        // Find all orders for this restaurant
        const orders = await orderModel.find({ restaurantId }).populate("userId");

        if (orders.length === 0) {
            return _res.status(404).send({
                success: false,
                message: "No orders found for this restaurant",
            });
        }

        // Return  with user details
        const orderDetails = orders.map(order => ({
            orderId: order._id,
            user: {
                userName: order.userId.userName,
                email: order.userId.email,
                phone: order.userId.phone,
            },
            status: order.status,
            totalAmount: order.totalAmount,
            orderDate: order.createdAt,
        }));

        _res.status(200).send({
            success: true,
            message: "Orders fetched successfully",
            orders: orderDetails,
        });
    } catch (error) {
        console.log(error);
        _res.status(500).send({
            success: false,
            message: "Error fetching orders for restaurant",
            error,
        });
    }
};



module.exports = {
  createOrderController,
  getUserOrdersController,
  updateOrderStatusController,getOrdersByRestaurantController
};
