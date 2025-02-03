const restaurantModel = require("../models/restaurantModel");
const userModel = require("../models/UserModel");

// Add or update a restaurant rating by user
const addOrUpdateRatingController = async (_req, _res) => {
    try {
        const userId = _req.body.userId;
        const restaurantId = _req.body.restaurantId;
        const rating = _req.body.rating;

        // Validation info
        if (!userId || !restaurantId || !rating) {
            return _res.status(400).send({
                success: false,
                message: "User ID, Restaurant ID, and Rating are required",
            });
        }

        if (rating < 1 || rating > 5) {
            return _res.status(400).send({
                success: false,
                message: "Rating must be between 1 and 5",
            });
        }

        // Find the user
        const user = await userModel.findById(userId);
        if (!user) {
            return _res.status(404).send({
                success: false,
                message: "User not found",
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

        // Check if the user has already rated this restaurant
        const existingRating = restaurant.ratings.find(
            (r) => r.userId.toString() === userId.toString()
        );

        if (existingRating) {
            existingRating.rating = rating;
            existingRating.updatedAt = new Date();
        } else {
            restaurant.ratings.push({ userId, rating });
        }

        // Update the restaurant rating count and average rating
        const totalRatings = restaurant.ratings.length;
        const averageRating =
            restaurant.ratings.reduce((sum, r) => sum + r.rating, 0) /
            totalRatings;

        restaurant.ratingCount = totalRatings;
        restaurant.rating = averageRating;

        await restaurant.save();

        _res.status(200).send({
            success: true,
            message: "Rating added/updated successfully",
            restaurant,
        });
    } catch (error) {
        console.log(error);
        _res.status(500).send({
            success: false,
            message: "Error adding/updating rating for restaurant",
            error,
        });
    }
};

module.exports = {
    addOrUpdateRatingController,
};
