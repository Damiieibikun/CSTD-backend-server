const request = require("supertest");
const app = require("./app");
// const { expect } = require("chai");

describe("Page Routes", () => {
  let adminToken = "";
  let pageLinkId = "";
  let createdPageId = "";

 
  before(async () => {
   
    await request(app).post("/api/CSTDsite/admin/createadmin").send({
      name: "Page Admin",
      email: "pageadmin@example.com",
      password: "password123",
      role: "admin",
    });

   
    const res = await request(app).post("/api/CSTDsite/admin/login").send({
      email: "pageadmin@example.com",
      password: "password123",
    });
    adminToken = res.body.token;
    expect(adminToken).to.not.be.empty;
  });

 
  it("should create a new page link (authenticated)", async () => {
    const res = await request(app)
      .post("/api/CSTDsite/pages/create")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "About Us",
        slug: "about-us",
        content: "This is the content for the about us page.",
        published: true,
      });

    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property("success").and.to.be.true;
    expect(res.body)
      .to.have.property("message")
      .and.to.include("Page created successfully!");
    expect(res.body).to.have.property("page").and.to.be.an("object");
    expect(res.body.page).to.have.property("_id");
    pageLinkId = res.body.page._id;
    createdPageId = res.body.page.slug;
  });

 
  it("should fetch all page links", async () => {
    const res = await request(app).get("/api/CSTDsite/pages/links");

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("success").and.to.be.true;
    expect(res.body)
      .to.have.property("message")
      .and.to.include("Page links fetched successfully!");
    expect(res.body).to.have.property("links").and.to.be.an("array");
    expect(res.body.links.length).to.be.at.least(1);
  });

 
  it("should fetch a single page's content by its slug/ID", async () => {
    expect(createdPageId).to.not.be.empty;

    const res = await request(app).get(`/api/CSTDsite/pages/${createdPageId}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("success").and.to.be.true;
    expect(res.body)
      .to.have.property("message")
      .and.to.include("Page content fetched successfully!");
    expect(res.body).to.have.property("page").and.to.be.an("object");
    expect(res.body.page).to.have.property("slug").eql(createdPageId);
    expect(res.body.page.content).to.include("about us page");
  });

 
  it("should update an existing page link (authenticated)", async () => {
    expect(pageLinkId).to.not.be.empty;

    const res = await request(app)
      .put(`/api/CSTDsite/pages/update/${pageLinkId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Updated About Us",
        slug: "updated-about-us",
        published: false,
      });

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("success").and.to.be.true;
    expect(res.body)
      .to.have.property("message")
      .and.to.include("Page link updated successfully!");
    expect(res.body.page).to.have.property("name").eql("Updated About Us");
    expect(res.body.page).to.have.property("published").to.be.false;
   
    createdPageId = res.body.page.slug;
  });

 
  it("should update a page's content by its slug/ID (authenticated)", async () => {
    expect(createdPageId).to.not.be.empty;

    const res = await request(app)
      .put(`/api/CSTDsite/pages/updatepage/${createdPageId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        content: "This is the updated content for the about us page.",
        published: true,
      });

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("success").and.to.be.true;
    expect(res.body)
      .to.have.property("message")
      .and.to.include("Page content updated successfully!");
    expect(res.body.page)
      .to.have.property("content")
      .include("updated content");
    expect(res.body.page).to.have.property("published").to.be.true;
  });

 
  it("should delete a page link and its content", async () => {
    expect(pageLinkId).to.not.be.empty;

    const res = await request(app)
      .delete(`/api/CSTDsite/pages/delete/${pageLinkId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("success").and.to.be.true;
    expect(res.body)
      .to.have.property("message")
      .and.to.include("Page and its content deleted successfully!");

   
    const fetchLinksRes = await request(app).get("/api/CSTDsite/pages/links");
    const deletedLink = fetchLinksRes.body.links.find(
      (link) => link._id === pageLinkId,
    );
    expect(deletedLink).to.be.undefined;

   
    const fetchPageContentRes = await request(app).get(
      `/api/CSTDsite/pages/${createdPageId}`,
    );
    expect(fetchPageContentRes.statusCode).to.equal(404);
    expect(fetchPageContentRes.body).to.have.property("success").and.to.be
      .false;
  });
});
