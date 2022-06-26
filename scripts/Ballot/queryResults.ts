import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as ballotJson from "../../artifacts/contracts/Ballot.sol/Ballot.json";
// eslint-disable-next-line node/no-missing-import
import { Ballot } from "../../typechain";

async function main() {
    
    // set correct testnet
    const provider = ethers.providers.getDefaultProvider("ropsten");

    // get address of deployed ballot contract
    if (process.argv.length < 3) throw new Error("Ballot address missing");
    const ballotAddress = process.argv[2];

    console.log(
        `Attaching ballot contract interface to address ${ballotAddress}`
    );

    // create ballot contract object using address and provider
    const ballotContract: Ballot = new Contract(
        ballotAddress,
        ballotJson.abi,
        provider
    ) as Ballot;

    // retrieve winner name and print to console
    const winner = await ballotContract.winnerName();
    console.log(`The winning proposal is ${winner}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
