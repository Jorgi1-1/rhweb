import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import QRCode from "qrcode";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    group: { type: String, trim: true },
    role: { type: String, trim: true },
    age: { type: Number },
    phone: { type: String, trim: true },
    allergies: { type: String, trim: true },
    bloodType: { type: String, trim: true },
    shirtSize: { type: String, trim: true },
    admin: { type: Boolean, default: false }, // Agregar el campo admin como booleano
    emergencyContact: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
    },
    qrCode: { type: String }, // URL del código QR
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Hospedador asignado por el admin
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Genera el QR cuando se guarda un usuario
UserSchema.pre("save", async function (next) {
  if (!this.qrCode) {
    this.qrCode = await QRCode.toDataURL(this._id.toString()); // Guardar solo el ID del usuario
  }
  next();
});

export default mongoose.model("User", UserSchema);