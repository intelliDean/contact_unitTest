import {loadFixture,} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import {ethers} from "hardhat";

const title = "Web3 Lagos Conference";
const desc = "This is the best Web3 event in Lagos";
const venue = "The Zone Gbagada Lagos";
const eventDate = "18th Oct 2024";

const eventStruct = {
    id: 2,
    title: title,
    description: desc,
    venue: venue,
    registeredUsers: [],
    eventDate: eventDate
};

describe("Event Contract Test", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployEventContract() {

        // Contracts are deployed using the first signer/account by default
        const [owner, anotherUser] = await ethers.getSigners();

        const DeanNFT = await ethers.getContractFactory("EventNft");
        const deanNFT = await DeanNFT.deploy();


        const Event = await ethers.getContractFactory("NftGatedEvent");
        const event = await Event.deploy(deanNFT.target);

        return {eventNFT: deanNFT, event, owner, anotherUser};
    }

    describe("NFT Gated Event Contract", function () {
        it("Should set the nft contract address correctly", async function () {
            const {
                eventNFT,
                event
            } = await loadFixture(deployEventContract);

            const nftAddress = await event.eventNft();

            expect(nftAddress).to.equal(eventNFT.target);
        });

        it("Should create an event successfully", async function () {
            const {event} = await loadFixture(deployEventContract);

            const tx = await event.createEvent(title, desc, venue, eventDate);
            await tx.wait();

            expect(await event.eventCount()).to.equal(1);
            expect((await event.getAllEvents()).length).to.equal(1);

            const createdEvent = await event.viewEvent(1);

            expect(createdEvent.title).to.equal(title);
            expect(createdEvent.description).to.equal(desc);
            expect(createdEvent.venue).to.equal(venue);
            expect(createdEvent.eventDate).to.equal(eventDate);
        });

        it("Should allow struct as argument to create event", async function () {
            const {event} = await loadFixture(deployEventContract);

            const tx2 = await event.createAnotherEvent(eventStruct);
            await tx2.wait();

            expect(await event.eventCount()).to.equal(1);
            expect((await event.getAllEvents()).length).to.equal(1);

            const createdEvent = await event.viewEvent(1);

            expect(createdEvent.title).to.equal(title);
            expect(createdEvent.description).to.equal(desc);
            expect(createdEvent.venue).to.equal(venue);
            expect(createdEvent.eventDate).to.equal(eventDate);

        });

        it("It should revert if user doesn't have NFT during registration", async function () {
            const {
                event,
                anotherUser
            } = await loadFixture(deployEventContract);

            const tx = await event.createEvent(title, desc, venue, eventDate);
            await tx.wait();

            await expect(event.connect(anotherUser).registerForEvent(1)).to.be.rejectedWith("not eligible for event");
        });

        it("Should allow users with NFT register for event", async function () {
            const {eventNFT, event, owner, anotherUser} = await loadFixture(deployEventContract);

            const tx = await event.createEvent(title, desc, venue, eventDate);
            await tx.wait();


            const tx2 = await event.createAnotherEvent(eventStruct);
            await tx2.wait();

            const mintTx =
                await eventNFT.mint(anotherUser.address, 1, "QmfQjhLMJ3LgwLgB9ogVdcDuDhRCkpPXfc6zQbp9zM9E2U");
            await mintTx.wait();

            const regTx = await event.connect(anotherUser).registerForEvent(1);
            await regTx.wait();

            expect(await event.checkRegistrationValidity(1, anotherUser.address)).to.be.equal(true);

            const createdEvent = await event.viewEvent(1);

            expect(createdEvent.registeredUsers.length).to.be.eq(1);

        });
    });
});