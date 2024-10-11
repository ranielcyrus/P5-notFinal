import express from 'express';
import mongoose from 'mongoose';
import { mongoURI, port } from './config/index.js';
import { Schema } from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import registerRoutes from './routes/registerRoutes.js'
import customerLoginRoute from './routes/customerLoginRoute.js'
import userManagementRoute from './routes/userManagementRoute.js'
import userLoginRoute from './routes/userLoginRoute.js'
import userProfileRoute from './routes/userProfileRoute.js'
import customerProfileRoute from './routes/customerProfileRoute.js'
import menuRoute from './routes/menuRoute.js'
import orderRoute from './routes/orderRoute.js'
import dashboardMenuRoute from './routes/dashboardMenuRoute.js'
import dashboardOrderRoute from './routes/dashboardOrderRoute.js'
import preMadeMenu from './routes/preMadeMenu.js'
import preMadeOrder from './routes/preMadeOrder.js'
import customerHistory from './routes/customerHistory.js'
import checkoutOrder from './routes/checkoutOrder.js'
import randomizer from './routes/randomizer.js'
import uploadImageRoute from './routes/uploadImageRoute.js'
import payMongoRoute from './routes/payMongoRoute.js'
import cookieParser from 'cookie-parser'


const app = express();

app.set('port', port);

app.use(express.json({limit:"5mb"})); //to parse req.body also sets limit image size
app.use(cookieParser()); //this is to parse cookies needed for token in jwt

mongoose.connect(mongoURI)
.then(() => {console.log("MongoDB Connected")})
.catch(err => console.error('mongoDB connection error')) 

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello World!',
  });
});

app.use(
  cors({
    origin: true, // This will allow all origins
    credentials: true, // This allows cookies and credentials to be sent
  })
)
app.use(helmet())
app.use("/api/register", registerRoutes)
app.use("/api/customer", customerLoginRoute)
app.use("/api/users", userManagementRoute)
app.use("/api/login/users", userLoginRoute)
app.use("/api/profile", userProfileRoute)
app.use("/api/customer/profile", customerProfileRoute)
app.use("/api/menu", menuRoute)
app.use("/api/order", orderRoute)
app.use("/api/user/dashboard/menu", dashboardMenuRoute)
app.use("/api/user/dashboard/order", dashboardOrderRoute)
app.use("/api/pre-made", preMadeMenu)
app.use("/api/pre-made/order", preMadeOrder)
app.use("/api/customer/history", customerHistory)
app.use("/api/randomizer", randomizer)
app.use("/api/checkout/", checkoutOrder)
app.use("/api/upload", uploadImageRoute)
app.use("/api/paymongo", payMongoRoute)


export default app