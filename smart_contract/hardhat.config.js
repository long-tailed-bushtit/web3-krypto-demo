//https://eth-goerli.g.alchemy.com/v2/MW7VfbHfjCMPCrW-y4zL3DBeGuPKcBpK

require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/MW7VfbHfjCMPCrW-y4zL3DBeGuPKcBpK',
      accounts: ['52e95db54478bfab4743fbe8c32a4ae9994ab59aa68b8c8a8d86b5860b3aaf09']
    }
  }
}