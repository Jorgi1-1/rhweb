import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const PayrollSchema = new mongoose.Schema({
  baseSalary: { type: Number, required: false },
  bonuses: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  payStubs: [{ 
    date: Date,
    amount: Number,
    details: String,
  }],
}, { _id: false });

const AttendanceLogSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  checkIn: { type: String }, // e.g., "08:30"
  checkOut: { type: String },
  hoursWorked: { type: Number },
}, { _id: false });

const ScheduleSchema = new mongoose.Schema({
  day: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
  startTime: { type: String }, // "09:00"
  endTime: { type: String },   // "17:00"
}, { _id: false });

const UserSchema = new mongoose.Schema(
  {
    // 🧍 Datos básicos
    name: { type: String, trim: true, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },

    // 👥 Rol en la empresa
    role: {
      type: String,
      enum: ["admin", "supervisor", "employee"],
      required: true,
    },

    // 📱 Datos comunes
    phone: { type: String, trim: true },
    age: { type: Number },

    // 👔 Datos laborales (sólo para supervisores y empleados)
    payrollInfo: PayrollSchema,
    attendanceLogs: [AttendanceLogSchema],
    schedule: [ScheduleSchema],
    
    // 📊 Solo para Admins/Directores
    isSystemAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// 🔐 Métodos de seguridad
UserSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", UserSchema);