import mongoose from "mongoose";
import bcrypt from "bcryptjs"
const userSchema = new mongoose.Schema({
  fullname: { type: String, require: true, unique: true },
  contact: { type: String, require: false },
  email: { type: String, require: true, unique: true },
  password: { 
    type: String, 
    require: function(){
      return !googleId
    } 
  },
  role: { type: String, enum: ["buyer", "seller"], default: "buyer" },
  googleId:{ type: String , require: false}
});


userSchema.pre("save" ,async function(){
    if(!this.isModified("password")) return

    const hashPass = await bcrypt.hash(this.password , 7)
    this.password= hashPass
})


userSchema.methods.camparePassword = async function(password){
        return await bcrypt.compare(password, this.password)
}


const userModel = mongoose.model("user" , userSchema)

export default userModel