import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import {ethers} from "hardhat";
import {describe} from "mocha";
import assert from "assert";


describe("Saving ETH and ERC20 Token", function () {
    async function deployTheContracts() {
        let [owner] = await ethers.getSigners();

        const ERC = await ethers.getContractFactory("Class");
        const erc = await ERC.deploy();


        const SaveERC = await ethers.getContractFactory("SaveClass");

        const saveERC = await SaveERC.deploy(erc.getAddress());

        return {owner, erc, saveERC};
    }

    describe("Deployment", function () {
        it('should get the owner of the SaveEC contract', async () => {
            const {
                owner,
                erc,
                saveERC
            } = await loadFixture(deployTheContracts);
            expect(owner).to.equal(await saveERC.getOwner());
            expect(owner).to.equal(await erc.owner());
        });

        it('should assert that ERC 20 address is in the SaveERC', async () => {
            const {
                owner,
                erc,
                saveERC
            } = await loadFixture(deployTheContracts);
            expect(await erc.getAddress()).to.equal(await saveERC.getSavingToken());
        });
    });

    describe("Withdraw ERC TOKEN", () => {
        it("should withdraw successfully", async function () {
            const {owner, erc, saveERC} = await loadFixture(deployTheContracts);

            // Deposit some Ether initially
            const depositAmount = ethers.parseEther("1.0");
            await saveERC.depositETH({value: depositAmount});

            const balance = await saveERC.checkSavingsETH(owner.address);

            // Withdraw the entire balance
            await saveERC.withdrawETH();

            // Check updated savings balance
            const updatedSavings = await saveERC.checkSavingsETH(owner.address);
            expect(updatedSavings).to.equal(depositAmount - balance);
        });

        it("should revert for zero address", async function () {
            const {owner, erc, saveERC} = await loadFixture(deployTheContracts);

            try {
                // Attempt withdrawal from zero address
                const zeroAddress = "0x0000000000000000000000000000000000000000";
                const zeroSigner = await ethers.provider.getSigner(zeroAddress);
                await saveERC.connect(zeroSigner).withdrawETH();
                assert.fail('Expected function to revert, but it did not');
            } catch (error) {
                // @ts-ignore
                expect(error.message).to.include("unknown account 0x0000000000000000000000000000000000000000");
            }
        });

        it("should revert with no savings using fresh address", async function () {
            const {owner, erc, saveERC} = await loadFixture(deployTheContracts);

            // Generate a fresh random address
            const depositor = ethers.Wallet.createRandom();

            // Ensure depositor is configured as a signer (modify based on your testing environment)
            // For Hardhat example:
            const depositorSigner = await ethers.getSigner(depositor.address);

            // Attempt withdrawal from the fresh address
            try {
                saveERC.connect(depositorSigner).withdrawETH();
                //   assert.fail('Expected function to revert, but it did not');
            } catch (error) {
                // @ts-ignore
                expect(error.message).to.include("You do not have any savings");
            }
        });
    });

    describe("Deposit Ether", function () {
        it('initial balance before deposit should be zero', async () => {
            const {owner, erc, saveERC} = await loadFixture(deployTheContracts);

            // Check initial savings balance (assumes a `savings` function in the contract)
            const initialSavings = await saveERC.checkSavingsETH(owner.address);
            expect(initialSavings).to.equal(0, "Initial savings should be zero");
        });

        it('first deposit should be equals to balance', async () => {
            const {owner, erc, saveERC} = await loadFixture(deployTheContracts);

            // Deposit 1 Ether
            const depositAmount = ethers.parseEther("1.0");
            const depositTx = await saveERC.depositETH({value: depositAmount});
            await depositTx.wait(); // Wait for transaction confirmation

            // Check contract's savings balance
            const savingsBalance = await saveERC.checkSavingsETH(owner.address);
            expect(savingsBalance).to.equal(
                depositAmount,
                "Savings balance should match the deposited amount"
            );
        });

        it("should deposit Ether successfully", async function () {
            const {owner, erc, saveERC} = await loadFixture(deployTheContracts);

            // Check initial savings balance (assumes a `savings` function in the contract)
            const initialSavings = await saveERC.checkSavingsETH(owner.address);


            // Deposit 1 Ether
            const depositAmount = ethers.parseEther("1.0");
            const depositTx = await saveERC.depositETH({value: depositAmount});
            await depositTx.wait(); // Wait for transaction confirmation

            const contractBalance = await ethers.provider.getBalance(saveERC.getAddress());
            expect(contractBalance).to.equal(initialSavings + depositAmount);

        });

        it('should emit event after successful deposit', async () => {
            const {owner, erc, saveERC} = await loadFixture(deployTheContracts);

            // Deposit 1 Ether
            const depositAmount = ethers.parseEther("1.0");
            const depositTx = await saveERC.depositETH({value: depositAmount});
            await depositTx.wait();

            expect(await saveERC.depositETH({value: depositAmount}))
                .to.emit(saveERC, "SavingSuccessful")
                .withArgs(owner.address, depositAmount);
        });

        it('zero address cannot deposit', async () => {
            const {owner, erc, saveERC} = await loadFixture(deployTheContracts);

            //To generate a random address
            //   const depositor = ethers.Wallet.createRandom();

            // Obtain a signer for the zero address
            const zeroAddress = "0x0000000000000000000000000000000000000000";
            const zeroSigner = await ethers.provider.getSigner(zeroAddress);

            try {
                // Deposit 1 Ether from the zero address
                const depositAmount = ethers.parseEther("1.0");
                const depositTx = await saveERC.connect(zeroSigner).depositETH({value: depositAmount});
                expect(await depositTx.wait()).to.be.revertedWith("wrong EOA")
                await depositTx.wait(); // Wait for transaction confirmation
                //  assert.fail('Expected function to revert, but it did not');
            } catch (error) {
                // @ts-ignore
                expect(error.message).to.include("unknown account 0x0000000000000000000000000000000000000000");
            }
        });

        it('cannot deposit zero amount of ETH', async () => {
            const {owner, erc, saveERC} = await loadFixture(deployTheContracts);

            try {
                // Deposit 1 Ether
                const depositAmount = ethers.parseEther("0");
                const depositTx = await saveERC.depositETH({value: depositAmount});
                await depositTx.wait();
            } catch (error) {
                // @ts-ignore
                expect(error.message).to.include("Can't save zero value");
            }
        });

    });

    describe("Withdraw ETH", () => {
        it("should withdraw successfully", async function () {
            const {owner, saveERC} = await loadFixture(deployTheContracts);

            // Deposit some Ether initially
            const depositAmount = ethers.parseEther("1.0");
            await saveERC.depositETH({value: depositAmount});

            const balance = await saveERC.checkSavingsETH(owner.address);

            // Withdraw the entire balance
            await saveERC.withdrawETH();

            // Check updated savings balance
            const updatedSavings = await saveERC.checkSavingsETH(owner.address);
            expect(updatedSavings).to.equal(depositAmount - balance);
        });

        it("should revert for zero address", async function () {
            const {saveERC} = await loadFixture(deployTheContracts);

            try {
                // Attempt withdrawal from zero address
                const zeroAddress = "0x0000000000000000000000000000000000000000";
                const zeroSigner = await ethers.provider.getSigner(zeroAddress);
                await saveERC.connect(zeroSigner).withdrawETH();
                assert.fail('Expected function to revert, but it did not');
            } catch (error) {
                // @ts-ignore
                expect(error.message).to.include("unknown account 0x0000000000000000000000000000000000000000");
            }
        });

        it("should revert with no savings using fresh address", async function () {
            const {saveERC} = await loadFixture(deployTheContracts);

            // Generate a fresh random address
            const depositor = ethers.Wallet.createRandom();

            // Ensure depositor is configured as a signer (modify based on your testing environment)
            // For Hardhat example:
            const depositorSigner = await ethers.getSigner(depositor.address);

            // Attempt withdrawal from the fresh address
            try {
                saveERC.connect(depositorSigner).withdrawETH();
                //   assert.fail('Expected function to revert, but it did not');
            } catch (error) {
                // @ts-ignore
                expect(error.message).to.include("You do not have any savings");
            }
        });
    });
});



