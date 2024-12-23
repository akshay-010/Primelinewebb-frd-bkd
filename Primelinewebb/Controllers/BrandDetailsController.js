const BrandDetails = require('../Model/brandDetailsModel'); // Adjust the path as needed


// Controller to add brand details with image upload
const addBrandDetails = async (req, res) => {
  try {
      const {
          name,
          tagline,
          missionStatement,
          coreValues,
          categoryCaption
      } = req.body;

      // Ensure categoryCaption is always an array
      const captionsArray = Array.isArray(categoryCaption) 
          ? categoryCaption 
          : [categoryCaption];

      const categories = req.files.categories
      ? req.files.categories.map((file, index) => ({
          image: `/uploads/${file.filename}`,
          caption: captionsArray[index] || '' // Use corresponding caption or empty string
      }))
      : [];

        // Process brandLogo file
    const brandLogo = req.files.brandLogo
    ? `/uploads/${req.files.brandLogo[0].filename}`
    : null;

  // Check if brandLogo is provided
  if (!brandLogo) {
    return res.status(400).json({
      message: 'Brand logo is required',
      success: false,
    });
  }


      const brandImages = req.files.brandImages
          ? req.files.brandImages.map(file => ({
                image: `/uploads/${file.filename}`,
            }))
          : [];

      // Create a new brand details document
      const newBrand = new BrandDetails({
          name,
          tagline,
          missionStatement,
          coreValues,
          brandLogo,
          categories: [...new Set(categories.map(JSON.stringify))].map(JSON.parse), // Remove duplicates
          brandImages,
      });

      // Save to the database
      const savedBrand = await newBrand.save();

      return res.status(201).json({
          message: 'Brand details added successfully',
          success: true,
          data: savedBrand,
      });
  } catch (error) {
      console.error('Error adding brand details:', error);
      return res.status(500).json({
          message: 'An error occurred while adding brand details',
          success: false,
          error: error.message,
      });
  }
};

const deleteCategory = async (req, res) => {
  const { brandId, categoryId } = req.params;

  try {
    // Find the brand by ID and remove the category with the matching ID
    const brand = await BrandDetails.findById(brandId);

    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    const categoryIndex = brand.categories.findIndex(
      (category) => category._id.toString() === categoryId
    );

    if (categoryIndex === -1) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Remove the category from the array
    brand.categories.splice(categoryIndex, 1);

    // Save the updated brand document
    await brand.save();

    res.status(200).json({ success: true, message: 'Category deleted successfully', brand });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
//Update brand

const updateBrandDetails = async (req, res) => {
  try {
    const { id } = req.params; // ID of the brand to edit
    const {
      name,
      tagline,
      missionStatement,
      coreValues,
    } = req.body;

    const updates = {};

    // Update fields if provided in the request body
    if (name) updates.name = name;
    if (tagline) updates.tagline = tagline;
    if (missionStatement) updates.missionStatement = missionStatement;
    if (coreValues) updates.coreValues = coreValues;

    // Process brandLogo file if provided
    if (req.files && req.files.brandLogo) {
      updates.brandLogo = `/uploads/${req.files.brandLogo[0].filename}`;
    }

    // Process brandImages if provided
    if (req.files && req.files.brandImages) {
      updates.brandImages = req.files.brandImages.map(file => ({
        image: `/uploads/${file.filename}`
      }));
    }

    // Find the brand by ID and update it
    const updatedBrand = await BrandDetails.findByIdAndUpdate(id, updates, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    });

    if (!updatedBrand) {
      return res.status(404).json({ message: 'Brand not found', success: false });
    }

    return res.status(200).json({
      message: 'Brand details updated successfully',
      success: true,
      data: updatedBrand
    });

  } catch (error) {
    console.error('Error editing brand details:', error);
    return res.status(500).json({
      message: 'An error occurred while editing brand details',
      success: false,
      error: error.message
    });
  }
};

const updateCategory = async (req, res) => {
  const { brandId, categoryId } = req.params;
  const { caption } = req.body;
  const image = req.file ? `/${req.file.path}` : null; // Prefix with '/' for relative URL

  try {
    // Find the brand by ID
    const brand = await BrandDetails.findById(brandId);

    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    const categoryIndex = brand.categories.findIndex(
      (category) => category._id.toString() === categoryId
    );

    if (categoryIndex === -1) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Update or delete the category based on request
    if (caption) {
      brand.categories[categoryIndex].caption = caption;
    }

    if (image) {
      brand.categories[categoryIndex].image = image;  // Update image with the new path
    }

    // Save the updated brand document
    await brand.save();

    res.status(200).json({ success: true, message: 'Category updated successfully', brand });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
const addCategory = async (req, res) => {
  const { brandId } = req.params;
  const { caption } = req.body;
  const image = req.file ? `/${req.file.path}` : null; // Prefix with '/' for relative URL

  try {
    // Find the brand by ID
    const brand = await BrandDetails.findById(brandId);

    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    // Create a new category object
    const newCategory = {
      caption: caption || '',
      image: image || null
    };

    // Add the new category to the brand's categories array
    brand.categories.push(newCategory);

    // Save the updated brand document
    await brand.save();

    res.status(201).json({ success: true, message: 'Category added successfully', brand });
  } catch (error) {
    console.error('Error adding new category:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Controller to fetch all brand details
const fetchBrandDetails = async (req, res) => {
  
  try {
      const brands = await BrandDetails.find(); // This should fetch your brand details from the database.

      return res.status(200).send(brands);
  } catch (error) {
      console.error('Error fetching brand details:', error);
      return res.status(500).json({
          message: 'An error occurred while fetching brand details',
          success: false,
          error: error.message,
      });
  }
};
// Controller to fetch brand details by ID
const fetchBrandDetailsById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ObjectId format
    if (!id) {
      return res.status(400).json({ message: "id is not available", success: false });
    }

    const brandDetails = await BrandDetails.findById(id); // Fetch brand details by ID

    if (!brandDetails) {
      return res.status(404).json({ message: "Brand details not found", success: false });
    }

    return res.status(200).json({ brandDetails, success: true });
  } catch (error) {
    console.error('Error fetching brand details by ID:', error);
    return res.status(500).json({ message: "An error occurred while fetching the brand details", success: false });
  }
};

// Controller to delete brand details by ID
const deleteBrandDetailsById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ObjectId format
    if (!id) {
      return res.status(400).json({ message: "ID is not provided", success: false });
    }

    // Find and delete the brand by ID
    const deletedBrand = await BrandDetails.findByIdAndDelete(id);

    if (!deletedBrand) {
      return res.status(404).json({ message: "Brand not found", success: false });
    }

    return res.status(200).json({ 
      message: "Brand deleted successfully", 
      success: true, 
      deletedBrand 
    });
  } catch (error) {
    console.error('Error deleting brand details:', error);
    return res.status(500).json({
      message: "An error occurred while deleting the brand details",
      success: false,
      error: error.message,
    });
  }
};


module.exports = {
    addBrandDetails,
    fetchBrandDetails,
    fetchBrandDetailsById,
    deleteBrandDetailsById,
    updateBrandDetails,
    deleteCategory,
    updateCategory,
    addCategory,
};
