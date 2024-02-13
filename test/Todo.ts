import {loadFixture,} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import {ethers} from "hardhat";
import * as assert from "assert";

describe("Todo", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployMutators() {
        // Contracts are deployed using the first signer/account by default
        // const [owner, otherAccount] = await ethers.getSigners();

        const Todo = await ethers.getContractFactory("Todo");
        const todo = await Todo.deploy();

        return {todo};
    }

    describe("Test create todo", function () {
        it("Should be able to create and get todo", async function () {
            const {todo} = await loadFixture(deployMutators);

            await todo.createTodo("Read", "I want to read");

            const result = await todo.getTodo(0);

            expect(result.title).to.equal("Read");
            expect(result.description).to.equal("I want to read");
            // assert.equal(result, "Dean");
            // expect(result).is.equal("Dean");
        });
    });
});