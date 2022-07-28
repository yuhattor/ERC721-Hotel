const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('WithSample', async () => {
  const TWO_MINUTES = 120

  let sample,
      WithSample,
      contract,
      owner,
      buyer,
      addrs

  before(async () => {
    sample = (await ethers.provider.getBlock('latest')).timestamp + TWO_MINUTES
    WithSample = await ethers.getContractFactory('WithSampleExample')
  })

  beforeEach(async () => {
    contract = await WithSample.deploy(sample);
    [ owner, buyer, ...addrs ] = await ethers.getSigners()
  })

  describe('Deployment', () => {
    it('Should set the right owner', async () => {
      expect(await contract.owner()).to.equal(owner.address)
    })

    it('Should set the specified sale start', async () => {
      expect(await contract.sample()).to.equal(sample)
    })
  })

  describe('Sample', () => {
    it('Should expose the sample time', async () => {
      expect(await contract.sample()).to.equal(sample)
    })

    it('Should be able to change sale start before the sale has started', async () => {
      await contract.connect(owner).setSample(sample + TWO_MINUTES)
    })

    it('Should not be able to change sale start after the sale has started', async () => {
      await contract.connect(owner).setSample(sample - TWO_MINUTES)
      await expect(contract.connect(owner).setSample(sample + TWO_MINUTES))
        .to.be.revertedWith('Sale has already started')
    })

    it('Should not mint if sale hasn\'t started yet', async () => {
      await expect(contract.connect(buyer).mint())
        .to.be.revertedWith('Sale hasn\'t started yet')
    })

    it('Should allow mint if sale has started', async () => {
      await contract.connect(owner).setSample(sample - TWO_MINUTES)
      await expect(contract.connect(buyer).mint())
        .to.emit(contract, 'Transfer')
    })

    it('Should emit SampleChanged when the sale start changes', async () => {
      const time = sample + TWO_MINUTES
      await expect(contract.connect(owner).setSample(time))
        .to.emit(contract, 'SampleChanged')
        .withArgs(time)
    })
  })
})
