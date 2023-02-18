const nft = require("./app")
const FormData = require('form-data')
const multer = require("multer")
const path = require("path");
const fs = require("fs");



const handleError = (err, res) => {
    res
      .status(500)
      .contentType("text/plain")
      .end("Oops! Something went wrong!");
  };

  

class NFTCreationController
{
       async MakeNFT(req, res)
       {
            console.log(req.body);
            const tempPath = req.file.path;
            const targetPath = path.join(__dirname, "../uploads", req.file.originalname);

            console.log(tempPath)
            console.log(targetPath)
            if (path.extname(req.file.originalname).toLowerCase() === ".png") {
            fs.rename(tempPath, targetPath, err => {
                if (err) return handleError(err, res)
            });
            } else {
            fs.unlink(tempPath, err => {
                if (err) return handleError(err, res);
        
                res
                .status(403)
                .contentType("text/plain")
                .end("Only .png files are allowed!");
            });
            }
                
            return res.json(await nft(req.file.originalname, req.body.imgname, req.body.desc));
       }
}



module.exports = new NFTCreationController();
