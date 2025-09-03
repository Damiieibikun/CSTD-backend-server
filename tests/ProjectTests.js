const request = require("supertest");
const app = require("./app");
// const { expect } = require("chai");

describe("Project Routes", () => {
  let adminToken = "";
  let upcomingProjectId = "";
  let pastProjectId = "";

 
  before(async () => {
   
    await request(app).post("/api/CSTDsite/admin/createadmin").send({
      name: "Project Admin",
      email: "projectadmin@example.com",
      password: "password123",
      role: "admin",
    });

   
    const res = await request(app).post("/api/CSTDsite/admin/login").send({
      email: "projectadmin@example.com",
      password: "password123",
    });
    adminToken = res.body.token;
    expect(adminToken).to.not.be.empty;
  });

 
  it("should add a new upcoming project (authenticated)", async () => {
    const res = await request(app)
      .post("/api/CSTDsite/project/addupcomingproject")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Future Research Project",
        description: "Details about an exciting upcoming research.",
        startDate: "2024-06-01",
        expectedEndDate: "2025-06-01",
        status: "Planned",
      });

    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property("success").and.to.be.true;
    expect(res.body)
      .to.have.property("message")
      .and.to.include("Upcoming Project Added Successfully!");
    expect(res.body).to.have.property("project").and.to.be.an("object");
    expect(res.body.project).to.have.property("_id");
    upcomingProjectId = res.body.project._id;
    expect(res.body.project.title).to.equal("Future Research Project");
  });

 
  it("should add a new past project (authenticated)", async () => {
    const res = await request(app)
      .post("/api/CSTDsite/project/addpastproject")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Completed Project Alpha",
        description: "Summary of a successfully finished project.",
        startDate: "2022-01-01",
        endDate: "2023-01-01",
        status: "Completed",
        outcome: "Successful implementation of solution.",
      });

    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property("success").and.to.be.true;
    expect(res.body)
      .to.have.property("message")
      .and.to.include("Past Project Added Successfully!");
    expect(res.body).to.have.property("project").and.to.be.an("object");
    expect(res.body.project).to.have.property("_id");
    pastProjectId = res.body.project._id;
    expect(res.body.project.title).to.equal("Completed Project Alpha");
  });

 
  it("should fetch all projects (upcoming and past)", async () => {
    const res = await request(app).get("/api/CSTDsite/project/getprojects");

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("success").and.to.be.true;
    expect(res.body)
      .to.have.property("message")
      .and.to.include("Projects Fetched Successfully!");
    expect(res.body).to.have.property("projects").and.to.be.an("array");
    expect(res.body.projects.length).to.be.at.least(2);

    const upcomingProject = res.body.projects.find(
      (p) => p._id === upcomingProjectId,
    );
    expect(upcomingProject).to.exist;
    expect(upcomingProject.title).to.equal("Future Research Project");

    const pastProject = res.body.projects.find((p) => p._id === pastProjectId);
    expect(pastProject).to.exist;
    expect(pastProject.title).to.equal("Completed Project Alpha");
  });

 
  it("should edit an existing project (authenticated)", async () => {
    expect(upcomingProjectId).to.not.be.empty;

    const res = await request(app)
      .put(`/api/CSTDsite/project/editproject/${upcomingProjectId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Updated Future Research Project",
        description: "Updated details for the upcoming research.",
        status: "In Progress",
      });

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("success").and.to.be.true;
    expect(res.body)
      .to.have.property("message")
      .and.to.include("Project Updated Successfully!");
    expect(res.body).to.have.property("project").and.to.be.an("object");
    expect(res.body.project.title).to.equal("Updated Future Research Project");
    expect(res.body.project.status).to.equal("In Progress");
  });

 
  it("should delete a project (authenticated)", async () => {
    expect(pastProjectId).to.not.be.empty;

    const res = await request(app)
      .delete(`/api/CSTDsite/project/deleteproject/${pastProjectId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("success").and.to.be.true;
    expect(res.body)
      .to.have.property("message")
      .and.to.include("Project Deleted Successfully!");

   
    const fetchRes = await request(app).get(
      "/api/CSTDsite/project/getprojects",
    );
    const deletedProject = fetchRes.body.projects.find(
      (p) => p._id === pastProjectId,
    );
    expect(deletedProject).to.be.undefined;
  });
});
