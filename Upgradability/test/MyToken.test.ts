
import { expect } from 'chai'
import {
    ethers,
    upgrades
} from 'hardhat'

describe('MyToken', function () {
    it('deploys', async () => {
        const MyTokenV1 = await ethers.getContractFactory('TokenDelegateV1')
        await upgrades.deployProxy(MyTokenV1, { kind: 'uups' })
        // await MyTokenV1.deploy()
    })
    it('upgrades', async () => {
        const MyTokenV1 = await ethers.getContractFactory('TokenDelegateV1')
        const MyTokenV2 = await ethers.getContractFactory('TokenDelegateV2')

        const token = await upgrades.deployProxy(MyTokenV1, { kind: 'uups' })
        await expect(() => token.joe()).to.throw('token.joe is not a function') // TypeError
        const token2 = await upgrades.upgradeProxy(token.address, MyTokenV2)
        expect(token2.address).to.equal(token.address)
        expect(await token2.joe()).to.equal(ethers.BigNumber.from('100'))
    })
})