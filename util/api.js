const encoding = require("@cosmjs/encoding");
const axios = require("axios");
const { SigningStargateClient } = require("@cosmjs/stargate");
const { FaucetWallet, FaucetAccount } = require("./wallet");

module.exports = {
  VerifyAddress: (addr) => {
    try {
      const { prefix } = encoding.fromBech32(addr);
      if (prefix !== "osmo" && prefix !== "celestia") {
        throw Error(`${prefix} prefix is not supported`);
      }
    } catch (err) {
      throw Error(`[${err}] - Invalid address!`);
    }
  },
  CosmosGetBalance: (addr) => {
    return axios.get(
      `${process.env.API_ENDPOINT}/cosmos/bank/v1beta1/balances/${addr}/by_denom?denom=${process.env.DENOMINATION}`
    );
  },
  CosmosGetTxInfo: (txhash) => {
    return axios.get(
      `${process.env.API_ENDPOINT}/cosmos/tx/v1beta1/txs/${txhash}`
    );
  },
  CosmosGetNodeStatus: () => {
    return axios.get(`${process.env.OSMOSIS_RPC_ENDPOINT}/status`);
  },
  CosmosTransfer: async (addr) => {
    const { data } = encoding.fromBech32(addr);
    const osmosisAddr = encoding.toBech32("osmo", data);
    const celestiaAddr = encoding.toBech32("celestia", data);

    const osmosisFaucetWallet = await FaucetWallet("osmo");
    const osmosisFaucetAddr = (await FaucetAccount("osmo")).address;
    const celestiaFaucetWallet = await FaucetWallet("celestia");
    const celestiaFaucetAddr = (await FaucetAccount("celestia")).address;
    const osmosisClient = await SigningStargateClient.connectWithSigner(
      process.env.OSMOSIS_RPC_ENDPOINT,
      osmosisFaucetWallet,
      {
        prefix: "osmo",
      }
    );
    const celestiaClient = await SigningStargateClient.connectWithSigner(
      process.env.CELESTIA_RPC_ENDPOINT,
      celestiaFaucetWallet,
      {
        prefix: "celestia",
      }
    );
    const amount_tia = {
      denom: process.env.DENOMINATION,
      amount: process.env.AMOUNT,
    };
    const amount_osmo = {
      denom: "uosmo",
      amount: "1000000",
    };

    const result1 = await osmosisClient.sendTokens(
      osmosisFaucetAddr,
      osmosisAddr,
      [amount_tia, amount_osmo],
      {
        amount: [
          {
            denom: `${process.env.TX_FEE_DENOMINATION}`,
            amount: `${process.env.TX_FEE_AMOUNT}`,
          },
        ],
        gas: `${process.env.TX_GAS_AMOUNT}`, // 180k
      }
    );

    const result2 = await celestiaClient.sendTokens(
      celestiaFaucetAddr,
      celestiaAddr,
      [
        {
          denom: "utia",
          amount: "1000000",
        },
      ],
      {
        amount: [
          {
            denom: `utia`,
            amount: "35000",
          },
        ],
        gas: `${process.env.TX_GAS_AMOUNT}`, // 180k
      }
    );
    return [result1, result2];
  },
};
