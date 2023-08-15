const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config")
const { network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments

    const { deployer } = await getNamedAccounts()

    const chainId = network.config.chainId
    console.log(`chainID is ${chainId}`)
    log(network.name)
    // if (developmentChains.includes(network.name)) {
    //     log("Local network detected! Deploying mocks...")
    //     await deploy("MockV3Aggregator", {
    //         contract: "MockV3Aggregator",
    //         log: true,
    //         args: [DECIMALS, INITIAL_ANSWER],
    //     })
    //     log("Mocks deployed!")
    //     log("-----------------------------------")
    // }
    if (developmentChains.includes(network.name)) {
        log("1231231231231231231232...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
        log("-----------------------------------")
    }
}
module.exports.tags = ["all", "mocks"]
