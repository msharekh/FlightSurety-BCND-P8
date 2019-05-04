var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "mixture fog alert teach south fiber fruit tag random flat negative expire";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      gas: 6721975
    },
    developmentOld: {
      provider: function () {
        return new HDWalletProvider(mnemonic, "http://127.0.0.1:8545/", 0, 50);
      },
      network_id: "*",
      gas: 6721975
    }

    //   development: {
    //     provider: function () {
    //       return new HDWalletProvider(mnemonic, "http://127.0.0.1:8545/", 0, 50);
    //     },
    //     network_id: '*'/* ,
    //     gas: 9999999 */
    //   }
    // },
  },
  compilers: {
    solc: {
      version: "^0.4.24"
    }
  }
};