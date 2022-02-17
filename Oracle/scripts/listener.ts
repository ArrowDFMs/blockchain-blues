import { ethers } from 'ethers'

import { abi as CommunicatorABI } from '../artifacts/contracts/Communicator.sol/Communicator.json';

const devAccountPK = "df57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e"

const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545')
const wallet = new ethers.Wallet(devAccountPK, provider)

const communicatorAddress = ethers.utils.getAddress("0x5FbDB2315678afecb367f032d93F642f64180aa3") // Get after running deploy.ts
const communicator = new ethers.Contract(communicatorAddress, CommunicatorABI, wallet)

function paddedTime(timeString) {
    if (timeString.length == 1)
        return '0'+timeString
    return timeString
}

async function signalHandler() {
    console.log("\nEvent received...")
    const currentdate = new Date()
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
    communicator.on('Signal', signalHandler)
    const n = 3
    setTimeout(async () => await communicator.emitSignal(), n * 1000) // Wait n seconds then call function
    setTimeout(async () => console.log("Current calendar time from smart contract:", await communicator.calendarTime()), 2*n * 1000) // Wait 2n seconds then check time
}
main()