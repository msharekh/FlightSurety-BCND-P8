var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "mixture fog alert teach south fiber fruit tag random flat negative expire";

module.exports = {
  networks: {
    development: {
      provider: function () {
        return new HDWalletProvider(mnemonic, "http://127.0.0.1:8545/", 0, 50);
      },
      network_id: '*'/* ,
      gas: 9999999 */
    }
  },
  compilers: {
    solc: {
      version: "^0.4.24"
    }
  }
};