import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Agent from "../models/Agent.js";

export const signup = async (req, res) => {
  try {
    const {
      agentName,
      agencyName,
      agentEmail,
      agentDOB,
      agentPassword,
      agentPhoneNo,
      agentAddress,
    } = req.body;
    const agentExists = await Agent.findOne({ agentEmail });
    if (agentExists) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(agentPassword, 10);

    const generateAgentID = () => {
      const date = new Date(agentDOB);
      const yy = date.getFullYear().toString().slice(-2);
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");

      const random = Math.floor(100 + Math.random() * 900);

      return `AGT-${yy}${mm}${dd}-${random}`;
    };

    const agentID = generateAgentID();

    const agent = new Agent({
      agentName,
      agentID,
      agencyName,
      agentDOB,
      agentEmail,
      agentPassword: hashedPassword,
      agentPhoneNo,
      agentAddress,
    });

    const savedagent = await agent.save();
    return res
      .status(201)
      .json({ message: "Signup successful!", agent: savedagent });
  } catch (error) {
    console.log("Error in signup", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { agentEmail, agentPassword } = req.body;

    const agent = await Agent.findOne({ agentEmail });
    if (!agent) {
      return res.status(404).json({ message: "Agent does not exists!" });
    }
    const isMatch = await bcrypt.compare(agentPassword, agent.agentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ agentId: agent._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    return res.status(200).json({ message: "Login successful!", token, agent });
  } catch (error) {
    console.log("Error in login", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
