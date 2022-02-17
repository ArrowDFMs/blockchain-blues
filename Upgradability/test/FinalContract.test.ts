
import { expect } from 'chai'
import {
    ethers,
    upgrades
} from 'hardhat'

describe('MyToken', function () {
    it('deploys', async () => {
        const MyTokenV1Factory = await ethers.getContractFactory('MyFinalContract')
        // await upgrades.deployProxy(MyTokenV1, { kind: 'uups' })
        const tokenv1 = await MyTokenV1Factory.deploy()
        expect(tokenv1.address).to.not.equal(ethers.constants.AddressZero)
    })
    it('upgrades', async () => {
        const MyTokenV1Factory = await ethers.getContractFactory('MyFinalContract')
        const MyTokenV2Factory = await ethers.getContractFactory('MyFinalContractV2')
        const MyTokenProxyFactory = await ethers.getContractFactory('Proxy')

        const tokenv1 = await MyTokenV1Factory.deploy()

        const constructorV1Data = (await tokenv1.populateTransaction.constructor1()).data
        const token = await MyTokenProxyFactory.deploy(constructorV1Data, tokenv1.address)
        expect(token.address).to.not.equal(ethers.constants.AddressZero)

        const tokenv2 = await MyTokenV2Factory.deploy()
        const constructorV2Tx = await tokenv2.populateTransaction.constructor1()
        constructorV2Tx['to'] = token.address
        const updateCodeTx = await tokenv1.populateTransaction.updateCode(tokenv2.address)
        updateCodeTx['to'] = token.address
        const joeTx = await tokenv2.populateTransaction.joe()
        joeTx['to'] = token.address

        const [signer] = await ethers.getSigners()
        await expect(signer.call(joeTx)).to.revertedWith("function selector was not recognized and there's no fallback function")
        await signer.sendTransaction(updateCodeTx)
        expect(await signer.call(joeTx)).to.equal(ethers.BigNumber.from("100"))
    })
})