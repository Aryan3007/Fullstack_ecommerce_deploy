import slugify from "slugify";
import Catagory from "../models/catagory.model.js";

export const updateCatagoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const catagory = await Catagory.findByIdAndUpdate(
      id,
      { name, slug: slugify( name ) },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, message: "catagory updated successfully" }),
      catagory;

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error in updating catagory",
      error,
    });
  }
};
