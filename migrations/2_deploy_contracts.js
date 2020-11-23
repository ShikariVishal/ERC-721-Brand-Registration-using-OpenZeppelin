var ERC721Brands = artifacts.require("./ERC721Brands.sol");

module.exports = function(deployer) {
  deployer.deploy(ERC721Brands);
};