const express = require("express");
const router = express.Router(); 
const {fetchBrandDetails,updateCategory,addCategory,addBrandDetails,fetchBrandDetailsById,deleteBrandDetailsById,updateBrandDetails,deleteCategory} = require("../Controllers/BrandDetailsController");
const upload = require('../Middleware/Multer');
const { adminLogin } = require("../Controllers/adminController");
const { addClientMessage,getClientMessages } = require("../Controllers/clientMessageCotroller");

const { addCoverPic,getAllCoverPics,getCoverPicById,deleteCoverPicById,updateCoverPicById } = require('../Controllers/coverPicController');


// post
router.post('/adminlogin', adminLogin);
router.post('/send-message', addClientMessage);

router.post(
    '/addBrandDetails',
    upload.fields([
        { name: 'categories', maxCount: 10 }, 
        { name: 'brandImages', maxCount: 10 },
        { name: 'brandLogo', maxCount: 1 },  
    ]),
    addBrandDetails
);
router.post('/add-cover-pic',addCoverPic);
router.post('/add-category/:brandId', upload.single('image'), addCategory);
// delete
router.delete('/delete-brand/:id', deleteBrandDetailsById);
router.delete('/delete-category/:brandId/:categoryId',deleteCategory);
router.delete('/delete-coverPic/:id',deleteCoverPicById);

//update
router.patch('/update-brand/:id', upload.fields([
    { name: 'categories', maxCount: 10 }, 
    { name: 'brandImages', maxCount: 10 }, 
    { name: 'brandLogo', maxCount: 1 },   
]),updateBrandDetails)
router.patch('/update-category/:brandId/:categoryId', upload.single('image'), updateCategory);
router.patch('/update-cover-pick/:id', updateCoverPicById);

// get
router.get('/get-brand-details', fetchBrandDetails);
router.get('/brand-details/:id', fetchBrandDetailsById);
router.get('/get-all-cover-pics', getAllCoverPics);
router.get('/get-cover-pic/:id', getCoverPicById);
router.get('/get-messages', getClientMessages);



module.exports = router;
