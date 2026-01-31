import Agent from "../models/Agent.js";
import Connection from "../models/Connection.js";
import Order from "../models/Order.js";
import Vendor from "../models/Vendor.js";
import { io, onlineUsers } from "../server.js";

export const createOrder = async (req, res) => {
  try {
    const { productId, agentID, orderQuantity } = req.body;
    const vendor = await Vendor.findById(req.vendor.vendorId);

    const agentPresentInConnections = await Connection.findOne({
      vendorID: vendor.vendorID,
      agentID,
    });

    if (!agentPresentInConnections) {
      return res
        .status(404)
        .json({ message: "Agent does not exists in your connections!" });
    }

    const orderExists = await Order.findOne({
      productId,
      vendorId: req.vendor.vendorId,
    });
    if (orderExists) {
      return res
        .status(409)
        .json({ message: "Pending order for this product already exists!" });
    }
    const vendorId = req.vendor.vendorId;
    const agent = await Agent.findOne({ agentID });
    const order = new Order({
      productId,
      orderQuantity,
      vendorId,
      agentID,
      agentName: agent.agentName,
      status: "pending",
    });
    let savedOrder = await order.save();

    savedOrder = await savedOrder.populate("productId", "productName");
    savedOrder = await savedOrder.populate("vendorId", "vendorName");

    const socketId = onlineUsers.get(`agent_${agent._id}`);

    if (socketId) {
      io.to(socketId).emit("newOrder", {
        message: "New order placed",
        data: savedOrder,
      });
    }

    return res
      .status(201)
      .json({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.log("Error in createOrder", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const viewVendorOrders = async (req, res) => {
  try {
    const vendorId = req.vendor.vendorId;
    const orders = await Order.find({ vendorId })
      .populate("productId", "productName")
      .populate("agentID", "agentName")
      .populate("vendorId", "vendorName");
    return res.status(200).json(orders);
  } catch (error) {
    console.log("Error in viewVendorOrders", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const viewAgentOrders = async (req, res) => {
  try {
    const agent = await Agent.findById(req.agent.agentId);
    const orders = await Order.find({ agentID: agent.agentID })
      .populate("productId", "productName")
      .populate("vendorId", "vendorName");
    // console.log(JSON.stringify(orders, null, 2));
    return res.status(200).json(orders);
  } catch (error) {
    console.log("Error in viewAgentOrders", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id, status } = req.params;
    const agent = await Agent.findById(req.agent.agentId);

    let order = await Order.findOneAndUpdate(
      { _id: id, agentID: agent.agentID },
      { status },
      { new: true }
    );
    
    if (!order) return res.status(400).json({ message: "Not allowed" });

    order = await order.populate("productId", "productName");
    order = await order.populate("vendorId", "vendorName");

    const vendor = await Vendor.findById(order.vendorId._id);
    const socketId = onlineUsers.get(`vendor_${vendor._id}`);

    if (socketId) {
      io.to(socketId).emit("orderStatus", {
        message: `Order ${status}`,
        data: order,
      });
    }

    const populated = await Order.findById(order._id)
      .populate("productId", "productName")
      .populate("vendorId", "vendorName");

    res.json(populated);
  } catch (error) {
    console.log("Error in updateOrderStatus", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const findOrderByProductId = async (req, res) => {
  try {
    const order = await Order.findOne({ productId: req.params.id });
    if (order) {
      return res
        .status(400)
        .json({ message: "Please cancel the order before deleting!" });
    }
    return res
      .status(200)
      .json({ message: "No order placed for that product!" });
  } catch (error) {
    console.log("Error in findOrderByProductId", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const agent = await Agent.findOne({ agentID: order.agentID });
    const socketId = onlineUsers.get(`agent_${agent._id}`);
    await Order.findByIdAndDelete(req.params.id);

    if (socketId) {
      io.to(socketId).emit("orderCancel", {
        message: "Order cancelled!",
        data: order,
      });
    }

    return res.status(200).json({ message: "Order deleted successfully!" });
  } catch (error) {
    console.log("Error in deleteOrder", error);
    res.status(500).json({ message: "Server error" });
  }
};
