import mongoose, { connect } from "mongoose";

const connectionSchema = new mongoose.Schema({
  vendorID: {
    type: String,
    required: true
  },
  vendorName: {
    type: String,
    required: true
  },
  vendorShopName: {
    type: String,
    required: true
  },
  agentID: {
    type: String,
    required: true
  },
  agentName: {
    type: String,
    required: true
  },
  agencyName: {
    type: String,
    required: true
  },
  connectionStatus: {
    type: String,
    required: true,
    default: "pending"
  }
},{timestamps:true});

const Connection = mongoose.model("Connection", connectionSchema);

export default Connection;