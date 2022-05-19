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

describe("GET /api/articles/:article_id/comments", () => {
  it("Status:200; responds with an array of comments for the given article_id ", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(2);
        comments.forEach((comment) => {
          expect(comment).toBeInstanceOf(Object);
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });
  it("Status 400: when passing invalid id", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  it("Status 200: when passing right id but there is no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toEqual([]);
      });
  });
  test("status:404, Returns a {Not found} message when passin an unfound id", () => {
    return request(app)
      .get("/api/articles/202020202/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

//

describe("POST /api/articles/:article_id/comments", () => {
  it("Status:201: creates a comment and return the created comment", () => {
    const comment = {
      username: "butter_bridge",
      body: "Nice article, I like it!",
    };
    const returned = {
      author: "butter_bridge",
      body: "Nice article, I like it!",
      article_id: 1,
      votes: 0,
      comment_id: 19,
      created_at: expect.any(String),
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual(returned);
      });
  });

  it("Status 404: user name di not match in user table", () => {
    const comment = {
      username: "Abdul",
      body: "Good morning",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  it("Status 404: article_id not found", () => {
    const comment = {
      username: "butter_bridge",
      body: "Good morning ",
    };
    return request(app)
      .post("/api/articles/299996999/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  it("Status 400: the new post doesnot have username key word", () => {
    const comment = {
      hello: "bainesface",
      body: " Hello there",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  it("Status 400: the new post doesnot have body key word", () => {
    const comment = {
      username: "butter_bridge",
      hello: " Hello there",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  it("Status 400: the new post does not have username value", () => {
    const comment = {
      username: "",
      body: " Hello there",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  it("Status 400: the new post does not have body value", () => {
    const comment = {
      username: "butter_bridge",
      body: "",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
