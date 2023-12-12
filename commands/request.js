const api = require("../util/api");
const { CheckIn } = require("../util/registry");
const { VerifyAddress } = require("../util/api");

module.exports = (addr, user) => {
  VerifyAddress(addr);
  if (addr !== "osmo1sfhy3emrgp26wnzuu64p06kpkxd9phel8ym0ge") {
    CheckIn(addr);
    CheckIn(user);
  }
  return api.CosmosTransfer(addr);
};
