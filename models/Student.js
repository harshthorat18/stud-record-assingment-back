const mongoose = require ("mongoose")

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  english: { type: Number, required: true, min: 0, max: 100 },
  marathi: { type: Number, required: true, min: 0, max: 100 },
  math: { type: Number, required: true, min: 0, max: 100 },
  physics: { type: Number, required: true, min: 0, max: 100 },
  computer: { type: Number, required: true, min: 0, max: 100 },
  percentage: { type: Number },
  division: { type: String }
}, { timestamps: true });

const StudentModel = mongoose.model("student", studentSchema);
module.exports=StudentModel;