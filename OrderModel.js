const mongoose = require('mongoose');

// Order schema
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant ID is required'],
  },
  items: [
    {
      name: String,
      quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: 1,
      },
      price: {
        type: Number,
        required: [true, 'Price is required'],
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending',
  },
  deliveryAddress: {
    type: String,
    required: [true, 'Delivery address is required'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
