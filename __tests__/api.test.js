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

describe("PATCH to /api/articles/:article_id", () => {
  it("should respond with status code 200 for a successful request and respond with the updated article", async () => {
    const input = { inc_votes: 1 };
    const { body } = await request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(200);
    expect(body).toEqual({
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 101,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    });
  });
  it("should return with an updated article for a number greater that 1", async () => {
    const input = { inc_votes: 10 };

    const { body } = await request(app)
      .patch("/api/articles/1")
      .send(input)
      .expect(200);
    expect(body).toEqual({
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 110,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    });
  });
  it("should return an error if the article id doesnt exist", async () => {
    const input = { inc_votes: 10 };
    const { body } = await request(app)
      .patch("/api/articles/29020202")
      .send(input)
      .expect(404);
    expect(body.message).toBe("Article ID does not exist");
  });
  it("should return an error if the input object has the wrong properties", async () => {
    const input = { inc_votes2: 2 };
    const { body } = await request(app)
      .patch("/api/articles/29020202")
      .send(input)
      .expect(400);
    expect(body.message).toBe("Bad Request");
  });
  it("should return an error if the input is of the wrong format", async () => {
    const input = { inc_votes2: "hello" };
    const { body } = await request(app)
      .patch("/api/articles/2")
      .send(input)
      .expect(400);
    expect(body.message).toBe("Bad Request");
  });
});

describe("DELETE to /api/comments/:comment_id", () => {
  it("should delete a given comment by the comment id, respond with status 204 and no content", async () => {
    const { body } = await request(app).delete("/api/comments/1").expect(204);
    expect(body).toBeEmpty();
  });
  it("should return an error if the comment id is invalid", async () => {
    const { body } = await request(app)
      .delete("/api/comments/1121312313")
      .expect(404);
    expect(body.message).toBe("comment does not exist");
  });
  it("should return an error if the comment id is of the wrong type", async () => {
    const { body } = await request(app)
      .delete("/api/comments/hello")
      .expect(400);
    expect(body.message).toBe("Bad Request");
  });
  it("should delete that comment belonging to the id and it should no longer be in the database", async () => {
    const deletion = await request(app).delete("/api/comments/1");
    const { body } = await request(app).get("/api/articles/9/comments");
    expect(body.comments.length).toBe(1);
  });
});

describe("GET api/users", () => {
  it("should return a status code of 200 and return an array of user objects", async () => {
    const { body } = await request(app).get("/api/users").expect(200);
    expect(body.users.length).toBe(4);
    body.users.forEach((user) => {
      expect(user).toMatchObject({
        username: expect.any(String),
        name: expect.any(String),
        avatar_url: expect.any(String),
      });
    });
  });
});

describe("GET /api/articles with topic query", () => {
  it("should return an array of article with only the topic specified in the path", async () => {
    const { body } = await request(app)
      .get("/api/articles?topic=mitch")
      .expect(200);
    body.articles.forEach((article) => {
      expect(article).toMatchObject({
        author: expect.any(String),
        title: expect.any(String),
        article_id: expect.any(Number),
        topic: "mitch",
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
        comment_count: expect.any(String),
      });
    });
  });

  it("should return an error if an invalid topic was input", async () => {
    const { body } = await request(app)
      .get("/api/articles?topic=notaasdawedawdasdawdadtopic")
      .expect(400);
    expect(body.message).toBe("Invalid Topic");
  });
  it("should return a 200 if the topic exists but there is no article and return an empty array in the body", async () => {
    const { body } = await request(app)
      .get("/api/articles?topic=testtopicwithnoarticle")
      .expect(200);
    expect(body.articles).toEqual([]);
  });
});

describe("GET article by id should have a comment count property too", () => {
  it("should return an article object and that object should contain a comment count property", async () => {
    const { body } = await request(app).get("/api/articles/1").expect(200);
    expect(body.article[0]).toHaveProperty("comment_count", "11");
  });
  it("should work when getting an article with no comments", async () => {
    const { body } = await request(app).get("/api/articles/2").expect(200);
    expect(body.article[0]).toHaveProperty("comment_count", "0");
  });
});
