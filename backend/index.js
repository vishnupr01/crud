import express from 'express';
import  {config} from 'dotenv';
import cookieParser from 'cookie-parser'

config();
import cors from 'cors'
import userRoutes from './routes/userRoutes.js' 
import adminRoutes from './routes/adminRoutes.js'
import connect from './database/connect.js';
import { notFound,errorHandler } from './middleware/errorMiddleware.js';
import { Admin } from 'mongodb';

connect();

const app = express(); 
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET, POST, OPTIONS, PATCH, PUT,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors(corsOptions));
app.use(cookieParser())
app.use('/api/users',userRoutes)
app.use('/api/admin',adminRoutes)


app.use(notFound)
app.use(errorHandler)

const PORT =  process.env.PORT ||5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
  console.error(`Server error: ${err}`);
});
