const { run } = require("hardhat")
require("@nomiclabs/hardhat-etherscan")

const verify = async (contractAddress, args) => {
    console.log("Verifying contract...")
    console.log(`contract address is:${contractAddress}`)
    console.log(args)
    // try {
    await run("verify:verify", {
        address: contractAddress,
        constructorArguments: args,
    })

    // await hre.run("verify:verify", {
    //     address: contractAddress,
    //     constructorArguments: args,
    // })
    // } catch (e) {
    //     if (e.message.toLowerCase().includes("already verified")) {
    //         console.log("Already verified!")
    //     } else {
    //         console.log(e)
    //     }
    // }
}

module.exports = { verify }
