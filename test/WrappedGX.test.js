const wrappedGX = artifacts.require("WrappedGX");
const { assert } = require('chai');
const { BN, expectRevert } = require('@openzeppelin/test-helpers')
const BigNumber = web3.BigNumber;

require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .should()

    contract('wrappedGX', accounts => {
        const [deployer, alice, bob, charlie] = accounts
        let WGX;
    
        before(async () => {
            // Fetch the smart contract before running tests
            WGX = await wrappedGX.deployed();
        })
    
        describe('deployment', async()=> { 
            it('Deploys successfully', async () => {
                const address = WGX.address;
                // Test the smart contract has been deployed with a valid address
                assert.notEqual(address, 0x0);
                assert.notEqual(address, '');
                assert.notEqual(address, null);
                assert.notEqual(address, undefined);
            })
        })
    
        beforeEach(async function() {
            this.WGX = await wrappedGX.new({ from: deployer })
        })
    
        describe('Token attributes', function(){
            it('Has the correct name', async function(){
                const name = await this.WGX.name();
                name.should.equal("Wrapped GX");
            });
            it('Has the correct symbol', async function(){
                const symbol = await this.WGX.symbol();
                symbol.should.equal("WGX");
            });
            it('Has the correct decimals', async function(){
                const decimals = (await this.WGX.decimals()).toNumber();
                decimals.should.be.bignumber.equal(18);
            });
            it('Accounts have the correct initial balance', async function(){
                const balanceDeployer = (await this.WGX.balanceOf(deployer)).toNumber();
                const balanceAlice = (await this.WGX.balanceOf(alice)).toNumber();
                const balanceBob = (await this.WGX.balanceOf(bob)).toNumber();
                const balanceCharlie = (await this.WGX.balanceOf(charlie)).toNumber();
                balanceDeployer.should.be.bignumber.equal(0);
                balanceAlice.should.be.bignumber.equal(0);
                balanceBob.should.be.bignumber.equal(0);
                balanceCharlie.should.be.bignumber.equal(0);
            });
            it('Has the correct initial total supply', async function(){
                const balance = (await this.WGX.totalSupply()).toNumber();
                balance.should.be.bignumber.equal(0);
            });
        })

        describe('Contract functions', function(){
            it('Emits deposit event', async function(){
                const deposit = await this.WGX.deposit();
                assert.notEqual(deposit.tx, 0x0);
                assert.notEqual(deposit.tx, '');
                assert.notEqual(deposit.tx, null);
                assert.notEqual(deposit.tx, undefined);
            });
            it('Alice deposits GX', async function(){
                const balanceBefore = await WGX.balanceOf(alice)
                await WGX.sendTransaction({ from: alice, value: 1 })
                const balanceAfter = await WGX.balanceOf(alice)
                balanceAfter.toString().should.equal(balanceBefore.add(new BN('1')).toString())
            });
        })
    })