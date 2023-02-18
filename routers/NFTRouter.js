const Router = require('express')
const router = new Router()
const NFTController = require('../controllers/NFTController')
const multer = require("multer")
const upload = multer({
    dest: "./uploads"
  });

router.post('/nft', upload.single('file'), NFTController.MakeNFT)




module.exports = router