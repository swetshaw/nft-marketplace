require('@nomiclabs/hardhat-waffle');
const fs = require('fs');
// const privateKey =
//   fs.readFileSync('.secret').toString().trim() || '01234567890123456789';
const infuraId = fs.readFileSync('.infuraid').toString().trim() || '';
const InfuraId = process.env.infuraId
const privateKey = process.env.secret

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${InfuraId}`,
      accounts: [privateKey],
    },
  },
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
