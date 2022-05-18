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

  test("status:404, Returns a {Not found} message when paased an invalid path", () => {
    return request(app)
      .get("/api/topics/sls")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
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
        expect(body.article[0]).toEqual(
          expect.objectContaining({
            article_id: 4,
            title: "Student SUES Mitch!",
            topic: "mitch",
            author: "rogersop",
            body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
            created_at: "2020-05-06T01:14:00.000Z",
            votes: 0,
          })
        );
      });
  });

  it("status:404 : returns a not found messsage when paased an invalid id ", () => {
    return request(app)
      .get("/api/articles/909090")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  it("status:400 : returns a bad request messsage when paased an invalied id type", () => {
    return request(app)
      .get("/api/articles/hello")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });

  it("Status: 200; respond with an array has an object with a commetn_count key", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.article).toBeInstanceOf(Array);
        expect(body.article).toHaveLength(1);
        expect(body.article[0]).toEqual(
          expect.objectContaining({
            article_id: 4,
            title: "Student SUES Mitch!",
            topic: "mitch",
            author: "rogersop",
            body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
            created_at: "2020-05-06T01:14:00.000Z",
            votes: 0,
            comment_count: "0",
          })
        );
      });
  });
});

describe("PATCH /api/article:article_id", () => {
  const newVots = { inc_votes: 1 };

  it("status:200 , return the new updated article change by 300", () => {
    return request(app)
      .patch("/api/articles/4")
      .send({ inc_votes: 300 })
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.article).toBeInstanceOf(Array);
        expect(body.article).toHaveLength(1);
        expect(body.article[0]).toEqual({
          article_id: 4,
          title: "Student SUES Mitch!",
          topic: "mitch",
          author: "rogersop",
          body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          created_at: "2020-05-06T01:14:00.000Z",
          votes: 300,
        });
      });
  });

  it("status:404 , return the a not found message ", () => {
    return request(app)
      .patch("/api/articles/909090")
      .send(newVots)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  it("status:400 : returns a bad request messsage when paased an invalied id type", () => {
    return request(app)
      .patch("/api/articles/kk")
      .send(newVots)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });

  it("status:400 : returns a bad request messsage when paased an invalied vote value", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: "hello" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });

  it("status:400 : returns a bad request messsage when paased an emopty votes obj", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({})
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/users", () => {
  it("Status:200 ; responds wiht an array of objects , each object should have a username ", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.users).toBeInstanceOf(Array);
        expect(body.users).toHaveLength(4);
        body.users.forEach((user) => {
          expect(user).toBeInstanceOf(Object);
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
            })
          );
        });
      });
  });

  test("status:404, Returns a {Not found} message when paased an invalid path", () => {
    return request(app)
      .get("/api/users/ls")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api/articels", () => {
  it("status:200, returns with all the articles ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        console.log(body);
        expect(body).toBeInstanceOf(Object);
        expect(body.articles).toHaveLength(12);
        body.articles.forEach((article) => {
          expect(article).toBeInstanceOf(Object);
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});
