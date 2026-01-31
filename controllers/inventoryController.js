import { generateSmartOrderList } from "./analyticsService.js";

export const getRecommendedOrders = async (req, res) => {
  try {
    // Assuming you have auth middleware that attaches the user to req.user
    // If not, you can pass vendorId in the URL params for the hackathon
    const vendorId = req.params.vendorId || req.user.id; 

    if (!vendorId) {
      return res.status(400).json({ message: "Vendor ID is required" });
    }

    const recommendations = await generateSmartOrderList(vendorId);

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    console.error("Error generating smart list:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};