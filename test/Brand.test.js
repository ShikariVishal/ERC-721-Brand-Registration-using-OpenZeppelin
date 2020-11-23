const ERC721Brands = artifacts.require("ERC721Brands");

const { assert } = require("chai");
var chai = require("chai");

var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

contract("ERC 721", async(accounts) => {
    const accountHolders = accounts;
    let contract;

    before(async() => {
        contract = await ERC721Brands.deployed();
    })

    it("deploys successfully", async() => {
        const address = await contract.address;
        assert.notEqual(address, '0x0');
        assert.notEqual(address, '');
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
    });

    it("has a name", async() => {
        const name = await contract.name();
        assert(name, 'Brand');
    });

    it("has a symbol", async() => {
        const symbol = await contract.symbol();
        assert(symbol, 'BRAND');
    });

    it("create a new token", async() => {
        const result = await contract.mint('Vishal');
        const totalSupply = await contract.totalSupply();
        const event = result.logs[0].args;

        // Success
        assert.equal(totalSupply, 1);
        assert.equal(event.tokenId.toNumber(), 1, 'id is correct');
        assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'From is correct');
        assert.equal(event.to, accountHolders[0], 'to is correct');

        // Failure : Cannot mint same brand twice
        expect(contract.mint('Vishal')).to.eventually.be.rejected;
    });

    it('lists colors', async() => {
        await contract.mint('Padma');
        await contract.mint('Shikari');
        const totalSupply = await contract.totalSupply();

        let Brand;
        let result = [];

        for(var i = 1; i <= totalSupply; i++) {
            Brand = await contract.brands(i-1);
            result.push(Brand);
        }

        let expected = ['Vishal', 'Padma', 'Shikari'];
        assert.equal(result.join(','), expected.join(','))

    })

});
