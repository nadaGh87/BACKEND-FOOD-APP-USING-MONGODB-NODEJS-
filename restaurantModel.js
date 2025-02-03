const mongoose = require('mongoose');

// Schema
const restaurantSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'RESTAURANT TITLE IS REQUIRED'],
    },
    imageUrl: {
        type: String,
    },
    foods: {
        type: Array,
    },
    time: {
        type: String,
    },
    pickup: {
        type: Boolean,
        default: true,
    },
    delivery: {
        type: Boolean,
        default: true,
    },
    isOpen: {
        type: Boolean,
        default: true,
    },
    logoUrl: {
        type: String,
    },
    averageRating: {
        type: Number,
        default: 1,
        min: 1,
        max: 5,
    },
    ratingCount: {
        type: Number,
        default: 0,
    },
    code: {
        type: String,
    },
    coords: {
        id: { type: String },
        latitude: { type: Number },
        latitudeDelta: { type: Number },
        longitude: { type: Number },
        longitudeDelta: { type: Number },
        address: { type: String },
        title: { type: String },
    },
    ratings: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
            rating: { type: Number, min: 1, max: 5 },
            createdAt: { type: Date, default: Date.now },
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Restaurant", restaurantSchema);
