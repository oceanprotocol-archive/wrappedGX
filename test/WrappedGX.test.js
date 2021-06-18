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

        describe('Basic functions', function(){
            it('Emits deposit event', async function(){
                const deposit = await this.WGX.deposit();
                assert.notEqual(deposit.tx, 0x0);
                assert.notEqual(deposit.tx, '');
                assert.notEqual(deposit.tx, null);
                assert.notEqual(deposit.tx, undefined);
            });
            it('Alice deposits 1 GX', async function(){
                const balanceBefore = await WGX.balanceOf(alice)
                await WGX.sendTransaction({ from: alice, value: 1 })
                const balanceAfter = await WGX.balanceOf(alice)
                balanceAfter.toString().should.equal(balanceBefore.add(new BN('1')).toString())
            });
            it('Alice withdraws 1 GX', async function(){
                const balanceBefore = await WGX.balanceOf(alice)
                await WGX.withdraw(1, { from: alice })
                const balanceAfter = await WGX.balanceOf(alice)
                balanceAfter.toString().should.equal(balanceBefore.sub(new BN('1')).toString())
              })
        })

        describe('Functions with a positive balance', async () => {
            beforeEach(async () => {
            await WGX.deposit({ from: alice, value: 10 })
            })
    
            it('Returns the WGX balance as total supply', async () => {
                const totalSupply = await WGX.totalSupply()
                totalSupply.toString().should.equal('10')
            })
            it('Alice withdraws WGX', async () => {
                const balanceBefore = await WGX.balanceOf(alice)
                await WGX.withdraw(1, { from: alice })
                const balanceAfter = await WGX.balanceOf(alice)
                balanceAfter.toString().should.equal(balanceBefore.sub(new BN('1')).toString())
              })
            it('Alice cannot withdraw beyond her balance', async () => {
                await expectRevert(WGX.withdraw(100, { from: alice }), 'revert')
            })
            it('Alice transfers WGX to Bob', async () => {
                const balanceBefore = await WGX.balanceOf(bob)
                await WGX.transfer(bob, 1, { from: alice })
                const balanceAfter = await WGX.balanceOf(bob)
                balanceAfter.toString().should.equal(balanceBefore.add(new BN('1')).toString())
              })
            it('Alice transfers WGX to address(0)', async () => {
                const balanceBefore = await WGX.balanceOf(alice)
                await WGX.transfer('0x0000000000000000000000000000000000000000', 1, { from: alice })
                const balanceAfter = await WGX.balanceOf(alice)
                balanceAfter.toString().should.equal(balanceBefore.sub(new BN('1')).toString())
            })   
            it('Alice transfers WGX to Bob using transferFrom', async () => {
                const balanceBefore = await WGX.balanceOf(bob)
                await WGX.transferFrom(alice, bob, 1, { from: alice })
                const balanceAfter = await WGX.balanceOf(bob)
                balanceAfter.toString().should.equal(balanceBefore.add(new BN('1')).toString())
              })
            it('Alice transfers WGX to address(0) using transferFrom', async () => {
                const balanceBefore = await WGX.balanceOf(alice)
                await WGX.transferFrom(alice, '0x0000000000000000000000000000000000000000', 1, { from: alice })
                const balanceAfter = await WGX.balanceOf(alice)
                balanceAfter.toString().should.equal(balanceBefore.sub(new BN('1')).toString())
            })  
            it('Alice and Bob cannot transfer beyond their balance', async () => {
                await expectRevert(WGX.transfer(bob, 100, { from: alice }), 'revert')
                await expectRevert(WGX.transferFrom(alice, bob, 100, { from: alice }), 'revert')
                await expectRevert(WGX.transfer(alice, 100, { from: bob }), 'revert')
                await expectRevert(WGX.transferFrom(bob, alice, 100, { from: bob }), 'revert')
              })
            it('Alice approves to increase Bobs allowance', async () => {
                const allowanceBefore = await WGX.allowance(alice, bob)
                await WGX.approve(bob, 1, { from: alice })
                const allowanceAfter = await WGX.allowance(alice, bob)
                allowanceAfter.toString().should.equal(allowanceBefore.add(new BN('1')).toString())
              })
        })

      describe('Functions with a positive allowance', async () => {
        beforeEach(async () => {
          await WGX.approve(bob, 1, { from: alice })
        })

        it('Bob transfers WGX to Alice using transferFrom and allowance', async () => {
            const balanceBefore = await WGX.balanceOf(bob)
            await WGX.transferFrom(alice, bob, 1, { from: bob })
            const balanceAfter = await WGX.balanceOf(bob)
            balanceAfter.toString().should.equal(balanceBefore.add(new BN('1')).toString())
          })

        it('Alice and Bob cannot transfer beyond allowance', async () => {
            await expectRevert(WGX.transferFrom(alice, bob, 2, { from: bob }), 'revert')
            await expectRevert(WGX.transferFrom(bob, alice, 2, { from: alice }), 'revert')
          })
        })
    })