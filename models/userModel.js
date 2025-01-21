import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: ["true", "Name is required"],
    },
    email: {
      type: String,
      required: ["true", "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: ["true", "Password is required"],
      minLength: [6, "password length must be greater than 6 character"],
    },
    address: {
      type: String,
      required: ["true", "Address is required"],
    },
    city: {
      type: String,
      required: ["true", "City is required"],
    },
    country: {
      type: String,
      required: ["true", "Country is required"],
    },
    phone: {
      type: String,
      required: ["true", "Phone is required"],
    },
    profilePic: {
      public_id:{
        type:String,
      },
      url:{
        type:String,
      }
    },
    role:{
      type:String,
      default:"user"
    }
  },
  { timestamps: true }
);



// Hash function
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Fix: Add the '!' to check if password is NOT modified
  this.password = await bcrypt.hash(this.password, 10);
  next();
});



//comparing hash password with plain password during login
userSchema.methods.comparePassword= async function(plainPassword){
    return await bcrypt.compare(plainPassword,this.password);
};

//jwt token

userSchema.methods.generateToken= function(){
  return jwt.sign({_id:this._id},process.env.JWT_SECRET,{
    expiresIn:"7d",
  });
}


 const userModel= mongoose.model("Users",userSchema);
 export default userModel;

 