import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    vendorName: {
      type: String,
      required: true,
    },
    vendorID: {
      type:String,
      
    },
    vendorShopName: {
      type: String,
      required: true,
    },
    vendorDOB: {
      type: Date,
      required: true
    },
    vendorEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    vendorPassword: {   
      type: String,
      required: true,
    },
    vendorPhoneNo: {
      type: String,
      required: true,
    },
    vendorAddress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor
