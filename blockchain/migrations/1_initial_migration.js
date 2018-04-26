var Migrations = artifacts.require("./Migrations.sol");
let Blocover = artifacts.require("./Blocover.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Blocover);
};
