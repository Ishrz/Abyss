import mongoose from "mongoose";
import bcrypt from "bcryptjs"
const userSchema = new mongoose.Schema({
  fullname: { type: String, require: true, unique: true },
  contact: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  role: { type: String, enum: ["buyer", "seller"], default: "buyer" },
});


userSchema.pre("save" ,async ()=>{
    if(!this.isModified("password")) return

    const hashPass = await bcrypt.hash(this.password , 7)
    this.password= hashPass
})


userSchema.methods.camparePassword = async (password)=>{
        return await bcrypt.compare(password, this.password)
}


const userModel = mongoose.model("user" , userSchema)

export default userModel