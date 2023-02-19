const { Connection, Keypair, LAMPORTS_PER_SOL} = require("@solana/web3.js");
//import { Metaplex } from "@metaplex-foundation/js";
import {PublicKey} from "@solana/web3.js";
//import { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile, toBigNumber } from "@metaplex-foundation/js";
const { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile, toBigNumber } = require("@metaplex-foundation/js");
import * as fs from 'fs';

var secret = [226,71,202,60,188,226,108,152,37,93,239,252,169,148,169,253,118,177,130,107,138,66,102,188,41,59,228,42,4,25,209,193,200,109,105,255,218,28,114,49,68,212,49,61,229,119,247,252,188,183,138,5,81,112,228,102,144,21,74,54,36,213,209,23]


     async function main(filename:string, imgname:string, description: string) : Promise<any>{

        console.log("Main! name", filename)

        const QUICKNODE_RPC = 'https://young-magical-rain.solana-devnet.discover.quiknode.pro/3c3d924ce6777997780c4837ce9f6006ab90db1b/';
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
        symbol: symbol,
        isMutable: false,
        maxSupply: toBigNumber(1)}, 
        {commitment: "finalized"} );
    console.log(`   Success!🎉`);
    console.log(`   Minted NFT: https://explorer.solana.com/address/${nft.address}?cluster=devnet`);
    return nft.address;
}



    module.exports = main;