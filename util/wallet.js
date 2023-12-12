const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
module.exports = {
  FaucetAccount: async (prefix) => {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
      process.env.MNEMONIC,
      { prefix }
    );
    const [firstAccount] = await wallet.getAccounts();
    return firstAccount;
  },
  FaucetWallet: async (prefix) => {
    return DirectSecp256k1HdWallet.fromMnemonic(process.env.MNEMONIC, {
      prefix,
    });
  },
};
