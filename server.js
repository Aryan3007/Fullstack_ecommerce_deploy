import express from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import connectDB from "./config/db.js"
import router from "./routes/authRoute.js"
import cors from "cors"
import catagoryRouter from "./routes/catagoryRoute.js"
import productRouter from "./routes/productRoute.js"
import path from "path"
dotenv.config()


//database config
connectDB()

//rest object
const app = express()

// middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname,'./client/dist')))



//routes
app.use('/api/v1/auth', router)
app.use('/api/v1/catagory', catagoryRouter)
app.use('/api/v1/products', productRouter)
//rest api
app.use('*', function(req, res){
    res.sendFile(path.join(__dirname,'./client/dist/index.html'))
})
app.listen(process.env.PORT, ()=>{
    console.log(`server is running on ${process.env.PORT}`)
})