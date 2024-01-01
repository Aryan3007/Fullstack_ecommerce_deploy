import express from "express"
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js"
import { catagoryController, createCatagoryController, deleteCatagoryConntroller, singleCatagoryController } from "../controllers/catagoryController.js"
import { updateCatagoryController } from "../controllers/updateCatagoryController.js"

const catagoryRouter=express.Router()


//routess***

//create catagory
catagoryRouter.post("/create-catagory", requireSignIn, isAdmin, createCatagoryController)

//update catagory
catagoryRouter.put("/update-catagory/:id", requireSignIn, isAdmin, updateCatagoryController)

//get all catagory
catagoryRouter.get('/get-catagory', catagoryController)

// get single catagory
catagoryRouter.get('/single-catagory/:slug', singleCatagoryController)

catagoryRouter.delete('/delete-catagory/:id', requireSignIn, isAdmin, deleteCatagoryConntroller)

export default catagoryRouter