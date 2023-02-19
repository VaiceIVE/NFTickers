"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var _a = require("@solana/web3.js"), Connection = _a.Connection, Keypair = _a.Keypair, LAMPORTS_PER_SOL = _a.LAMPORTS_PER_SOL;
//import { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile, toBigNumber } from "@metaplex-foundation/js";
var _b = require("@metaplex-foundation/js"), Metaplex = _b.Metaplex, keypairIdentity = _b.keypairIdentity, bundlrStorage = _b.bundlrStorage, toMetaplexFile = _b.toMetaplexFile, toBigNumber = _b.toBigNumber;
var fs = require("fs");
var secret = [226, 71, 202, 60, 188, 226, 108, 152, 37, 93, 239, 252, 169, 148, 169, 253, 118, 177, 130, 107, 138, 66, 102, 188, 41, 59, 228, 42, 4, 25, 209, 193, 200, 109, 105, 255, 218, 28, 114, 49, 68, 212, 49, 61, 229, 119, 247, 252, 188, 183, 138, 5, 81, 112, 228, 102, 144, 21, 74, 54, 36, 213, 209, 23];
function main(filename, imgname, description) {
    return __awaiter(this, void 0, void 0, function () {
        var QUICKNODE_RPC, SOLANA_CONNECTION, WALLET, METAPLEX, CONFIG, imgUri, metadataUri, nft;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Main! name", filename);
                    QUICKNODE_RPC = 'https://young-magical-rain.solana-devnet.discover.quiknode.pro/3c3d924ce6777997780c4837ce9f6006ab90db1b/';
                    SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);
                    WALLET = Keypair.fromSecretKey(new Uint8Array(secret));
                    METAPLEX = Metaplex.make(SOLANA_CONNECTION)
                        .use(keypairIdentity(WALLET))
                        .use(bundlrStorage({
                        address: 'https://devnet.bundlr.network',
                        providerUrl: QUICKNODE_RPC,
                        timeout: 60000
                    }));
                    CONFIG = {
                        uploadPath: 'uploads/',
                        imgFileName: filename,
                        imgType: 'image/png',
                        imgName: imgname,
                        description: description,
                        attributes: [
                            { trait_type: 'Speed', value: 'Quick' },
                            { trait_type: 'Type', value: 'Pixelated' },
                            { trait_type: 'Background', value: 'QuickNode Blue' }
                        ],
                        sellerFeeBasisPoints: 0,
                        symbol: "STIC",
                        creators: [
                            { address: WALLET.publicKey, share: 100 }
                        ]
                    };
                    console.log("Minting ".concat(CONFIG.imgName, " to an NFT in Wallet ").concat(WALLET.publicKey.toBase58(), "."));
                    return [4 /*yield*/, uploadImage(CONFIG.uploadPath, CONFIG.imgFileName, METAPLEX)];
                case 1:
                    imgUri = _a.sent();
                    return [4 /*yield*/, uploadMetadata(imgUri, CONFIG.imgType, CONFIG.imgName, CONFIG.description, METAPLEX, CONFIG.attributes)];
                case 2:
                    metadataUri = _a.sent();
                    return [4 /*yield*/, mintNft(metadataUri, CONFIG.imgName, CONFIG.sellerFeeBasisPoints, CONFIG.symbol, METAPLEX, CONFIG.creators)];
                case 3:
                    nft = _a.sent();
                    console.log(nft);
                    return [2 /*return*/, nft];
            }
        });
    });
}
function uploadImage(filePath, fileName, METAPLEX) {
    return __awaiter(this, void 0, void 0, function () {
        var imgBuffer, imgMetaplexFile, imgUri;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Step 1 - Uploading Image");
                    imgBuffer = fs.readFileSync(filePath + fileName);
                    imgMetaplexFile = toMetaplexFile(imgBuffer, fileName);
                    return [4 /*yield*/, METAPLEX.storage().upload(imgMetaplexFile)];
                case 1:
                    imgUri = _a.sent();
                    console.log("   Image URI:", imgUri);
                    return [2 /*return*/, imgUri];
            }
        });
    });
}
function uploadMetadata(imgUri, imgType, nftName, description, METAPLEX, attributes) {
    return __awaiter(this, void 0, void 0, function () {
        var uri;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Step 2 - Uploading Metadata");
                    return [4 /*yield*/, METAPLEX
                            .nfts()
                            .uploadMetadata({
                            name: nftName,
                            description: description,
                            image: imgUri,
                            attributes: attributes,
                            properties: {
                                files: [
                                    {
                                        type: imgType,
                                        uri: imgUri
                                    },
                                ]
                            }
                        })];
                case 1:
                    uri = (_a.sent()).uri;
                    console.log('   Metadata URI:', uri);
                    return [2 /*return*/, uri];
            }
        });
    });
}
function mintNft(metadataUri, name, sellerFee, symbol, METAPLEX, creators) {
    return __awaiter(this, void 0, void 0, function () {
        var nft;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Step 3 - Minting NFT");
                    return [4 /*yield*/, METAPLEX
                            .nfts()
                            .create({
                            uri: metadataUri,
                            name: name,
                            symbol: symbol,
                            isMutable: false,
                            maxSupply: toBigNumber(1)
                        }, { commitment: "finalized" })];
                case 1:
                    nft = (_a.sent()).nft;
                    console.log("   Success!\uD83C\uDF89");
                    console.log("   Minted NFT: https://explorer.solana.com/address/".concat(nft.address, "?cluster=devnet"));
                    return [2 /*return*/, nft.address];
            }
        });
    });
}
module.exports = main;
