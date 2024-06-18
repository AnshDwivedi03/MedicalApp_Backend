import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/error.js";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import multer from "multer";


const app = express();
config({ path: "./config/config.env"});

app.use(
  cors({
    origin: [process.env.FRONTEND_URI, process.env.DASHBOARD_URI],
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);





const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/Uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })


//making routes for uploading files..
app.post("/api/v1/Uploads",upload.single("fileName"),(req,res)=>{
      console.log(req.body);
    res.send("uploaded")
})
/*
app.post('/',upload.single(),(req,res)=>{
      console.log(req.body);
      console.log(req.file);
      return res.redirect("/");
})
*/

dbConnection();

app.use(errorMiddleware);
export default app;
