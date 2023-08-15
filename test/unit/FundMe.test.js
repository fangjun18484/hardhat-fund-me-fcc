const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
describe("FundMe", async function () {
    console.log("-------------------")
    let funMe
    let deployer
    let mockV3AggregatorAddress
    //parseEther("1.0");
    //const sendValue = ethers.utils.parseEther("1.0") //1eth
    const sendValue = "1000000000000000000"

    //let wei = utils.parseEther("1000.0")

    beforeEach(async function () {
        //部署合约
        //返回hardhat.config.js中networks中的accounts部分，如是用的hardhat network 会返回包含10个虚拟账户的列表供你使用
        // const accounts = await ethers.getSigners()
        // const accountZero = accounts[0]
        //告诉ethers，我们想把哪个账户连接的FundMe
        deployer = (await getNamedAccounts()).deployer
        console.log(`deployer is : ${deployer}`)
        //fixture 函数部署合约 all代表部署deploy下所有的合约
        await deployments.fixture(["all"])

        //ethers.getContract 获得我们告诉他的任何合约的最新部署
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
        mockV3AggregatorAddress = await mockV3Aggregator.getAddress()
        // console.log(
        //     `mockmockV3Aggregator  address is:${mockV3AggregatorAddress}`
        // )
        // response = await funMe.addressToAmountFunded(deployer)
        // console.log(`1111addressToAmountFunded is :${response}`)
        // console.log(`2222sendValue is :${sendValue}`)
    })

    describe("constructor", async function () {
        //正确设置聚合器地址
        it("sets the aggregator address corrently", async function () {
            const response = await fundMe.priceFeed()
            console.log(`response address is :${response}`)
            assert.equal(response, mockV3AggregatorAddress)
        })
    })

    describe("fund", async function () {
        // it("fails if you don't send enough ETH", async function () {
        //     await expect(fundMe.fund()).to.be.revertedWith(
        //         "you need spend more ETH!"
        //     )
        // })

        it("updated the amount funded data structure", async function () {
            await fundMe.fund({ value: sendValue })
            console.log(`----------------------:${deployer}`)

            const response = await funMe.addressToAmountFunded.get(deployer)
            //assert.equal(response.toString(), sendValue.toString())
        })
    })
})

// !developmentChains.includes(network.name)
//     ? describe.skip
//     : describe("FundMe", function () {
//           let fundMe
//           let mockV3Aggregator
//           let deployer
//           //const sendValue = ethers.utils.parseEther("1")
//           //const sendValue = ethers.utils.parseEther("1")
//           beforeEach(async () => {
//               // const accounts = await ethers.getSigners()
//               // deployer = accounts[0]
//               deployer = (await getNamedAccounts()).deployer
//               await deployments.fixture(["all"])
//               fundMe = await ethers.getContract("FundMe", deployer)
//               mockV3Aggregator = await ethers.getContract(
//                   "MockV3Aggregator",
//                   deployer
//               )
//           })
//           console.log(mockV3Aggregator.getAddress())

//           describe("constructor", function () {
//               it("sets the aggregator addresses correctly", async () => {
//                   const response = await fundMe.getPriceFeed()
//                   console.log(response)
//                   assert.equal(response, mockV3Aggregator.getAddress())
//               })
//           })

//           describe("fund", function () {
//               // https://ethereum-waffle.readthedocs.io/en/latest/matchers.html
//               // could also do assert.fail
//               it("Fails if you don't send enough ETH", async () => {
//                   await expect(fundMe.fund()).to.be.revertedWith(
//                       "You need to spend more ETH!"
//                   )
//               })
//               // we could be even more precise here by making sure exactly $50 works
//               // but this is good enough for now
//               it("Updates the amount funded data structure", async () => {
//                   await fundMe.fund({ value: sendValue })
//                   const response = await fundMe.getAddressToAmountFunded(
//                       deployer
//                   )
//                   assert.equal(response.toString(), sendValue.toString())
//               })
//               it("Adds funder to array of funders", async () => {
//                   await fundMe.fund({ value: sendValue })
//                   const response = await fundMe.getFunder(0)
//                   assert.equal(response, deployer)
//               })
//           })
//           describe("withdraw", function () {
//               beforeEach(async () => {
//                   await fundMe.fund({ value: sendValue })
//               })
//               it("withdraws ETH from a single funder", async () => {
//                   // Arrange
//                   const startingFundMeBalance =
//                       await fundMe.provider.getBalance(fundMe.address)
//                   const startingDeployerBalance =
//                       await fundMe.provider.getBalance(deployer)

//                   // Act
//                   const transactionResponse = await fundMe.withdraw()
//                   const transactionReceipt = await transactionResponse.wait()
//                   const { gasUsed, effectiveGasPrice } = transactionReceipt
//                   const gasCost = gasUsed.mul(effectiveGasPrice)

//                   const endingFundMeBalance = await fundMe.provider.getBalance(
//                       fundMe.address
//                   )
//                   const endingDeployerBalance =
//                       await fundMe.provider.getBalance(deployer)

//                   // Assert
//                   // Maybe clean up to understand the testing
//                   assert.equal(endingFundMeBalance, 0)
//                   assert.equal(
//                       startingFundMeBalance
//                           .add(startingDeployerBalance)
//                           .toString(),
//                       endingDeployerBalance.add(gasCost).toString()
//                   )
//               })
//               // this test is overloaded. Ideally we'd split it into multiple tests
//               // but for simplicity we left it as one
//               it("is allows us to withdraw with multiple funders", async () => {
//                   // Arrange
//                   const accounts = await ethers.getSigners()
//                   for (i = 1; i < 6; i++) {
//                       const fundMeConnectedContract = await fundMe.connect(
//                           accounts[i]
//                       )
//                       await fundMeConnectedContract.fund({ value: sendValue })
//                   }
//                   const startingFundMeBalance =
//                       await fundMe.provider.getBalance(fundMe.address)
//                   const startingDeployerBalance =
//                       await fundMe.provider.getBalance(deployer)

//                   // Act
//                   const transactionResponse = await fundMe.cheaperWithdraw()
//                   // Let's comapre gas costs :)
//                   // const transactionResponse = await fundMe.withdraw()
//                   const transactionReceipt = await transactionResponse.wait()
//                   const { gasUsed, effectiveGasPrice } = transactionReceipt
//                   const withdrawGasCost = gasUsed.mul(effectiveGasPrice)
//                   console.log(`GasCost: ${withdrawGasCost}`)
//                   console.log(`GasUsed: ${gasUsed}`)
//                   console.log(`GasPrice: ${effectiveGasPrice}`)
//                   const endingFundMeBalance = await fundMe.provider.getBalance(
//                       fundMe.address
//                   )
//                   const endingDeployerBalance =
//                       await fundMe.provider.getBalance(deployer)
//                   // Assert
//                   assert.equal(
//                       startingFundMeBalance
//                           .add(startingDeployerBalance)
//                           .toString(),
//                       endingDeployerBalance.add(withdrawGasCost).toString()
//                   )
//                   // Make a getter for storage variables
//                   await expect(fundMe.getFunder(0)).to.be.reverted

//                   for (i = 1; i < 6; i++) {
//                       assert.equal(
//                           await fundMe.getAddressToAmountFunded(
//                               accounts[i].address
//                           ),
//                           0
//                       )
//                   }
//               })
//               it("Only allows the owner to withdraw", async function () {
//                   const accounts = await ethers.getSigners()
//                   const fundMeConnectedContract = await fundMe.connect(
//                       accounts[1]
//                   )
//                   await expect(
//                       fundMeConnectedContract.withdraw()
//                   ).to.be.revertedWith("FundMe__NotOwner")
//               })
//           })
//       })
