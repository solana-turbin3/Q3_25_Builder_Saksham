import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq";
import wallet from "./Turbin3-wallet.json";

const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
);

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment: "confirmed",
});

const program: Program<Turbin3Prereq> = new Program(IDL, provider);

const account_seeds = [Buffer.from("prereqs"), keypair.publicKey.toBuffer()];
const [account_key, _account_bump] = PublicKey.findProgramAddressSync(
  account_seeds,
  program.programId
);

const mintCollection = new PublicKey(
  "5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2"
);
const mintTs = Keypair.generate();

const authority_seeds = [Buffer.from("collection"), mintCollection.toBuffer()];
const [authority_key, _authority_bump] = PublicKey.findProgramAddressSync(
  authority_seeds,
  program.programId
);

// (async () => {
//   try {
//     const txhash = await program.methods
//       .initialize("tyrex1829")
//       .accountsPartial({
//         user: keypair.publicKey,
//         account: account_key,
//         system_program: SystemProgram.programId,
//       })
//       .signers([keypair])
//       .rpc();

//     console.log(
//       `Initialized! View TX: https://explorer.solana.com/tx/${txhash}?cluster=devnet`
//     );
//   } catch (e) {
//     console.error(`Initialization failed: ${e}`);
//   }
// })();

(async () => {
  try {
    const txhash = await program.methods
      .submitTs() // Changed back to submitTs (PascalCase) as per IDL
      .accountsPartial({
        user: keypair.publicKey,
        account: account_key,
        mint: mintTs.publicKey,
        collection: mintCollection,
        authority: authority_key, // Collection authority PDA derived from collection address
        mpl_core_program: MPL_CORE_PROGRAM_ID,
        system_program: SystemProgram.programId,
      })
      .signers([keypair, mintTs])
      .rpc();
    console.log(`Success lessgooo! Check out your TX here:
https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
