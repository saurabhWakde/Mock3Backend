const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const secretKey = '1234';
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());


mongoose.connect('mongodb+srv://saurabhwakde430:beX4GzwBzEJIMjGd@cluster0.hj7qqxp.mongodb.net/Empolyee', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () =>
 {
    console.log('Connected to MongoDB');
});

const User = mongoose.model('User',
 {
    email: String,
    password: String,
});

const Employee = mongoose.model('Employee',
 {
    firstName: String,
    lastName: String,
    email: String,
    department: String,
    salary: Number,
});

app.get('/',(req,res)=>
{
    res.send('Welcome to HomePage')
})
app.post('/signup',async (req,res) => 
{
    const { email, password }=req.body;


    const existingUser = await User.findOne({ email });
    if (existingUser) 
    {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
});


app.post('/login', async (req, res) => 
{
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
     {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
});



app.post('/employees', async (req, res) => 
{
    const { firstName, lastName, email, department, salary } = req.body;
    const newEmployee = new Employee({ firstName, lastName, email, department, salary });
    await newEmployee.save();
    res.status(201).json(newEmployee);
});


app.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err)
     {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.get('/employees/:id', async (req, res) => 
{
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) 
        {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (err) 
    {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.patch('/employees/:id', async (req, res) =>
 {
    try {
        const employeeId = req.params.id;

       
        if (!mongoose.Types.ObjectId.isValid(employeeId))
         {
            return res.status(400).json({ message: 'Invalid employee ID format' });
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, req.body, { new: true });
        if (!updatedEmployee) 
        {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(updatedEmployee);
    } catch (err)
     {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



app.delete('/employees/:id', async (req, res) => 
{
    try {
        const employeeId = req.params.id;

 
        if (!mongoose.Types.ObjectId.isValid(employeeId)) {
            return res.status(400).json({ message: 'Invalid employee ID format' });
        }

        const deletedEmployee = await Employee.findByIdAndRemove(employeeId);
        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(deletedEmployee);
    } catch (err) 
    {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.get('/employees/page/:pageNumber', async (req, res) => 
{
    const perPage = 5; 
    const pageNumber = req.params.pageNumber;

    try {
        const employees = await Employee.find()
            .skip(perPage * (pageNumber - 1))
            .limit(perPage)
            .exec();

        res.json(employees);
    } catch (err)
     {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.get('/employees/filter/:department', async (req, res) => {
    const department = req.params.department;

    try {
        const employees = await Employee.find({ department }).exec();

        if (employees.length === 0) {
            return res.status(404).json({ message: 'No employees found in the specified department' });
        }

        res.json(employees);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
