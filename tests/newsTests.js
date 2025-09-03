const request = require("supertest");
const app = require("./app");
// const { expect } = require("chai");
const path = require("path");
const fs = require("fs");

describe("News Routes", () => {
  let adminToken = "";
  let newsId = "";

 
  const dummyImagePath = path.join(__dirname, "dummy-image.jpg");
  before(async () => {
   
    fs.writeFileSync(dummyImagePath, "dummy image content");

   
    await request(app).post("/api/CSTDsite/admin/createadmin").send({
      name: "News Admin",
      email: "newsadmin@example.com",
      password: "password123",
      role: "admin",
    });

   
    const res = await request(app).post("/api/CSTDsite/admin/login").send({
      email: "newsadmin@example.com",
      password: "password123",
    });
    adminToken = res.body.token;
    expect(adminToken).to.not.be.empty;
  });

 
  after(() => {
    if (fs.existsSync(dummyImagePath)) {
      fs.unlinkSync(dummyImagePath);
    }
  });

 
  it("should create a new news article with media (authenticated)", async () => {
    const res = await request(app)
      .post("/api/CSTDsite/news/createnews")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("title", "Breaking News: New Discovery")
      .field("content", "Scientists have made a groundbreaking discovery...")
      .field("author", "News Reporter")
      .attach("media", dummyImagePath);

    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property("success").and.to.be.true;
    expect(res.body)
      .to.have.property("message")
      .and.to.include("News Posted Successfully!");
    expect(res.body).to.have.property("news").and.to.be.an("object");
    expect(res.body.news).to.have.property("_id");
    newsId = res.body.news._id;
    expect(res.body.news.media).to.be.an("array").that.is.not.empty;
  });

 
  it("should fetch all news articles", async () => {
    const res = await request(app).get("/api/CSTDsite/news/fetchnews");

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("success").and.to.be.true;
    expect(res.body)
      .to.have.property("message")
      .and.to.include("News Fetched Successfully!");
    expect(res.body).to.have.property("news").and.to.be.an("array");
    expect(res.body.news.length).to.be.at.least(1);
  });

 
  it("should edit an existing news article with updated media (authenticated)", async () => {
    expect(newsId).to.not.be.empty;

    const res = await request(app)
      .put(`/api/CSTDsite/news/edit/${newsId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .field("title", "Updated Breaking News")
      .field("content", "The discovery has been further elaborated...")
      .attach("media", dummyImagePath);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("success").and.to.be.true;
    expect(res.body)
      .to.have.property("message")
      .and.to.include("News Updated Successfully!");
    expect(res.body).to.have.property("news").and.to.be.an("object");
    expect(res.body.news.title).to.equal("Updated Breaking News");
    expect(res.body.news.media).to.be.an("array").that.is.not.empty;
  });

 
  it("should delete a news article (authenticated)", async () => {
    expect(newsId).to.not.be.empty;

    const res = await request(app)
      .delete(`/api/CSTDsite/news/delete/${newsId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property("success").and.to.be.true;
    expect(res.body)
      .to.have.property("message")
      .and.to.include("News Deleted Successfully!");

   
    const fetchRes = await request(app).get("/api/CSTDsite/news/fetchnews");
    const deletedNews = fetchRes.body.news.find((item) => item._id === newsId);
    expect(deletedNews).to.be.undefined;
  });
});
