
import { expect } from 'chai'
import { Signer } from 'ethers'
import {
    ethers,
    upgrades
} from 'hardhat'

describe('MyToken', function () {
    it('deploys', async () => {
        const MyTokenDelegateV1Factory = await ethers.getContractFactory('MyTokenDelegateV1')
        const tokenv1 = await MyTokenDelegateV1Factory.deploy()

        const totalSupply = ethers.BigNumber.from("100")
        const MyTokenProxyFactory = await ethers.getContractFactory('MyTokenProxy')
        const constructorV1Data = (await tokenv1.populateTransaction.constructor1(totalSupply)).data
        const token = await MyTokenProxyFactory.deploy(constructorV1Data, tokenv1.address)
        expect(token.address).is.not.equal(ethers.constants.AddressZero)
        const totalSupplyTx = await tokenv1.populateTransaction.ttotalSupply()
        await expect(() => tokenv1.populateTransaction.joe()).to.throw('tokenv1.populateTransaction.joe is not a function') // TypeError
        const tx = {
            ...totalSupplyTx
        }
        tx['to'] = token.address
        const [signer] = await ethers.getSigners()
        expect(await signer.call(tx)).to.equal(totalSupply)
    })
    it('upgrades', async () => {
        const MyTokenDelegateV1Factory = await ethers.getContractFactory('MyTokenDelegateV1')
        const MyTokenDelegateV2Factory = await ethers.getContractFactory('MyTokenDelegateV2')
        const MyTokenProxyFactory = await ethers.getContractFactory('MyTokenProxy')

        const tokenv1 = await MyTokenDelegateV1Factory.deploy()
        const tokenv2 = await MyTokenDelegateV2Factory.deploy()
        const joeCallTx = await tokenv2.populateTransaction.joe()

        const totalSupply = ethers.BigNumber.from("100")
        const constructorV1Data = (await tokenv1.populateTransaction.constructor1(totalSupply)).data

        const token = await MyTokenProxyFactory.deploy(constructorV1Data, tokenv1.address)
        const joeTx = {
            ...joeCallTx
        }
        joeTx['to'] = token.address
        const [signer] = await ethers.getSigners()
        await expect(signer.call(joeTx)).to.be.revertedWith("function selector was not recognized and there's no fallback function")

        await tokenv1.updateCode(tokenv2.address)

        console.log(await signer.call(joeTx))

        // const MyTokenV1 = await ethers.getContractFactory('MyTokenDelegateV1')
        // const MyTokenV2 = await ethers.getContractFactory('MyTokenDelegateV2')

        // const token = await upgrades.deployProxy(MyTokenV1, { kind: 'uups' })
        // await expect(() => token.joe()).to.throw('token.joe is not a function') // TypeError
        // const token2 = await upgrades.upgradeProxy(token.address, MyTokenV2)
        // expect(token2.address).to.equal(token.address)
        // expect(await token2.joe()).to.equal(ethers.BigNumber.from('100'))
    })
})