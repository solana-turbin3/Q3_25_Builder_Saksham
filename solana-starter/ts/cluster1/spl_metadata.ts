import wallet from "../turbin3-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createMetadataAccountV3,
  CreateMetadataAccountV3InstructionAccounts,
  CreateMetadataAccountV3InstructionArgs,
  DataV2Args,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  signerIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Define our Mint address
const mint = publicKey("55QFHhwQ5zNSdj2JabBHPYyweYT97WWacPgDLQx24oxB");

// Create a UMI connection
const umi = createUmi(
  "https://solana-devnet.api.syndica.io/api-key/3nwfWkMbDcGpUrAFQYofpGgaKUK8LJAb3pZrvfmxm5UEZwsu7BYrkHytmK5BYttGtPh9cVw9EH665TstXvc6VoAMLdo8tpKsNVn"
);
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
  try {
    // Start here
    let accounts: CreateMetadataAccountV3InstructionAccounts = {
      mint: mint,
      mintAuthority: signer,
    };

    let data: DataV2Args = {
      name: "Tyrex Token",
      symbol: "$TYREX",
      uri: "https://res.cloudinary.com/dn2sw7rln/image/upload/fl_preserve_transparency/v1751574413/526887_tikvnu.jpg",
      sellerFeeBasisPoints: 10,
      creators: null,
      collection: null,
      uses: null,
    };

    let args: CreateMetadataAccountV3InstructionArgs = {
      data: data,
      isMutable: true,
      collectionDetails: null,
    };

    let tx = createMetadataAccountV3(umi, {
      ...accounts,
      ...args,
    });

    let result = await tx.sendAndConfirm(umi);
    console.log(`Transaction signature: ${bs58.encode(result.signature)}`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
