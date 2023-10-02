const db = require("../db/connection.js");
const app = require("../app.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const connection = require("../db/connection.js");

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
      .expect(200);

    expect(body.message).toBe("Path Does Not Exist");
  });
});

describe("GET: /api/topics", () => {
  it("should respond with a status code of 200 and return an array", async () => {
    // return request(app)
    //   .get("/api/topics")
    //   .expect(200)
    //   .then(({ body }) => {
    //     console.log(body.rows);
    //     expect(Array.isArray(body.rows)).toBe(true);
    const response = await request(app).get("/api/topics").expect(200);
    const { body } = response;
    expect(Array.isArray(body.rows)).toBe(true);
  });
  it("should return an array of object which should have the properties 'slug' and 'description' with both types being string", async () => {
    const template = {
      slug: "not a slug",
      description: "not a description",
    };
    const response = await request(app).get("/api/topics").expect(200);
    const { body } = response;
    body.rows.forEach((topic) => {
      expect(topic).toMatchObject({
        slug: expect.any(String),
        description: expect.any(String),
      });
    });
  });
});
