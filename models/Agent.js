
import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
    {
        agentName : {
            type : String,
            required : true
        },
        agentID: {
            type: String,
            required: true
        },
        agencyName : {
            type : String,
            required : true
        },
        agentDOB: {
            type: Date,
            required: true
        },
        agentEmail : {
            type : String,
            required : true,
            unique : true
        },
        agentPassword : {
            type : String,
            required : true
        },
        agentPhoneNo : {
            type : String,
            required : true
        },
        agentAddress : {
            type : String,
            required : true
        }
        
    }, {timestamps : true}
)

const Agent = mongoose.model("Agent",agentSchema);
export default Agent;