const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

class TestDatabase {
    constructor() {
        this.mongodb = null;
    }
    async connectToDatabase() {
        this.mongodb = await MongoMemoryServer.create();
        const uri = await this.mongodb.getUri();

        await mongoose.connect(uri);

        console.log("Connected to in-memory database");

        return;
    }

    async disconnectFromDatabase() {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await this.mongodb.stop();

        await mongoose.disconnect();

        console.log("Disconnected from database");
    }

    async clearCollections() {
        const collections = mongoose.connection.collections;


        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany();
        }
    }
}

module.exports = {
    TestDatabase
}