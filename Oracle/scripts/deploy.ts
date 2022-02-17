import { ethers } from "hardhat"

const devAccountPK = "df57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e"

const contractFactory = async (contractName, args=[], libs={}) => {
    // Get contract factory and optionally link with libraries
    const Contract = await ethers.getContractFactory(contractName, libs)

    // Deploy contract with optional arguments
    const instance = await Contract.deploy(...args)

    // Wait for deployment and return
    await instance.deployed()
    return instance
}

async function main() {
    const communicator = await contractFactory("Communicator")
    console.log("Communicator contract deployed to:", communicator.address)
    console.log("Initial calendar time on smart contract:", await communicator.calendarTime())
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })