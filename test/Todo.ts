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

            assert.equal(result.title, "Read");
            assert.equal(result.description, "I want to read");
        });
    });

    describe("Index out of bound", function () {
        it('should not accept index below 0 and above the length of the array', async function () {
            const {todo} = await loadFixture(deployMutators);

            await todo.createTodo("Read", "I want to read");
            try {
                await todo.getTodo(5);
                await todo.getTodo(-1);
                assert.fail('Expected function to revert, but it did not');
            } catch (error) {
                // @ts-ignore
                expect(error.message).to.include("Index out of bound");
            }
        });
    });

    describe("Change status", function () {
        it('To flip the status at every call to the function', async function () {
            const {todo} = await loadFixture(deployMutators);

            await todo.createTodo("Read", "I want to read");
            expect(await todo.getStatus(0)).to.equal(false);

            //change from false to true
            await todo.changeStatus(0);
            expect(await todo.getStatus(0)).to.equal(true);

            //change from true to false
            await todo.changeStatus(0);
            expect(await todo.getStatus(0)).to.equal(false);
        });
    });

    describe("Index out of bound", function () {
        it('Will throw an exception if you try to update status of todo not in the array', async function () {
            const {todo} = await loadFixture(deployMutators);

            await todo.createTodo("Read", "I want to read");
            expect(await todo.getStatus(0)).to.equal(false);

            try {
                await todo.changeStatus(2);
                assert.fail('Expected function to revert, but it did not');
            } catch (error) {
                // @ts-ignore
                expect(error.message).to.include("Index out of bound");
            }

        });
    });

    describe("Delete todo", function () {
        it('Delete a todo, when you try to get it, it will not be there', async function () {
            const {todo} = await loadFixture(deployMutators);

            await todo.createTodo("Read", "I want to read");
            const result = await todo.getTodo(0);

            assert.equal(result.title, "Read");
            assert.equal(result.description, "I want to read");

            await todo.createTodo("Sleep", "I want to sleep");
            const result2 = await todo.getTodo(1);

            assert.equal(result2.title, "Sleep");
            assert.equal(result2.description, "I want to sleep");

            assert.equal(2, await todo.getArraySize());

            await todo.deleteTodo(0);

            const result3 = await todo.getTodo(0);
            assert.equal(result3.title, "");
            assert.equal(result3.description, "");
            assert.equal(result3.isDone, false);

        });
    });

    describe("Update title", function () {
        it('Update the title of the todo', async function () {
            const {todo} = await loadFixture(deployMutators);

            await todo.createTodo("Read", "I want to read");
            const result = await todo.getTodo(0);

            assert.equal(result.title, "Read");
            assert.equal(result.description, "I want to read");

            await todo.updateTitle(0, "To Read");

            const result1 = await todo.getTodo(0);
            assert.equal(result1.title, "To Read");
            assert.equal(result1.description, "I want to read");
        });
    });

    describe("Update description", function () {
        it('Update the description of the todo', async function () {
            const {todo} = await loadFixture(deployMutators);

            await todo.createTodo("Read", "I want to read");
            const result = await todo.getTodo(0);

            assert.equal(result.title, "Read");
            assert.equal(result.description, "I want to read");

            await todo.updateDescription(0, "I want to start reading by 5pm");

            const result1 = await todo.getTodo(0);
            assert.equal(result1.title, "Read");
            assert.equal(result1.description, "I want to start reading by 5pm");
        });
    });
});