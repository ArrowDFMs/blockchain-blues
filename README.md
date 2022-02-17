# blockchain-blues
Repository for the Curing Your Blockchain Blues workshop. This includes a contract suite that interacts with an off-chain resource and includes upgradable contracts.

## Oracle Project

To get setup, cd into the Oracle directory and run
```bash
npm i
```
To run the listener circuit, first fire up a local network
```bash
npx hardhat node
```
Then, setup the listener
```bash
npx hardhat run ./scripts/deploy.ts --network localhost
```
Finally, test the off-chain communication circuit
```bash
npx hardhat test --network localhost
```
