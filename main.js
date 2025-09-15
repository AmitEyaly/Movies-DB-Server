const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require("./configs/connectDB");
const session = require('express-session');
const filmRouter = require('./routes/filmsRouter');
const authRouter = require('./routes/authRouter');
const myfilmsRouter = require('./routes/myfilmsRouter');

connectDB();

//middlewares
app.use(express.json());
app.use(cors());
app.use(session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge: 1000*60*60*24 
    }
  }));

//routers
app.use('/Home', filmRouter);
app.use('/', authRouter);
app.use('/myfilms', myfilmsRouter);


const PORT = 3800;
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
})