const request = require("supertest");
const app = require("../app");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");
const res = require("express/lib/response");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("status:200, responds with an Array has 3 objects topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.topics).toBeInstanceOf(Array);
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(typeof topic).toBe("object");
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
        expect(response.body.msg).toBe("invalid path / page Not found");
      });
  });
});

describe("GET / api/aritcle:article_id", () => {
  it("status:200, returns with an article that has the same given id ", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.article).toBeInstanceOf(Array);
        expect(body.article).toHaveLength(1);
        body.article.forEach((article) => {
          expect(typeof article).toBe("object");
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              title: expect.any(String),
              topic: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });

  it("status:404 : returns a bad request messsage when paased an invailid id", () => {
    return request(app)
      .get("/api/articles/909090")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Id");
      });
  });
});
