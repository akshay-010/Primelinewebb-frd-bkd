const mongoose = require('mongoose');

// Sub-schema for Categories
const CategorySchema = new mongoose.Schema({
    image: { type: String, required: true },
    caption: { type: String, required: true }
});

// Sub-schema for Brand Images
const BrandImageSchema = new mongoose.Schema({
    image: { type: String, required: true }
});

// Main Brand Details Schema
const BrandDetailsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: false 
        },
        tagline: {
            type: String,
            required: true
        },
        missionStatement: {
            type: String,
            required: true
        },
        // coreValues now a single string, separated by commas
        coreValues: {
            type: String, 
            required: true
        },
        brandLogo: {
            type: String, // Single image path as a string
            required: true // Make this required if the logo is mandatory
        },
        categories: [CategorySchema], // Array of CategorySchema
        brandImages: [BrandImageSchema] // Array of BrandImageSchema
    },
    { timestamps: true }
);

// Create and export the model
const BrandDetails = mongoose.model('BrandDetails', BrandDetailsSchema);
module.exports = BrandDetails;
