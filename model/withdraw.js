import { Schema, model, models } from "mongoose";

const withdrawalSchema = new Schema(
  {

    amount: { type: Number, required:true },
    
    accountName: { type: String, required:true },
    
    accountNumber: { type: String, required:true },
    
    bankName: { type: String, required:true },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    done: {
        type:Boolean,
        default:false
    
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Withdrawal = models.Withdrawal || model("Withdrawal", withdrawalSchema);
export default Withdrawal;
