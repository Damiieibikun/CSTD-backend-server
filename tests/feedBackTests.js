const request = require("supertest");
const app = require("./app");
const { TestDatabase } = require("./db.js");

const testdb = new TestDatabase();



describe("Feedback Routes", () => {
  let feedbackId = NaN;
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


  it("should send new feedback", async () => {
    const res = await request(app).post("/api/CSTDsite/contact/feedback").send({
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+234-701-345-3921",
      message: "This is a test feedback message.",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body)
      .toHaveProperty("message", "FeedBack Sent successfully!");
  });


  it("should fetch all feedback (authenticated)", async () => {
    const res = await request(app)
      .get("/api/CSTDsite/contact/feedback")
    // .set("Authorization", `Bearer ${adminToken}`);
    feedbackId = res.body.data[0]["_id"];
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("message", "FeedBack Fetched successfully!");
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });


  it("should delete a specific feedback by ID (authenticated)", async () => {
    expect(feedbackId).not.toBeNaN();

    const res = await request(app)
      .delete(`/api/CSTDsite/contact/feedback/delete/${feedbackId}`)
    // .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body)
      .toHaveProperty("message", "FeedBack deleted successfully!");


    const fetchRes = await request(app)
      .get("/api/CSTDsite/contact/feedback")
    // .set("Authorization", `Bearer ${adminToken}`);
    const deletedFeedback = fetchRes.body.data.find(
      (fb) => fb._id === feedbackId,
    );
    expect(deletedFeedback).toBeUndefined();
  });


  it("should delete multiple feedback entries (authenticated)", async () => {

    await request(app)
      .post("/api/CSTDsite/contact/feedback")
      .send({
        name: "Jane Doe",
        email: "jane.doe@example.com",
        phone: "+1-383-323-2398",
        message: "Message 1",
      });
    await request(app)
      .post("/api/CSTDsite/contact/feedback")
      .send({
        name: "Peter Pan",
        email: "peter.pan@example.com",
        phone: "+1-383-323-2398",
        message: "Message 2",
      });
    const feedbackres = await request(app)
      .get("/api/CSTDsite/contact/feedback");

    const idsToDelete = feedbackres.body.data.map(val => val._id);

    const res = await request(app)
      .delete("/api/CSTDsite/contact/feedback/deletemany")
      // .set("Authorization", `Bearer ${adminToken}`)
      .send({ ids: idsToDelete });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body)
      .toHaveProperty("message", `${idsToDelete.length} feedback(s) deleted successfully!`);


    const fetchRes = await request(app)
      .get("/api/CSTDsite/contact/feedback")
    // .set("Authorization", `Bearer ${adminToken}`);
    idsToDelete.forEach((id) => {
      const deletedFb = fetchRes.body.data.find((fb) => fb._id === id);
      expect(deletedFb).toBeUndefined();
    });
  });
});
