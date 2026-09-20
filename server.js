import dotenv from 'dotenv';
import express from 'express';
import { students } from './data.js';

const port = process.env.PORT || 4000;
dotenv.config();

const app = express();
app.use(express.json());

const logger = (req, res, next) => {
  console.log(req.method + req.url)
  next()
};

const checkAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization){
        return res.status(401).json({ 
            message: 'Unauthorized'
        });
    }
    next();
}

const validateStudent = (req, res, next) => {
    const {name, age, gender, department, level} = req.body;
    if (!name || !age || !gender || !department || !level) {
        return res.status(400).json({
            message: 'Missing required fields'
        });
    }
    next();
}


app.use(logger);


app.get("/", (req, res) =>{
    res.json({
        message: "List of users"
    });
});

app.get("/students", (req, res) => {
    res.status(200).json(students);
    });

app.get("/students", checkAuth, (req, res)=> {
    res.status(200).json(students);
})

app.post("/students", checkAuth, validateStudent, (req, res) => {
    const data = req.body
    console.log(data)
    res.status(201).json({
        message: "Successfully created",
        data:data
    });
    });


const testingMiddleware = (req, res, next) => {
    console.log('Test middleware executed');
    next();
}


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});