import { Keypair, Connection, Commitment } from "@solana/web3.js";
import { createMint } from "@solana/spl-token";
import wallet from "../turbin3-wallet.json";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection(
  "https://solana-devnet.api.syndica.io/api-key/3nwfWkMbDcGpUrAFQYofpGgaKUK8LJAb3pZrvfmxm5UEZwsu7BYrkHytmK5BYttGtPh9cVw9EH665TstXvc6VoAMLdo8tpKsNVn",
  commitment
);

(async () => {
  try {
    // Start hereeeeeee
    const mint = await createMint(
      connection,
      keypair,
      keypair.publicKey,
      null,
      6
    );
    console.log(`successfully created a mint ${mint}`);
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();
