import express from 'express'
import {Request, Response} from 'express'
import cors from 'cors'
import { config } from "dotenv"
config()
const app = express()
const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.set("trust proxy", 1);

app.get('/', (req:Request, res:Response) => {
    res.send("Hello World")
})
app.listen(PORT, () => {
  console.log(`server running at port:${PORT}`)
})

