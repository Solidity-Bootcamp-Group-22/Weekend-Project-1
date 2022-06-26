import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as ballotJSON from "../../artifacts/contracts/Ballot.sol/Ballot.json";

import { Ballot } from "../../typechain";

const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

async function main() {
  // copy of wallet setup from deploy.ts
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || EXPOSED_KEY);
  console.log(`Using address ${wallet.address}`);

  const provider = ethers.providers.getDefaultProvider("ropsten");
  const signer = wallet.connect(provider);

  const balanceBigNumber = await signer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBigNumber));

  console.log(`Wallet balance at ${wallet.address} is ${balance}`);

  if (balance < 0.01) {
    throw new Error("The wallet provided does not have enough ether!");
  }

  const ballotAddress = process.argv[2];

  if (!ballotAddress) {
    throw new Error(
      "please provide a contract address you are attempting to query"
    );
  }

  console.log(
    `Attaching ballot contract interface to address given: ${ballotAddress}`
  );

  const ballotContract: Ballot = new Contract(
    ballotAddress,
    ballotJSON.abi,
    signer
  ) as Ballot;

  // log the # number of proposals
  console.log(`There are ${ballotContract.proposals.length} proposals`);

  // log the names of each
  for (let i = 0; i < ballotContract.proposals.length; i++) {
    console.log((await ballotContract.proposals(i)).name);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
