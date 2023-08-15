//import
//main function
//calling of main function
// async function deployFunc(hre) {
//     hre.getNamedAccounts()
//     hre.deployments
// }
//module.exports.default = deployFunc
//hre ==hardhat
// module.exports = async (hre) => {
//     //hre.getNamedAccounts,hre.deployments
//     const { getNamedAccounts, deployments } = hre
// }
//const {networkConfig}=require("../helper-hardhat-config") 等于下面这两行
// const helperConfig = require("../helper-hardhat-config")
// const networkConfig = helperConfig.networkConfig
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    log(`network name is:${network.name}`)
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")

        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
        log(ethUsdPriceFeedAddress)
    }

    log("------------------------------------------------------------")

    const args = [ethUsdPriceFeedAddress]
    log(args)
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // if (
    //     !developmentChains.includes(network.name) &&
    //     process.env.ETHERSCAN_API_KEY
    // ) {
    //     log("111111111111111111111111111111111111111111111111111111111")
    //     await verify(fundMe.address, args)
    // }

    log("---------------------------------------------------")
}

module.exports.tags = ["all", "fundme"]
