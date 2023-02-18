const { Connection, Keypair} = require("@solana/web3.js");
//import { Metaplex } from "@metaplex-foundation/js";
import {PublicKey} from "@solana/web3.js";
//import { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile, toBigNumber } from "@metaplex-foundation/js";
const { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile, toBigNumber } = require("@metaplex-foundation/js");
import * as fs from 'fs';

var secret = [34,254,144,116,67,173,15,152,172,200,224,67,59,175,91,63,68,243,5,91,186,49,77,137,53,161,22,75,177,60,103,120,163,35,127,33,191,248,236,211,57,55,18,99,158,84,234,154,136,233,132,78,97,41,11,249,7,212,210,38,185,75,81,5]



     async function main(filename:string, imgname:string, description: string) : Promise<any>{

        console.log("Main! name", filename)

        const QUICKNODE_RPC = 'https://withered-clean-voice.solana-devnet.discover.quiknode.pro/3c362d98be083b209e4530d4878a65050b91bd36/';
        const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);
        const WALLET = Keypair.fromSecretKey(new Uint8Array(secret));
        const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
            .use(keypairIdentity(WALLET))
            .use(bundlrStorage({
                address: 'https://devnet.bundlr.network',
                providerUrl: QUICKNODE_RPC,
                timeout: 60000,
            }));

        const CONFIG = {
            uploadPath: 'uploads/',
            imgFileName: filename,
            imgType: 'image/png',
            imgName: imgname,
            description: description,
            attributes: [
                {trait_type: 'Speed', value: 'Quick'},
                {trait_type: 'Type', value: 'Pixelated'},
                {trait_type: 'Background', value: 'QuickNode Blue'}
            ],
            sellerFeeBasisPoints: 0,
            symbol: "STIC",
            creators: [
                {address: WALLET.publicKey, share: 100}
            ]
        };

        console.log(`Minting ${CONFIG.imgName} to an NFT in Wallet ${WALLET.publicKey.toBase58()}.`);

        const imgUri = await uploadImage(CONFIG.uploadPath, CONFIG.imgFileName, METAPLEX);

        const metadataUri = await uploadMetadata(imgUri, CONFIG.imgType, CONFIG.imgName, CONFIG.description, METAPLEX, CONFIG.attributes); 

        const nft = await mintNft(metadataUri, CONFIG.imgName, CONFIG.sellerFeeBasisPoints, CONFIG.symbol, METAPLEX, CONFIG.creators);

        console.log(nft);

        return nft;
    }
    


 async function uploadImage(filePath: string,fileName: string, METAPLEX:any): Promise<string>  {
    console.log(`Step 1 - Uploading Image`);
    const imgBuffer = fs.readFileSync(filePath+fileName);
    const imgMetaplexFile = toMetaplexFile(imgBuffer,fileName);
    const imgUri = await METAPLEX.storage().upload(imgMetaplexFile);
    console.log(`   Image URI:`,imgUri);
    return imgUri;
}

 async function uploadMetadata(imgUri: string, imgType: string, nftName: string, description: string, METAPLEX:any, attributes: {trait_type: string, value: string}[]) {
    console.log(`Step 2 - Uploading Metadata`);
    const { uri } = await METAPLEX
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
                    uri: imgUri,
                },
            ]
        }
    });
    console.log('   Metadata URI:',uri);
    return uri;  
}

async function mintNft(metadataUri: string, name: string, sellerFee: number, symbol: string, METAPLEX:any, creators: {address: PublicKey, share: number}[]) {
    console.log(`Step 3 - Minting NFT`);
    const { nft } = await METAPLEX
    .nfts()
    .create({
        uri: metadataUri,
        name: name,
        sellerFeeBasisPoints: sellerFee,
        symbol: symbol,
        creators: creators,
        isMutable: false,
        maxSupply: toBigNumber(1)}, 
        {commitment: "finalized"} );
    console.log(`   Success!🎉`);
    console.log(`   Minted NFT: https://explorer.solana.com/address/${nft.address}?cluster=devnet`);
    return nft.address;
}


    module.exports = main;