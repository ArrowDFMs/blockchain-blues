import { waffle, ethers } from "hardhat"

const devAccountPK = "df57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e"
const wallet = new ethers.Wallet(devAccountPK, waffle.provider)

let communicator

const contractFactory = async (contractName, args=[], libs={}) => {
    // Get contract factory and optionally link with libraries
    const Contract = await ethers.getContractFactory(contractName, libs)

    // Deploy contract with optional arguments
    const instance = await Contract.deploy(...args)

    // Wait for deployment and return
    await instance.deployed()
    return instance
}

function paddedTime(timeString) {
    if (timeString.length == 1)
        return '0'+timeString
    return timeString
}

async function signalHandler(timestamp) {
    const currentdate = new Date(timestamp.toNumber() * 1000)
    console.log("\nEvent received...")
    const datetime = paddedTime(currentdate.getDate().toString()) + "/"
                    + paddedTime((currentdate.getMonth()+1).toString())  + "/" 
                    + currentdate.getFullYear() + " "  
                    + paddedTime(currentdate.getHours().toString()) + ":"  
                    + paddedTime(currentdate.getMinutes().toString()) + ":" 
                    + paddedTime(currentdate.getSeconds().toString())

    await communicator.setTime(datetime)
    console.log("Callback function called...")
}

async function main() {
    communicator = await (await contractFactory("Communicator")).connect(wallet)
    console.log("Communicator contract deployed to:", communicator.address)

    console.log('\nServer is listening...')
    communicator.on('Signal', signalHandler)
}

main()
    // .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })