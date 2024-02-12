import {loadFixture,} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import {ethers} from "hardhat";
import * as assert from "assert";

describe("Mutators", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployMutators() {
        // Contracts are deployed using the first signer/account by default
        // const [owner, otherAccount] = await ethers.getSigners();

        const Mutators = await ethers.getContractFactory("Mutators");
        const mutators = await Mutators.deploy();

        return {mutators};
    }

    describe("Test Setter", function () {
        it("Should set name and get name", async function () {
            const {mutators} = await loadFixture(deployMutators);

            await mutators.setName("Dean");
            const result = await mutators.getName();

            expect(result).to.equal("Dean");
            assert.equal(result, "Dean");
            expect(result).is.equal("Dean");

        });
    });
});
