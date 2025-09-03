const request = require("supertest");
const app = require("./app");
const { TestDatabase } = require("./db.js");

const testdb = new TestDatabase();

describe("Admin Routes", () => {
  let adminToken = "";
  let testAdminId = NaN;
  let pendingAdminId = NaN;


  beforeAll(async () => {
    await testdb.connectToDatabase();
  });


  afterAll(async () => {
    await testdb.disconnectFromDatabase();
  });


  it("should create a new admin successfully and return admin details", async () => {
    const res = await request(app)
      .post("/api/CSTDsite/admin/createadmin")
      .send({
        firstname: "Te3st",
        lastname: " Admmin",
        email: "testaedmin@example.com",
        phone: "08034567890",
        password: "password123&",
        role: "admin",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("success");
    expect(res.body).toHaveProperty("message", "Admin Created successfully!");
  });


  it("should fetch all admins (authenticated)", async () => {
    const res = await request(app)
      .get("/api/CSTDsite/admin/alladmins")

    pendingAdminId = res.body.data[0]["_id"];
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });


  it("should approve a pending admin", async () => {

    expect(pendingAdminId).not.toBeNaN();

    const res = await request(app)
      .put(`/api/CSTDsite/admin/approve/${pendingAdminId}`)


    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success");
    expect(res.body).toHaveProperty("message", "Admin approved successfully");
  });


  it("should allow a newly created admin to log in and return a token", async () => {
    const res = await request(app).post("/api/CSTDsite/admin/login").send({
      email: "testaedmin@example.com",
      password: "password123&",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success");
    expect(res.body).toHaveProperty("token");
    adminToken = res.body.token;
  });



  it("should create a new webmaster successfully", async () => {
    const res = await request(app)
      .post("/api/CSTDsite/admin/createwebmaster")
      .send({
        firstname: "Test",
        lastname: "Webmaster",
        phone: "08134567890",
        password: "password123&",
        email: "testwebmaster@example.com",
        role: "webmaster",
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("message", "Admin Created successfully!");
  });

  it("should deny an admin (create new pending admin first)", async () => {

    const resCreate = await request(app)
      .post("/api/CSTDsite/admin/createadmin")
      .send({
        firstname: "Te3st",
        lastname: " Admmin",
        phone: "08039562890",
        email: "deny@example.com",
        password: "password123$",
        role: "admin",
      });
    expect(resCreate.statusCode).toEqual(201);
    const ress = await request(app)
      .get("/api/CSTDsite/admin/alladmins")

    const denyAdminId = ress.body.data[1]["_id"];

    const res = await request(app)
      .put(`/api/CSTDsite/admin/deny/${denyAdminId}`)
    // .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body)
      .toHaveProperty("message", "Admin Denied successfully");
  });


  it("should allow an admin to change their password", async () => {
    const res = await request(app)
      .put("/api/CSTDsite/admin/changePwdAdmin")
      // .set("Authorization", `Bearer ${adminToken}`)
      .send({
        id: pendingAdminId,
        currentPassword: "password123&",
        newPassword: "iPioi23#24*",
        passwordConfirm: "iPioi23#24*",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("message", "Password updated successfully!");


    const loginRes = await request(app).post("/api/CSTDsite/admin/login").send({
      email: "testaedmin@example.com",
      password: "iPioi23#24*",
    });
    expect(loginRes.statusCode).toEqual(200);
    expect(loginRes.body).toHaveProperty("token");
    adminToken = loginRes.body.token;
  });


  it("should allow an admin to edit their own details", async () => {
    expect(pendingAdminId).not.toBeNaN();
    const res = await request(app)
      .put("/api/CSTDsite/admin/editAdmin")
      // .set("Authorization", `Bearer ${adminToken}`)
      .send({
        id: pendingAdminId,
        firstname: "Updated Test",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body)
      .toHaveProperty("message", "Admin updated successfully!");
    expect(res.body.data).toHaveProperty("firstname", "Updated Test");
  });


  it("should delete an admin successfully", async () => {
    const resCreate = await request(app)
      .post("/api/CSTDsite/admin/createadmin")
      .send({
        firstname: "Admin",
        lastname: "ToDelete",
        phone: "08134387890",
        password: "password123&",
        email: "admintoadmin@example.com",
        role: "admin",
      });
    expect(resCreate.statusCode).toEqual(201);
    const ress = await request(app)
      .get("/api/CSTDsite/admin/alladmins")

    const adminToDeleteId = ress.body.data[2]["_id"];

    const res = await request(app)
      .delete(`/api/CSTDsite/admin/delete/${adminToDeleteId}`)
    // .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body)
      .toHaveProperty("message", "Deleted Successfully!");



  });
});
