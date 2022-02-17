
import { expect } from 'chai'
import { ethers } from 'hardhat'

describe('MyToken', function () {
    it('deploys', async () => {
        const ContractV1Factory = await ethers.getContractFactory('ContractV1')
        const v1 = await ContractV1Factory.deploy()
        expect(v1.address).to.not.equal(ethers.constants.AddressZero)
    })
    it('upgrades', async () => {
        const ContractV1Factory = await ethers.getContractFactory('ContractV1')
        const ContractV2Factory = await ethers.getContractFactory('ContractV2')
        const ProxyFactory = await ethers.getContractFactory('Proxy')

        const v1 = await ContractV1Factory.deploy()

        const constructorV1Data = (await v1.populateTransaction.constructor1()).data
        const proxy = await ProxyFactory.deploy(constructorV1Data, v1.address)
        expect(proxy.address).to.not.equal(ethers.constants.AddressZero)

        const v2 = await ContractV2Factory.deploy()
        const constructorV2Tx = await v2.populateTransaction.constructor1()
        constructorV2Tx['to'] = proxy.address
        const updateCodeTx = await v1.populateTransaction.updateCode(v2.address)
        updateCodeTx['to'] = proxy.address
        const joeTx = await v2.populateTransaction.joe()
        joeTx['to'] = proxy.address

        const [signer] = await ethers.getSigners()
        await expect(signer.call(joeTx)).to.revertedWith("function selector was not recognized and there's no fallback function")
        await signer.sendTransaction(updateCodeTx)
        expect(await signer.call(joeTx)).to.equal(ethers.BigNumber.from("100"))
    })
})