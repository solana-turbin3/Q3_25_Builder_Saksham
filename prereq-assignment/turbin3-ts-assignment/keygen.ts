import { Keypair } from "@solana/web3.js";
const bs58 = require("bs58").default;
const prompt = require("prompt-sync")();

let kp = Keypair.generate();

console.log(`You've generated a new Solana wallet: 
${kp.publicKey.toBase58()} `);

console.log(`[${kp.secretKey}]`);

function walletToBase58(secretArray: number[]) {
  const base58 = bs58.encode(Uint8Array.from(secretArray));
  console.log("\n Base58 Private Key (for Phantom):");
  console.log(base58);
}

function base58ToWallet() {
  const base58Input = prompt("\n🔁 Enter a base58 private key to decode: ");

  try {
    const decoded = bs58.decode(base58Input);
    console.log("\n Decoded Wallet Byte Array:");
    console.log(Array.from(decoded));
  } catch (err) {
    console.error("Invalid base58 input.");
  }
}

walletToBase58(Array.from(kp.secretKey));
base58ToWallet();
