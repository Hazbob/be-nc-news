const db = require("../db/connection.js");
const app = require("../app.js");
const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const connection = require("../db/connection.js");
const endpointsTest = require("../endpoints.json");

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

describe("/api/topics", () => {
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

describe("/api", () => {
  it("should return with status code 200 and return with a list of endpoints from JSON object", async () => {
    const response = await request(app).get("/api/").expect(200);
    const { endpoints } = response.body;
    expect(typeof endpoints).toBe("object");
  });
  it("should return a list of endpoints, of the same length as the endpoints.json file imported at the top", () => {
    expect(Object.keys(endpoints).length).toBe(
      Object.keys(endpointsTest).length
    );
  });
  it.only("should return an object with keys, [description, queries, example response]", async () => {
    const response = await request(app).get("/api/").expect(200);
    const { endpoints } = response.body;
    for (const endP of Object.keys(endpoints)) {
      expect(endpoints[endP]).toMatchObject({
        description: expect.any(String),
        queries: expect.any(Array),
        exampleResponse: expect.any(Object),
      });
    }
  });
});
