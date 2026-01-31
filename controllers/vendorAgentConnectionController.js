import Agent from "../models/Agent.js";
import Vendor from "../models/Vendor.js";
import Connection from "../models/Connection.js";

// Create connection request
export const createConnectionRequest = async (req, res) => {
  try {
    const vendorMongoId = req.vendor.vendorId; // from auth middleware
    const agentMongoId = req.params.agentID;   // param is actually agent's _id

    const vendor = await Vendor.findById(vendorMongoId);
    const agent = await Agent.findById(agentMongoId);

    if (!vendor || !agent) {
      return res.status(404).json({ message: "Vendor or Agent not found" });
    }

    const connectionExists = await Connection.findOne({
      agent: agent._id,
      vendor: vendor._id,
    });

    if (connectionExists) {
      return res.status(409).json({ message: "Connection already exists!" });
    }

    const connection = new Connection({
      vendor: vendor._id,
      agent: agent._id,
      vendorName: vendor.vendorName,
      vendorShopName: vendor.vendorShopName,
      agentName: agent.agentName,
      agencyName: agent.agencyName,
      connectionStatus: "pending",
    });

    const newConnection = await connection.save();

    return res.status(201).json({
      message: "Connection created successfully!",
      newConnection,
    });
  } catch (error) {
    console.log("Error in createConnectionRequest", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Accept connection request
export const acceptConnectionRequest = async (req, res) => {
  try {
    const agentMongoId = req.agent.agentId;
    const connectionId = req.params.connectionId;

    if (!connectionId) {
      return res.status(400).json({ message: "connectionID is required" });
    }

    const connection = await Connection.findById(connectionId);
    const agent = await Agent.findById(agentMongoId);

    if (!connection || !agent) {
      return res.status(404).json({ message: "Connection or Agent not found" });
    }

    if (String(connection.agent) !== String(agent._id)) {
      return res.status(403).json({ message: "Not authorized to accept this request" });
    }

    connection.connectionStatus = "accepted";
    const updatedConnection = await connection.save();

    return res.status(200).json({
      message: "Connection request accepted successfully!",
      updatedConnection,
    });
  } catch (error) {
    console.log("Error in acceptConnectionRequest", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Reject connection request
export const rejectConnectionRequest = async (req, res) => {
  try {
    const agentMongoId = req.agent.agentId;
    const connectionId = req.params.connectionId;

    const agent = await Agent.findById(agentMongoId);
    const connection = await Connection.findById(connectionId);

    if (!connection || !agent) {
      return res.status(404).json({ message: "Connection or Agent not found" });
    }

    if (String(connection.agent) !== String(agent._id)) {
      return res.status(403).json({ message: "Not authorized to reject this request" });
    }

    connection.connectionStatus = "rejected";
    const updatedConnection = await connection.save();

    return res.status(200).json({
      message: "Connection request rejected successfully!",
      updatedConnection,
    });
  } catch (error) {
    console.log("Error in rejectConnectionRequest", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// View connected agents (for vendor)
export const viewConnectedAgents = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor.vendorId);
    const agents = await Connection.find({ vendor: vendor._id, connectionStatus: "accepted" })
      .populate("agent");
    return res.status(200).json(agents);
  } catch (error) {
    console.log("Error in viewConnectedAgents", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// View connected vendors (for agent)
export const viewConnectedVendors = async (req, res) => {
  try {
    const agent = await Agent.findById(req.agent.agentId);
    const vendors = await Connection.find({ agent: agent._id, connectionStatus: "accepted" })
      .populate("vendor");
    return res.status(200).json(vendors);
  } catch (error) {
    console.log("Error in viewConnectedVendors", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Find agent by ID
export const findAgentByID = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: "No agent found with provided ID" });
    }
    return res.status(200).json(agent);
  } catch (error) {
    console.log("Error in findAgentByID", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// View connection requests (pending)
export const viewConnectionRequests = async (req, res) => {
  try {
    const agent = await Agent.findById(req.agent.agentId);
    const requests = await Connection.find({ agent: agent._id, connectionStatus: "pending" });
    return res.status(200).json(requests);
  } catch (error) {
    console.log("Error in viewConnectionRequests", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete connection
export const deleteConnection = async (req, res) => {
  try {
    const connection = await Connection.findByIdAndDelete(req.params.connectionId);
    if (!connection) {
      return res.status(404).json({ message: "Connection does not exist!" });
    }
    return res.status(200).json({ message: "Connection deleted successfully!" });
  } catch (error) {
    console.log("Error in deleteConnection", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
