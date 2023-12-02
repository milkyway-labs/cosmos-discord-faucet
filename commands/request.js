const api = require("../util/api");
const { CheckIn } = require("../util/registry");
const { VerifyAddress } = require("../util/api");

module.exports = (addr, user) => {
  VerifyAddress(addr);
  CheckIn(addr);
  CheckIn(user);
  return api.CosmosTransfer(addr);
};
