const nft = require("./app")
const path = require("path");
const fs = require("fs");
const { Connection, PublicKey, Keypair } =require ("@solana/web3.js");
const { web3 } = require("@project-serum/anchor");
const {
  Token,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} =  require("@solana/spl-token");
const { Metaplex, token, keypairIdentity, bundlrStorage} = require("@metaplex-foundation/js");

var secret = [226,71,202,60,188,226,108,152,37,93,239,252,169,148,169,253,118,177,130,107,138,66,102,188,41,59,228,42,4,25,209,193,200,109,105,255,218,28,114,49,68,212,49,61,229,119,247,252,188,183,138,5,81,112,228,102,144,21,74,54,36,213,209,23]



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

       /*async NFTTransacion(req, res)
        {
          console.log("Connecting...")
        let connection = new Connection("https://young-magical-rain.solana-devnet.discover.quiknode.pro/3c3d924ce6777997780c4837ce9f6006ab90db1b/");
      
          console.log("Parsing keys")

        const mintPublicKey = req.address;//Mint address found in the NFT metadata
        const ownerPublicKey = "EVPJk47NRGEhceFXoFSNuUSv5EoBHAh8V2y82xDkHeTG";
        const destPublicKey = req.destpub;
      

        console.log('Creating mint token')
        const mintToken = new Token(
          connection,
          mintPublicKey,
          TOKEN_PROGRAM_ID,
          ownerPublicKey
        );
      
        console.log('GET SOURCE ASSOCIATED ACCOUNT')
        
        const associatedSourceTokenAddr = await Token.getAssociatedTokenAddress(
          mintToken.associatedProgramId,
          mintToken.programId,
          mintPublicKey,
          ownerPublicKey
        );
        console.log('GET DESTINATION ASSOCIATED ACCOUNT')
        const associatedDestinationTokenAddr = await Token.getAssociatedTokenAddress(
          mintToken.associatedProgramId,
          mintToken.programId,
          mintPublicKey,
          destPublicKey
        );
      
        const receiverAccount = await connection.getAccountInfo(
          associatedDestinationTokenAddr
        );
      
        const instructions = [];
      
        if (receiverAccount === null) {
          console.log("receiver account is null!");
          instructions.push(
            Token.createAssociatedTokenAccountInstruction(
              mintToken.associatedProgramId,
              mintToken.programId,
              mintPublicKey,
              associatedDestinationTokenAddr,
              destPublicKey,
              ownerPublicKey
            )
          );
        }
      
        instructions.push(
          Token.createTransferInstruction(
            TOKEN_PROGRAM_ID,
            associatedSourceTokenAddr,
            associatedDestinationTokenAddr,
            ownerPublicKey,
            [],
            1
          )
        );
      
        // This transaction is sending the tokens
        let transaction = new web3.Transaction();
        for (let i = 0; i < instructions.length; i++) {
          transaction.add(instructions[i]);
        }
      
        if (transaction) {
          let response = await from.sendTransaction(transaction, connection);
      
          console.log("response: ", response);
        } else {
          console.log("Transaction error: transaction data is null");
        }
        return res.json("ok")
      };*/

     /* async NFTTransaction(req, res)
      {
        (async () => {
          // Connect to cluster
          console.log(web3.clusterApiUrl('devnet'))
          let connection = new Connection("https://young-magical-rain.solana-devnet.discover.quiknode.pro/3c3d924ce6777997780c4837ce9f6006ab90db1b/");

          // Uncomment the below command to test your connection to your node
          //console.log(await connection.getEpochInfo())

          // Generate a new random public key
          const from = "EVPJk47NRGEhceFXoFSNuUSv5EoBHAh8V2y82xDkHeTG";
          const airdropSignature = await connection.requestAirdrop(
            from,
            web3.LAMPORTS_PER_SOL,
          );
          await connection.confirmTransaction(airdropSignature);

          // Generate a new random public key
          const to = req.destpub;

          // Add transfer instruction to transaction
          const transaction = new web3.Transaction().add(
            web3.SystemProgram.transfer({
              fromPubkey: from,
              toPubkey: to,
              lamports: web3.LAMPORTS_PER_SOL / 100,
            }),
          );

          // Sign transaction, broadcast, and confirm
          const signature = await web3.sendAndConfirmTransaction(
            connection,
            transaction,
            [from],
          );
          console.log('SIGNATURE', signature);
        })();
              }*/
          async NFTTransaction(req, res)
          {
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
                console.log(req.body.address)
                console.log(req.body.destpub)

                const mint = new PublicKey(req.body.address)

                console.log(mint)

                const nft = await METAPLEX.nfts().findByMint({mintAddress: mint}, { commitment: "finalized" })

                console.log("Found NFT")

                
            const ans = await METAPLEX.nfts().transfer(
              {
                nftOrSft: nft,
                toOwner: new PublicKey(req.body.destpub),
                amount: token(1)
                
              },
              {commitment: "finalized"}
            )
            console.log("Sent!🎉 ")
            return res.json("ok")
          }

          async FindNFTsName(req, res)
          {
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

            console.log(req.body)
            const names = req.body.names
            
            var anses = Array()
            for (let index = 0; index < names.length; index++) {
                console.log(names[index])

                const mint = new PublicKey(names[index])

                const nft = await METAPLEX.nfts().findByMint({mintAddress: mint}, { commitment: "finalized" })

                anses.push(nft.address)

                console.log("Found NFT")
            }
            return res.json(anses)

          }
              
}



module.exports = new NFTCreationController();
