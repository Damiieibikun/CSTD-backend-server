const request = require("supertest");
const app = require("./app");
// const { expect } = require("chai");
const { TestDatabase } = require("./db.js");

const testdb = new TestDatabase();


describe("Footer Routes", () => {
  let adminToken = NaN;
  let footerId = NaN;


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

  it("should add a new footer (authenticated)", async () => {
    const res = await request(app)
      .post("/api/CSTDsite/footer/addfooter")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        logo: "https://demologourl.com/",
        copyright: "@copyright, 2025",
        columns: [
          { id: 1, title: "Explanation", links: [{ id: 1, text: "test Link", url: "https://newtestlink.com" }] }
        ],
        socialLinks:
          [
            { id: 1, platform: "windows", url: "https://testwindows.com" },
            { id: 1, platform: "windows", url: "https://testwindows.com" }
          ],
        description: "Updated footer description."
      });
    console.log(res.body);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body)
      .toHaveProperty("message","Footer Added Successfully!");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("_id");
    footerId = res.body.footer._id;
  });


  it("should fetch footer details", async () => {
    const res = await request(app).get("/api/CSTDsite/footer/getfooter");
    footerId = res.body.data._id;
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body)
      .toHaveProperty("message", "Footer fetched successfully!");
  });


  it("should update existing footer details (authenticated)", async () => {
    expect(footerId).not.toBeNaN();

    const res = await request(app)
      .put(`/api/CSTDsite/footer/updatefooter/${footerId}`)
      // .set("Authorization", `Bearer ${adminToken}`)
      .send({
        logo: "https://demologourl.com/",
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body)
      .toHaveProperty("message", "Footer Updated Successfully!");
    expect(res.body.data.logo).toEqual("https://demologourl.com/");
  });


  it("should not add another footer if one already exists (if designed as singleton)", async () => {
    const res = await request(app)
      .post("/api/CSTDsite/footer/addfooter")
      // .set("Authorization", `Bearer ${adminToken}`)
      .send({
        logo: "https://demologourl.com/",
        copyright: "@copyright, 2025",
        columns: [
          { id: 1, title: "Explanation", links: [{ id: 1, text: "test Link", url: "https://newtestlink.com" }] }
        ],
        socialLinks:
          [
            { id: 1, platform: "windows", url: "https://testwindows.com" },
            { id: 1, platform: "windows", url: "https://testwindows.com" }
          ],
        description: "Updated footer description."
      });
    console.log(res);
    expect([400, 409, 500]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("success", false);
  });
});
