const express = require("express")
//const mongoose = require("mongoose")
const cors = require('cors')
const { default: mongoose } = require("mongoose")
const StudentModel = require("./models/Student")

const app = express()
app.use(cors());
app.use(express.json());



mongoose.connect("mongodb://localhost:27017/studentDB")
.then(()=>(console.log("DB Connected Successfully")))
.catch((err)=>{console.error()})

//HALPER FUNCTION TO CALCULATE PERCENTAGE AND DIVISSION
function calculateResult(student) {
  // Convert inputs to numbers
  const english = Number(student.english);
  const marathi = Number(student.marathi);
  const math = Number(student.math);
  const physics = Number(student.physics);
  const computer = Number(student.computer);

  const total = english + marathi + math + physics + computer;
  const percentage = (total / 500) * 100;

  let division = "";
  if (percentage >= 80) {
    division = "First Division";
  } else if (percentage >= 60) {
    division = "Second Division";
  } else if (percentage >= 35) {
    division = "Third Division";
  } else {
    division = "Fail";
  }

  return { 
    percentage: percentage.toFixed(2), // limits to 2 decimal places
    division 
  };
}


//all routes here
//GET ALL STUDENTS

app.get('/students',async(req,res)=>{
    try{
        const student = await StudentModel.find();
        res.json(student);
    }catch{
        res.status(500).json({error: err.massage});
    }
});

//CREATE A NEW STUDENT

app.post("/students", async (req, res) => {
  try {
    const result = calculateResult(req.body);
    const newStudent = new StudentModel({ ...req.body, ...result });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Get single student by id
app.get("/students/:id", async (req, res) => {
  try {
    const student = await StudentModel.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update student
app.put("/students/:id", async (req, res) => {
  try {
    const result = calculateResult(req.body);
    const updatedStudent = await StudentModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, ...result },
      { new: true }
    );
    if (!updatedStudent) return res.status(404).json({ error: "Student not found" });
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete student
app.delete("/students/:id", async (req, res) => {
  try {
    const deletedStudent = await StudentModel.findByIdAndDelete(req.params.id);
    if (!deletedStudent) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});






app.listen(5000, function(){
    console.log("server is running on port 5000");
})