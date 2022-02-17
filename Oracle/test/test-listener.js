const { waffle, ethers } = require("hardhat");

const devAccountPK = "df57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e"
const wallet = new ethers.Wallet(devAccountPK, waffle.provider)

function delay(n) {
    return new Promise(res => setTimeout(res, n * 1000))
}

describe("Oracle Circuit", () => {
    it("Fires Listener and Responds to Contract", async () => {
        const communicator = (await ethers.getContractFactory(
            "contracts/Communicator.sol:Communicator"
        )).attach("0x5FbDB2315678afecb367f032d93F642f64180aa3").connect(wallet) // Put contract address here
        console.log("Initial calendar time from smart contract:", await communicator.readableBlockTime())

        const n = 5
        await delay(n) // Wait n seconds then call function
        await communicator.emitSignal()
        await delay(n) // Wait n more seconds then check time
        console.log("Current calendar time from smart contract:", await communicator.readableBlockTime())
    })
  })