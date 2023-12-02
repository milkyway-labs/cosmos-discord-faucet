const api = require("../util/api");
const { CheckIn, VerifyAddress } = require("../util/registry");

module.exports = (addr, user) => {
  VerifyAddress(addr);
  CheckIn(addr);
  CheckIn(user);
  return api.CosmosTransfer(addr);
};
