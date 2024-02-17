import {loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import {ethers} from "hardhat";
import {describe} from "mocha";


describe("Saving ERC20 Token", function () {
    async function deployTheContracts() {
        let [owner] = await ethers.getSigners();

        const ERC = await ethers.getContractFactory("Dean20");
        const erc = await ERC.deploy();


        const SaveERC = await ethers.getContractFactory("SaveERC20");

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
            expect(owner).to.equal(await erc.getOwner());
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

    describe("Deposit Ether", function () {
        it('initial balance before deposit should be zero', async () => {
            const {
                owner,
                erc,
                saveERC
            } = await loadFixture(deployTheContracts);

            // Check initial savings balance (assumes a `savings` function in the contract)
            const initialBalance = await erc.balanceOf(owner.address);
            expect(initialBalance).to.equal(1000000);
        });

        it('should deposit token successfully', async () => {
            const {
                owner,
                erc,
                saveERC
            } = await loadFixture(deployTheContracts);

            const initialBalance = await erc.balanceOf(owner.address);
            expect(initialBalance).to.equal(1000000);

            erc.connect(owner).approve(await saveERC.getAddress(), 20000);

            await saveERC.connect(owner).deposit(20000);
            const savingBal = await saveERC.checkUserBalance(owner.address)
            expect(savingBal).to.equal(20000);
            expect(await saveERC.checkContractBalance()).to.equal(savingBal);
        });

        it('should withdraw successfully', async () => {
             const {
                owner,
                erc,
                saveERC
            } = await loadFixture(deployTheContracts);

            const initialBalance = await erc.balanceOf(owner.address);
            expect(initialBalance).to.equal(1000000);

            erc.connect(owner).approve(await saveERC.getAddress(), 20000);

            await saveERC.connect(owner).deposit(20000);
            const savingBal = await saveERC.checkUserBalance(owner.address)
            expect(savingBal).to.equal(20000);
            expect(await saveERC.checkContractBalance()).to.equal(savingBal);

           // await saveERC.connect(owner).withdraw(10000);
            const newBal = await saveERC.checkUserBalance(owner.address);
            console.log(`New Balance: ${newBal}`);
            expect(newBal).to.equal(10000);
        });

        //
        //     it('first deposit should be equals to balance', async () => {
        //         const {owner, piggeth} = await loadFixture(deployPiggeth);
        //
        //         // Deposit 1 Ether
        //         const depositAmount = ethers.parseEther("1.0");
        //         const depositTx = await piggeth.deposit({value: depositAmount});
        //         await depositTx.wait(); // Wait for transaction confirmation
        //
        //         // Check contract's savings balance
        //         const savingsBalance = await piggeth.checkSavings(owner.address);
        //         expect(savingsBalance).to.equal(
        //             depositAmount,
        //             "Savings balance should match the deposited amount"
        //         );
        //     });
        //
        //     it("should deposit Ether successfully", async function () {
        //         const {owner, piggeth} = await loadFixture(deployPiggeth);
        //
        //         // Check initial savings balance (assumes a `savings` function in the contract)
        //         const initialSavings = await piggeth.checkSavings(owner.address);
        //
        //
        //         // Deposit 1 Ether
        //         const depositAmount = ethers.parseEther("1.0");
        //         const depositTx = await piggeth.deposit({value: depositAmount});
        //         await depositTx.wait(); // Wait for transaction confirmation
        //
        //         const contractBalance = await ethers.provider.getBalance(piggeth.getAddress());
        //         expect(contractBalance).to.equal(initialSavings + depositAmount);
        //
        //     });
        //
        //     it('should emit event after successful deposit', async () => {
        //         const {owner, piggeth} = await loadFixture(deployPiggeth);
        //
        //         // Deposit 1 Ether
        //         const depositAmount = ethers.parseEther("1.0");
        //         const depositTx = await piggeth.deposit({value: depositAmount});
        //         await depositTx.wait();
        //
        //         expect(await piggeth.deposit({value: depositAmount}))
        //             .to.emit(piggeth, "SavingSuccessful")
        //             .withArgs(owner.address, depositAmount);
        //     });
        //
        //     it('zero address cannot deposit', async () => {
        //         const {owner, piggeth} = await loadFixture(deployPiggeth);
        //
        //         //To generate a random address
        //         //   const depositor = ethers.Wallet.createRandom();
        //
        //         // Obtain a signer for the zero address
        //         const zeroAddress = "0x0000000000000000000000000000000000000000";
        //         const zeroSigner = await ethers.provider.getSigner(zeroAddress);
        //
        //         try {
        //             // Deposit 1 Ether from the zero address
        //             const depositAmount = ethers.parseEther("1.0");
        //             const depositTx = await piggeth.connect(zeroSigner).deposit({value: depositAmount});
        //             expect(await depositTx.wait()).to.be.revertedWith("wrong EOA")
        //             await depositTx.wait(); // Wait for transaction confirmation
        //             //  assert.fail('Expected function to revert, but it did not');
        //         } catch (error) {
        //             // @ts-ignore
        //             expect(error.message).to.include("unknown account 0x0000000000000000000000000000000000000000");
        //         }
        //     });
        //
        //     it('cannot deposit zero amount of ETH', async () => {
        //         const {piggeth} = await loadFixture(deployPiggeth);
        //
        //         try {
        //             // Deposit 1 Ether
        //             const depositAmount = ethers.parseEther("0");
        //             const depositTx = await piggeth.deposit({value: depositAmount});
        //             await depositTx.wait();
        //         } catch (error) {
        //             // @ts-ignore
        //             expect(error.message).to.include("Can't save zero value");
        //         }
        //     });
        //
        // });
        //
        // describe("Withdraw", () => {
        //     it("should withdraw successfully", async function () {
        //         const {owner, piggeth} = await loadFixture(deployPiggeth);
        //
        //         // Deposit some Ether initially
        //         const depositAmount = ethers.parseEther("1.0");
        //         await piggeth.deposit({value: depositAmount});
        //
        //         const balance = await piggeth.checkSavings(owner.address);
        //
        //         // Withdraw the entire balance
        //         await piggeth.withdraw();
        //
        //         // Check updated savings balance
        //         const updatedSavings = await piggeth.checkSavings(owner.address);
        //         expect(updatedSavings).to.equal(depositAmount - balance);
        //     });
        //
        //     it("should revert for zero address", async function () {
        //         const {piggeth} = await loadFixture(deployPiggeth);
        //
        //         try {
        //             // Attempt withdrawal from zero address
        //             const zeroAddress = "0x0000000000000000000000000000000000000000";
        //             const zeroSigner = await ethers.provider.getSigner(zeroAddress);
        //             await piggeth.connect(zeroSigner).withdraw();
        //             assert.fail('Expected function to revert, but it did not');
        //         } catch (error) {
        //             // @ts-ignore
        //             expect(error.message).to.include("unknown account 0x0000000000000000000000000000000000000000");
        //         }
        //     });
        //
        //     it("should revert with no savings using fresh address", async function () {
        //         const {piggeth} = await loadFixture(deployPiggeth);
        //
        //         // Generate a fresh random address
        //         const depositor = ethers.Wallet.createRandom();
        //
        //         // Ensure depositor is configured as a signer (modify based on your testing environment)
        //         // For Hardhat example:
        //         const depositorSigner = await ethers.getSigner(depositor.address);
        //
        //         // Attempt withdrawal from the fresh address
        //         try {
        //             piggeth.connect(depositorSigner).withdraw();
        //             //   assert.fail('Expected function to revert, but it did not');
        //         } catch (error) {
        //             // @ts-ignore
        //             expect(error.message).to.include("You do not have any savings");
        //         }
        //     });
        // });
        //
        // describe("Withdraw with amount", () => {
        //
        //     it("should withdraw successfully", async function () {
        //         const {owner, piggeth} = await loadFixture(deployPiggeth);
        //
        //         // Deposit some Ether initially
        //         const depositAmount = ethers.parseEther("2.0");
        //         await piggeth.deposit({value: depositAmount});
        //
        //         // Check initial savings balance
        //         const initialSavings = await piggeth.checkSavings(owner.address);
        //
        //         // Withdraw a valid amount (less than balance)
        //         const withdrawAmount = ethers.parseEther("1.0");
        //         await piggeth.withdraw1(withdrawAmount);
        //
        //         // Check updated savings balance
        //         const updatedSavings = await piggeth.checkSavings(owner.address);
        //         expect(updatedSavings).to.equal(initialSavings - withdrawAmount);
        //     });
        //
        //     it("should revert for withdrawing more than balance", async function () {
        //         const {owner, piggeth} = await loadFixture(deployPiggeth);
        //
        //         // Deposit some Ether initially
        //         const depositAmount = ethers.parseEther("1.0");
        //         await piggeth.deposit({value: depositAmount});
        //
        //         // Attempt to withdraw more than balance
        //         const withdrawAmount = ethers.parseEther("2.0");
        //         try {
        //             await piggeth.withdraw1(withdrawAmount);
        //             assert.fail('Expected function to revert, but it did not');
        //         } catch (e) {
        //             // @ts-ignore
        //             expect(e.message).to.include("Withdraw cannot be more than balance");
        //         }
        //     });
        // });
        //
        // describe("Send Out ETH", function () {
        //     it("should send funds successfully", async function () {
        //         const {owner, piggeth} = await loadFixture(deployPiggeth);
        //         const receiver = ethers.Wallet.createRandom();
        //
        //         // Deposit initial savings
        //         //   const depositAmount = ethers.parseEther("2.0");
        //         await piggeth.deposit({value: ethers.parseEther("2.0")});
        //
        //         //First deposit
        //         const firstBal = await piggeth.checkSavings(owner.address);
        //         // Send funds to receiver
        //         const sendAmount = ethers.parseEther("1.0");
        //         await piggeth.sendOutSaving(receiver.address, sendAmount);
        //
        //         // Verify sender's savings
        //         const senderBalance = await piggeth.checkSavings(owner.address);
        //         expect(senderBalance).to.equal(firstBal - sendAmount);
        //     });
        //
        //     it("should revert for zero address sender", async function () {
        //         const {piggeth} = await loadFixture(deployPiggeth);
        //         const receiver = ethers.Wallet.createRandom();
        //
        //         try {
        //             // Attempt withdrawal from zero address
        //             const zeroAddress = "0x0000000000000000000000000000000000000000";
        //             const zeroSigner = await ethers.provider.getSigner(zeroAddress);
        //
        //             await piggeth.connect(zeroSigner).sendOutSaving(receiver.address, ethers.parseEther("1.0"));
        //             assert.fail('Expected function to revert, but it did not');
        //         } catch (error) {
        //             // @ts-ignore
        //             expect(error.message).to.include("unknown account 0x0000000000000000000000000000000000000000");
        //         }
        //     });
        //
        //     it("should revert for zero amount", async function () {
        //         const {owner, piggeth} = await loadFixture(deployPiggeth);
        //         const receiver = ethers.Wallet.createRandom();
        //
        //         await piggeth.deposit({value: ethers.parseEther("2.0")});
        //
        //         try {
        //             await piggeth.sendOutSaving(receiver.address, ethers.parseEther("0"));
        //             assert.fail('Expected function to revert, but it did not');
        //         } catch (error) {
        //             // @ts-ignore
        //             expect(error.message).to.include("cannot send zero value");
        //         }
        //     });
    });
});



