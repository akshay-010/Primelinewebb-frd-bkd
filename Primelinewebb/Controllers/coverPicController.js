
const CoverPic = require('../Model/coverPicModel');

// Controller for adding a cover picture
const addCoverPic = async (req, res) => {
    try {
        const { heading, subheading } = req.body;
      
        // Create a new cover picture document
        const newCoverPic = new CoverPic({
            heading,
            subheading,
        });

        const savedCoverPic = await newCoverPic.save();

        // Send success response
        res.status(201).json({
            message: "Cover picture added successfully!",
            coverPic: savedCoverPic
        });
    } catch (error) {
        console.error("Error adding cover picture:", error);
        res.status(500).json({
            message: "An error occurred while adding the cover picture.",
            error: error.message
        });
    }
};
const getAllCoverPics = async (req, res) => {
  try {
    const coverPics = await CoverPic.find();
    return res.status(200).json({ coverPics, success: true });
  } catch (error) {
    console.error('Error fetching cover pictures:', error);
    return res.status(500).json({ message: "An error occurred while fetching cover pictures", success: false });
  }
};
const getCoverPicById = async (req, res) => {
  try {
      const { id } = req.params; // Extract ID from request parameters
      const coverPic = await CoverPic.findById(id);

      if (!coverPic) {
          return res.status(404).json({ message: "Cover picture not found", success: false });
      }

      return res.status(200).json({ coverPic, success: true });
  } catch (error) {
      console.error('Error fetching cover picture by ID:', error);
      return res.status(500).json({ message: "An error occurred while fetching the cover picture", success: false });
  }
};
const deleteCoverPicById = async (req, res) => {
  try {
      const { id } = req.params; // Extract ID from request parameters
      const deletedCoverPic = await CoverPic.findByIdAndDelete(id);

      if (!deletedCoverPic) {
          return res.status(404).json({ message: "Cover picture not found", success: false });
      }

      return res.status(200).json({ message: "Cover picture deleted successfully", success: true });
  } catch (error) {
      console.error('Error deleting cover picture:', error);
      return res.status(500).json({ message: "An error occurred while deleting the cover picture", success: false });
  }
};
const updateCoverPicById = async (req, res) => {
  try {
      const { id } = req.params; // Extract ID from request parameters
      const { heading, subheading } = req.body; // Extract new data from request body

      const updatedCoverPic = await CoverPic.findByIdAndUpdate(
          id,
          { heading, subheading },
          { new: true, runValidators: true } // Return the updated document and validate the inputs
      );

      if (!updatedCoverPic) {
          return res.status(404).json({ message: "Cover picture not found", success: false });
      }

      return res.status(200).json({ message: "Cover picture updated successfully", coverPic: updatedCoverPic, success: true });
  } catch (error) {
      console.error('Error updating cover picture:', error);
      return res.status(500).json({ message: "An error occurred while updating the cover picture", success: false });
  }
};

module.exports = {
  addCoverPic,
  getAllCoverPics,
  getCoverPicById,
  deleteCoverPicById,
  updateCoverPicById
};
