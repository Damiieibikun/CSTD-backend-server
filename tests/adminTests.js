const request = require("supertest");
const app = require("../app");

describe("Admin Tests", () => {
    it("Create a new user", () => {
        return request(app).get("/").then(response => {
            expect(response.body).toBe("CSTD Website API");
            expect(response.statusCode).toBe(200);
        })
    })
    done();
})