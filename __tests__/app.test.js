const request = require("supertest");
const app = require("../app");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("status:200, responds with an Array has 3 objects topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body).toHaveLength(3);
        body.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });

  test("status:404, Returns a {invalid path / page Not found} message when paased an invalid path", () => {
    return request(app)
      .get("/api/topicslsl")
      .expect(404)
      .then((response) => {
        console.log(response.body.msg);
        expect(response.body.msg).toBe("invalid path / page Not found");
      });
  });
});
