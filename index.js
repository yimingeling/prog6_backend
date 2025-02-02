import express from "express";
import mongoose from "mongoose";
import setups from './routes/setups.js';


const app = express();
mongoose.connect('mongodb://0.0.0.0:27017/setups');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use((req, res, next) => {
    // Check Accept header
    const acceptHeader = req.headers.accept;

    console.log(`Client accepteert: ${acceptHeader}`);

    if (acceptHeader === 'application/json') {
        console.log('app started')
        next()
    } else {
        res.status(400).send('Illegal format');
    }
})


app.get('/', (req, res) => {
    res.send('home')
});


// Middleware voor JSON-gegevens
app.use(express.json());

// Middleware voor www-urlencoded-gegevens
app.use(express.urlencoded({extended: true}));

app.use('/setups', setups)





app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is listening on port ${process.env.EXPRESS_PORT}`);
});

