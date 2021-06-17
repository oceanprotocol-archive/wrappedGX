const wrappedGX = artifacts.require("WrappedGX");
const { assert } = require('chai');

const BigNumber = web3.BigNumber;

require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .should()

    contract('wrappedGX', accounts => {
    
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
            this.WGX = await wrappedGX.new()
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
            it('Has the correct initial balance', async function(){
                const balance = (await this.WGX.balanceOf('0xCC97Ed04b5b8912694a9254205ad5b9316755fF0')).toNumber();
                balance.should.be.bignumber.equal(0);
            });
            it('Has the correct initial total supply', async function(){
                const balance = (await this.WGX.totalSupply()).toNumber();
                balance.should.be.bignumber.equal(0);
            });
            
        })
    })