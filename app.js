require("dotenv").config();
require("express-async-errors"); //applies try catch block to all controller fn so we don't need to do it explicitly

//express
const express = require("express");
const app = express();

// rest of packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

//Database
const connectDB = require("./db/connect");

//routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoute");

//middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

// app.use(morgan("tiny")); //for logging request, tiny for tiny logs
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET)); // make access of cookies in req.cookies
//JWT_SECRET for signing cookies
app.use(express.static("./public")); //make public folder available
app.use(fileUpload());

// app.get("/", (req, res) => {
//   res.send("e-commerce-api");
// });
// app.get("/api/v1", (req, res) => {
//   console.log(req.signedCookies);
//   res.send("e-commerce-api");
// });


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware); //invoked last so that it is not invoked for any random routes that are not in our planned routes

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};
start();
