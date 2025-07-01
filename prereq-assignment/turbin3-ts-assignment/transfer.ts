import {
  Transaction,
  SystemProgram,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  PublicKey,
} from "@solana/web3.js";
import wallet = require("./dev-wallet.json");

const from = Keypair.fromSecretKey(new Uint8Array(wallet));

const to = new PublicKey("CSPoJGos3ueoi31tovEbTADcMceVgpGPmh4it2ts2GeA");

const connection = new Connection("https://api.devnet.solana.com");

(async () => {
  try {
    const balance = await connection.getBalance(from.publicKey);

    if (balance === 0) {
      console.log("Wallet is already empty.");
      return;
    }

    const testTransaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance,
      })
    );

    testTransaction.recentBlockhash = (
      await connection.getLatestBlockhash("confirmed")
    ).blockhash;

    testTransaction.feePayer = from.publicKey;

    const fee =
      (
        await connection.getFeeForMessage(
          testTransaction.compileMessage(),
          "confirmed"
        )
      ).value || 0;

    testTransaction.instructions.pop();

    if (balance - fee <= 0) {
      console.log("❌ Not enough balance to cover fee.");
      return;
    }

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance - fee,
      })
    );

    transaction.recentBlockhash = (
      await connection.getLatestBlockhash("confirmed")
    ).blockhash;

    transaction.feePayer = from.publicKey;

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      from,
    ]);

    console.log(`Success! Check out your TX here: 
  https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  } catch (error) {
    console.error(`Oops, something went wrong: ${error}`);
  }
})();
