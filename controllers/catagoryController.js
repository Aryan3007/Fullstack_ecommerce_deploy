import slugify from "slugify"
import catagoryModel from "../models/catagory.model.js"

export const createCatagoryController=async(req, res)=>{
try {
    const {name}=req.body
    if (!name) {
        return res.status(400).json({
            message:"name is required"
        })
    }
    //checking existing catagory
    const existingCatagory=await catagoryModel.findOne({name})

    if (existingCatagory) {
        return res.status(200).json({
            message:"catagory already exist"
        })
    }

    const catagory = await new catagoryModel({name, slug:slugify(name)}).save()
    res.status(200).json({
        success:true,
        message:"new catagory created"
    })
    
} catch (error) {
    console.log(error)
    res.status(500).json({
        success:false,
        error,
        message:"errorin catagory"
    })
}
}

//geyt all catagory

export const catagoryController=async(req, res)=>{
    try {
        const catagory= await catagoryModel.find({})
        
        res.status(200).json({
            success:true,
            message:"all catagories list",
            catagory
        })
        

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"error while getting all catagories"
        })
    }
}

export const singleCatagoryController=async(req, res)=>{
            try {
                const catagory=await catagoryModel.findOne({slug:req.params.slug})
                res.status(200).json({
                    success:true,
                    message:"get single catagory successfully",
                    catagory
                })
                
            } catch (error) {
                console.log(error)
                res.status(404).json({
                    success:false,
                    message:'category not found'
                    })
            }
}

export const deleteCatagoryConntroller=async(req, res)=>{
    try {
        const {id} = req.params
        await catagoryModel.findByIdAndDelete(id)
        res.status(200).json({
            success:true,
            message:"catagory deleted successfully",
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            success:false,
            message:"cant delete the catagory",
            error
        })
    }
}