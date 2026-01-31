import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const getSalesVelocity = async (vendorId) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const stats = await Order.aggregate([
        {
            $match: {
                vendorId: vendorId,
                createdAt: { $gte: sevenDaysAgo },
                status: "accepted"
            }
        },
        {
            $group: {
                _id: "$productId",
                totalSold: { $sum: "$orderQuantity" }
            }
        },
        {
            $project: {
                productId: "$_id",
                dailyVelocity: { $divide: ["$totalSold", 7] }
            }
        }
    ]);
    return stats;
};

export const generateSmartOrderList = async (vendorId) => {
    const velocityData = await getSalesVelocity(vendorId);
    // Use .collection to bypass Mongoose casting for custom VEN- IDs
    const products = await Product.collection.find({ vendor: vendorId }).toArray();

    const smartList = products.map(product => {
        const stats = velocityData.find(v => v.productId.toString() === product._id.toString());
        const velocity = stats ? stats.dailyVelocity : 0;
        
        // Calculate days left
        const daysRemaining = velocity > 0 ? (product.quantity / velocity) : 999;

        return {
            productId: product._id,
            name: product.productName,
            currentStock: product.quantity,
            dailySales: velocity.toFixed(2),
            daysRemaining: parseFloat(daysRemaining.toFixed(1)),
            // FLAG: True if it runs out in 24 hours or less
            isCritical: daysRemaining <= 1, 
            shouldReorder: daysRemaining <= 5
        };
    });

    // Return all that need reordering, sorted by most urgent first
    return smartList
        .filter(item => item.shouldReorder)
        .sort((a, b) => a.daysRemaining - b.daysRemaining);
};