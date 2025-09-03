const request = require("supertest");
const app = require("./app");
const { TestDatabase } = require("./db.js");

const testdb = new TestDatabase();


describe("Event Routes", () => {
  let eventId = NaN;
  let adminToken = "";

  beforeAll(async () => {
    await testdb.connectToDatabase();
    await request(app)
      .post("/api/CSTDsite/admin/createadmin")
      .send({
        firstname: "Te3st",
        lastname: " Admmin",
        email: "testaedmin@example.com",
        phone: "08034567890",
        password: "password123&",
        role: "admin",
      });
    const res2 = await request(app)
      .get("/api/CSTDsite/admin/alladmins")

    adminToken = res2.body.data[0]["_id"];
    await request(app).put(`/api/CSTDsite/admin/approve/${adminToken}`)
    await request(app).post("/api/CSTDsite/admin/login").send({
      email: "testaedmin@example.com",
      password: "password123&",
    });
  });


  afterAll(async () => {
    await testdb.disconnectFromDatabase();
  });

  it("should create a new event", async () => {
    const res = await request(app)
      .post("/api/CSTDsite/events/createevent")
      // .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Test Event",
        description: "This is a test event description.",
        date: "2024-12-25",
        time: "15:34",
        location: "Test Venue",
        flyer: "https://flyertest.io",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("message", "Event Created successfully!");
  });


  it("should fetch all events", async () => {
    const res = await request(app).get("/api/CSTDsite/events/fetchevents");

    eventId = res.body.data[0]['_id'];
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("message", "Events fetched successfully!");
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });


  it("should edit an existing event", async () => {
    expect(eventId).not.toBeNaN();
    const ress = await request(app).get("/api/CSTDsite/events/fetchevents");
    const data = ress.body.data.reduce(x => x._id == eventId);
    data.description = "This event has been updated.";
    data.location = "New Test Venue";
    data.date = "2024-12-12";
    data.title = "Updated Test Event";
    const res = await request(app)
      .put(`/api/CSTDsite/events/edit/${eventId}`)
      // .set("Authorization", `Bearer ${adminToken}`)
      .send(data);
    console.log(res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body)
      .toHaveProperty("message", "Event edited successfully!");
  });


  it("should delete an event", async () => {
    expect(eventId).not.toBeNaN();

    const res = await request(app)
      .delete(`/api/CSTDsite/events/delete/${eventId}`)
    // .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body)
      .toHaveProperty("message", "Event Deleted successfully!");


    const fetchRes = await request(app).get("/api/CSTDsite/events/fetchevents");
    const deletedEvent = fetchRes.body.data.find(
      (event) => event._id === eventId,
    );
    expect(deletedEvent).toBeUndefined();
  });
});
