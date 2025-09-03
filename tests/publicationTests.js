const request = require("supertest");
const app = require("./app");
// const { expect } = require("chai");

describe("Publication Routes", () => {
  let adminToken = "";
  let publicationId = "";

 
  before(async () => {
   
    await request(app).post("/api/CSTDsite/admin/createadmin").send({
      name: "Publication Admin",
      email: "publicationadmin@example.com",
      password: "password123",
      role: "admin",
    });

   
    const res = await request(app).post("/api/CSTDsite/admin/login").send({
      email: "publicationadmin@example.com",
      password: "password123",
    });
    adminToken = res.body.token;
    expect(adminToken).to.not.be.empty;
  });

 
  it("should add a new publication (authenticated)", async () => {
    const res = await request(app)
      .post("/api/CSTDsite/pub/addpublication")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Research Paper on AI",
        author: "Dr. Jane Doe",
        year: 2023,
        journal: "Journal of Artificial Intelligence",
        link: "https://example.com/ai-paper",
       
      });

    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property("success").and.to.be.true;
    expect(res.body)
      .to.have.property("message")
      .and.to.include("Publication Added Successfully!");
    expect(res.body).to.have.property("publication").and.to.be.an("object");
    expect(res.body.publication).to.have.property("_id");
    publicationId = res.body.publication._id;
    expect(res.body.publication.title).to.equal("Research Paper on AI");
  });

 
  it("should fetch all publications", async () => {
    const res = await request(app).get("/api/CSTDsite/pub/getpublications");

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("success").and.to.be.true;
    expect(res.body)
      .to.have.property("message")
      .and.to.include("Publications Fetched Successfully!");
    expect(res.body).to.have.property("publications").and.to.be.an("array");
    expect(res.body.publications.length).to.be.at.least(1);
    expect(res.body.publications[0].title).to.equal("Research Paper on AI");
  });

 
  it("should edit an existing publication (authenticated)", async () => {
    expect(publicationId).to.not.be.empty;

    const res = await request(app)
      .put(`/api/CSTDsite/pub/editpublication/${publicationId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Updated Research Paper on AI",
        year: 2024,
        journal: "Advanced AI Studies",
      });

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("success").and.to.be.true;
    expect(res.body)
      .to.have.property("message")
      .and.to.include("Publication Updated Successfully!");
    expect(res.body).to.have.property("publication").and.to.be.an("object");
    expect(res.body.publication.title).to.equal("Updated Research Paper on AI");
    expect(res.body.publication.year).to.equal(2024);
  });

 
  it("should delete a publication (authenticated)", async () => {
    expect(publicationId).to.not.be.empty;

    const res = await request(app)
      .delete(`/api/CSTDsite/pub/deletepublication/${publicationId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("success").and.to.be.true;
    expect(res.body)
      .to.have.property("message")
      .and.to.include("Publication Deleted Successfully!");

   
    const fetchRes = await request(app).get(
      "/api/CSTDsite/pub/getpublications",
    );
    const deletedPublication = fetchRes.body.publications.find(
      (p) => p._id === publicationId,
    );
    expect(deletedPublication).to.be.undefined;
  });
});
