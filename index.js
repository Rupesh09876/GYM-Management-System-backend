import express from "express"
import dotenv from "dotenv"


dotenv.config()

import { modelSync } from "./src/models/sync.model.js"
import router from "./src/routes/index.route.js"

const app = express()
const port = 3002

app.use(express.json()) // to parse json data



app.get("/", (req, res) => {
    return res.send("Server is live")
})

app.use("/api/v1", router)

// app.post("/hi", (req, res) => {
//     const { name, age } = req.body

//     console.log(name)

//     return res.status(200).json({
//         success: true,
//         data: {
//             name, age
//         }
//     }) 
// })

app.listen(port, async() => {
    console.log(`Server is listening at: http://localhost:${port}`)

    // await modelSync();
})
