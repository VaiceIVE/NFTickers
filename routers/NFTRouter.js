const Router = require('express')
const router = new Router()
const NFTController = require('../controllers/NFTController')
const multer = require("multer")
const upload = multer({
    dest: "./uploads"
  });

router.post('/nft', upload.single('file'), NFTController.MakeNFT)
router.post('/send', upload.single('file'), NFTController.NFTTransaction)
router.post('/find', upload.single('file'), NFTController.FindNFTsName)





module.exports = router