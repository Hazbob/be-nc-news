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

describe("/api/articles/:article_id/comments", () => {
  it("should return an empty array if the article has no comments", async () => {
    const { body } = await request(app).get("/api/articles/4/comments");

    expect(body.comments).toEqual([]);
  });
  it("should return an error message if the article id does not exist", async () => {
    const { body } = await request(app).get("/api/articles/12121211/comments");

    expect(body.message).toBe("ID(12121211) does not match any article");
  });
  it("should return an array of comment objects with the correct properties", async () => {
    const { body } = await request(app)
      .get("/api/articles/1/comments")
      .expect(200);
    expect(body.comments.length).not.toBe(0);
    body.comments.forEach((comment) => {
      expect(comment).toMatchObject({
        comment_id: expect.any(Number),
        body: expect.any(String),
        article_id: expect.any(Number),
        author: expect.any(String),
        votes: expect.any(Number),
        created_at: expect.any(String),
      });
    });
  });
  it("should return an array of comments sorted by most recent first", async () => {
    const { body } = await request(app)
      .get("/api/articles/1/comments")
      .expect(200);
    expect(body.comments).toBeSorted({
      key: "created_at",
      descending: true,
    });
  });
  it("should return an error if an invalid id is input + status code 404", async () => {
    const { body } = await request(app)
      .get("/api/articles/112131231/comments")
      .expect(404);
    expect(body.message).toBe("ID(112131231) does not match any article");
  });
  it("should return an error a non numeric input causing an error in the db query", async () => {
    const { body } = await request(app)
      .get("/api/articles/1121adadad31231/comments")
      .expect(400);
    expect(body.message).toBe("Bad Request");
  });
});

describe("POST to /api/articles/:article_id/comments", () => {
  it("should respond with status 201 when posted with the correct properties", async () => {
    const input = { username: "lurker", body: "not a comment" };
    const { body } = await request(app)
      .post("/api/articles/2/comments")
      .send(input)
      .expect(201);
    expect(body.author).toBe("lurker");
    expect(body.body).toBe("not a comment");
  });
  it("should return the comment that was posted", async () => {
    const input = { username: "lurker", body: "not a comment" };
    const { body } = await request(app)
      .post("/api/articles/2/comments")
      .send(input)
      .expect(201);
    expect(body).toMatchObject({
      article_id: 2,
      author: "lurker",
      body: "not a comment",
      comment_id: 19,
      created_at: expect.any(String),
      votes: 0,
    });
  });
  it("should return an error if the property keys of the input are incorrect", async () => {
    const input = { userivespeltthiswrong: "lurker", body: "not a comment" };
    const { body } = await request(app)
      .post("/api/articles/2/comments")
      .send(input)
      .expect(400);

    expect(body.message).toBe("Bad Request");
  });
  it("should return an error if the user doesnt exist in the users table", async () => {
    const input = {
      username: "nonexistent user",
      body: "not a comment",
    };
    const { body } = await request(app)
      .post("/api/articles/2/comments")
      .send(input)
      .expect(404);

    expect(body.message).toBe("User Not Found");
  });
  it("should return an error if article id is invalid", async () => {
    const input = {
      username: "lurker",
      body: "not a comment",
    };
    const { body } = await request(app)
      .post("/api/articles/121213132/comments")
      .send(input)
      .expect(404);
    expect(body.message).toBe("Article Id Is Invalid");
  });
  it("should return an error if article id is of wrong type - in this case containing letters", async () => {
    const input = {
      username: "lurker",
      body: "not a comment",
    };
    const { body } = await request(app)
      .post("/api/articles/12121adadad3132/comments")
      .send(input)
      .expect(400);
    expect(body.message).toBe("Bad Request");
  });
});
