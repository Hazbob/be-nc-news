const db = require("../db/connection.js");
const app = require("../app.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const connection = require("../db/connection.js");
require("jest-sorted");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  if (connection) {
    connection.end();
  }
});

describe("/api/nonexistenroute", () => {
  it("should return with an error code of 404 and a message if a path does not exist in our api", async () => {
    const { body } = await request(app)
      .get("/api/nonexistentroute")
      .expect(404);

    expect(body.message).toBe("Path Does Not Exist");
  });
});

describe("GET: /api/topics", () => {
  it("should respond with a status code of 200 and return an array", async () => {
    const response = await request(app).get("/api/topics").expect(200);
    const { body } = response;
    expect(Array.isArray(body.topics)).toBe(true);
  });
  it("should return an array of object which should have the properties 'slug' and 'description' with both types being string", async () => {
    const response = await request(app).get("/api/topics").expect(200);
    const { body } = response;
    expect(body.topics.length).toBe(3);
    body.topics.forEach((topic) => {
      expect(topic).toMatchObject({
        slug: expect.any(String),
        description: expect.any(String),
      });
    });
  });
});

describe("/api/articles/:article_id", () => {
  it("should respond with article object of expected properties and status code 200 on sucessful get", async () => {
    const { body } = await request(app).get("/api/articles/1").expect(200);
    expect(body.article[0]).toMatchObject({
      article_id: expect.any(Number),
      title: expect.any(String),
      topic: expect.any(String),
      author: expect.any(String),
      body: expect.any(String),
      created_at: expect.any(String),
      votes: expect.any(Number),
      article_img_url: expect.any(String),
    });
  });
  it("should only return one article", async () => {
    const { body } = await request(app).get("/api/articles/1").expect(200);

    expect(body.article.length).toBe(1);
  });
  it("should return article matching the id", async () => {
    const { body } = await request(app).get("/api/articles/2").expect(200);
    expect(body.article[0].article_id).toBe(2);
  });
  it("should return an error if an invalid id is input + status code 404", async () => {
    const { body } = await request(app).get("/api/articles/990909").expect(404);
    expect(body.message).toBe("ID(990909) does not match any article");
  });
  it("should return an error a non numeric input causing an error in the db query", async () => {
    const { body } = await request(app)
      .get("/api/articles/99adadadad909")
      .expect(400);
    expect(body.message).toBe("Bad Request");
  });
});

describe("api/articles", () => {
  it("should return with status code 200 and an array", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);
    expect(Array.isArray(body.articles)).toBe(true);
  });
  it("should sort the arrays in descending order", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);

    expect(body.articles).toBeSorted({
      key: "created_at",
      descending: true,
    });
  });
  it("should return return an array of objects with the correct properties as well as check for the comment count", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);
    body.articles.forEach((article) => {
      expect(article).toMatchObject({
        author: expect.any(String),
        title: expect.any(String),
        article_id: expect.any(Number),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
        comment_count: expect.any(String),
      });
    });
  });
});
