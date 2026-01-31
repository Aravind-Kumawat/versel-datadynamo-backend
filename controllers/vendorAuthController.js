import Vendor from "../models/Vendor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { vendorName, vendorShopName, vendorDOB, vendorEmail, vendorPassword, vendorPhoneNo, vendorAddress } = req.body;
    const vendorExists = await Vendor.findOne({ vendorEmail });
    if (vendorExists) {
      return res.status(400).json({message: "Email already exists!"});
    }

    const generateVendorID = () => {
      const date = new Date(vendorDOB);
      const yy = date.getFullYear().toString().slice(-2);
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");

      const random = Math.floor(100 + Math.random() * 900);

      return `VEN-${yy}${mm}${dd}-${random}`;
    };

    const vendorID = generateVendorID()

    const hashedPassword = await bcrypt.hash(vendorPassword, 10);
    const vendor = new Vendor({
      vendorName,
      vendorID,
      vendorShopName,
      vendorDOB,
      vendorEmail,
      vendorPassword: hashedPassword,
      vendorPhoneNo,
      vendorAddress,
    });

    const savedVendor = await vendor.save();
    return res
      .status(201)
      .json({ message: "Signup successful!", vendor: savedVendor });
  } catch (error) {
    console.log("Error in signup", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { vendorEmail, vendorPassword } = req.body;

    const vendor = await Vendor.findOne({ vendorEmail });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor does not exists!" });
    }
    const isMatch = await bcrypt.compare(vendorPassword, vendor.vendorPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ vendorId: vendor._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    return res.status(200).json({ message: "Login successful!", token, vendor });
  } catch (error) {
    console.log("Error in login", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
