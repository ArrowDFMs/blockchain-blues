const { ethers } = require("hardhat");

describe("Oracle Circuit", () => {

    it("Fires Listener and Responds to Contract", async () => {

        const [owner] = await ethers.getSigners()

        console.log(owner.address)

        const CommunicatorContract = await (await ethers.getContractFactory("Communicator")).deploy()
        const data = await CommunicatorContract.emitSignal()
        // await data.wait()
        console.log(data['data'])       

        // const (new Date).getTime()
        const updateTime = await CommunicatorContract.setTime("now")

        console.log( await CommunicatorContract.calendarTime() )

    })
  })