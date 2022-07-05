const request = require("supertest");
const app = require("../app");

const db = require("../db/connection.js");
const bcrypt = require("bcrypt");

const seed = require("../db/seeds/seed.js");

const testData = require("../db/data/test-data");
const { updateComment } = require("../models/comments.models");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => db.end());

describe("GET api", () => {
  test("Status 200", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(expect.objectContaining({}));
      });
  });
});
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
describe("Post /api/users/register", () => {
  it("status:201, takes a username, name, avatar_url, email, password and respond with the new created user", () => {
    const newUser = {
      username: "dfdj",
      name: "abddul",
      avatar_url: "any",
      email: "abdul@gmail.com",
      password: "123",
    };
    const returned = {
      username: "dfdj",
      name: "abddul",
      email: "abdul@gmail.com",
    };
    return request(app)
      .post("/api/users/register")
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        const { createdUser } = body;
        expect(body).toEqual(returned);
      });
  });
});
describe("GET /api/users/login", () => {
  // it.only("Status:200 ; responds wiht an object of the name given", async () => {
  //   // const he = async () => {
  //   //   const hashedPasswrod = await bcrypt.hash("rogersop", 10);
  //   // };
  //   // he();
  //   const userTryingToLogin = {
  //     username: "butter_bridge",
  //     password: "",
  //   };
  //   const returned = {
  //     username: "dfdj",
  //     name: "abddul",
  //     email: "abdul@gmail.com",
  //   };
  //   return request(app)
  //     .post("/api/users/login")
  //     .send(userTryingToLogin)
  //     .expect(200)
  //     .then(({ body }) => {
  //       console.log(body);
  //       const user = body;
  //       expect(user).toBeInstanceOf(Object);
  //       expect(user).toEqual({
  //         username: "rogersop",
  //         name: "paul",
  //         avatar_url:
  //           "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
  //         email: null,
  //         password: null,
  //       });
  //     });
  // });

  it("status:400, Returns a bad request message when paased an invalid name", () => {
    return request(app)
      .get("/api/users/true")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  it("status:400, Returns a bad request message when paased an invalid name type", () => {
    return request(app)
      .get("/api/users/{}")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});
describe("GET /api/articels", () => {
  it("status:200, returns  all the articles ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.articles).toHaveLength(10);
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
  it("status:200, returns all the articles sorted by date by default ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles).toHaveLength(10);
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  it("status:200, returns all the articles limited to 10, sorted by created_at and in descending order by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles).toHaveLength(10);
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  it("status:200 , returns the page requested and the limit in the query", () => {
    return request(app)
      .get("/api/articles?limit=5&page=1")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles).toHaveLength(5);
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  it("status:200 , returns the page requested and the limit in the query", () => {
    return request(app)
      .get("/api/articles?page=2")
      .expect(200)
      .then(({ body }) => {
        // Got back to because all the articles are 12 and we requested the second page
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles).toHaveLength(2);
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  it("status:400 , returns bad request when sending not a number for the limit or the page", () => {
    return request(app)
      .get("/api/articles?limit=word&page=string")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  it("status:400 , returns Not found if requested a page not found", () => {
    return request(app)
      .get("/api/articles?limit=20&page=20")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  it("status:200, returns all the articles sorted by order query ", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles).toHaveLength(10);
        expect(body.articles).toBeSortedBy("created_at", {
          descending: false,
        });
      });
  });
  it("status:200, returns all the articles sorted by votes query ", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles).toHaveLength(10);
        expect(body.articles).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });
  it("status:200, returns all the articles sorted by votes query and order query together ", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles).toHaveLength(10);
        expect(body.articles).toBeSortedBy("votes", {
          descending: false,
        });
      });
  });
  it("status:200, returns all the articles sorted by article_id query and order query together ", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles).toHaveLength(10);
        expect(body.articles).toBeSortedBy("article_id", {
          descending: false,
        });
      });
  });
  it("status:400, returns bad request msg when passing wrong unvalid sort by query ", () => {
    return request(app)
      .get("/api/articles?sort_by=articlexx_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  it("status:400, returns bad request msg when passing wrong unvalid order query  ", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=worm")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  it("status:200, returns the topics matches the query  ", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=asc&topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body.articles).toHaveLength(10);
      });
  });
  it("status:400, returns bad request if the topic qery did not match any topic", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=asc&topic=lllll")
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
  it("Status:200; responds with limit and page queries ", () => {
    return request(app)
      .get("/api/articles/3/comments?limit=1&page=1")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(1);
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
  it("Status 400: responds with bad requset when passing invalid limit or page not numper", () => {
    return request(app)
      .get("/api/articles/3/comments?limit=hello&page=string")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  it("Status 404: responds whith not found when passing an unfound page ", () => {
    return request(app)
      .get("/api/articles/3/comments?limit=20&page=90")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
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
        const { newComment } = body;
        expect(newComment).toEqual(returned);
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
describe("DELETE api/comments/:comment_id", () => {
  test("Status 204: Deletes the commetnt with givein id ", () => {
    return request(app)
      .delete("/api/comments/2")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("Status 404: return not found message when passing a comment id not found", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body }) => expect(body.msg).toBe("Not found"));
  });
  test("status 400: return bad request when passing unvalid id type", () => {
    return request(app)
      .delete("/api/comments/hello")
      .expect(400)
      .then(({ body }) => expect(body.msg).toBe("bad request"));
  });
});
describe("Patch /api/comments/:comment_id", () => {
  it("Status:200. Decrements the inc_votes by -1 and reutns the updated comment", () => {
    return request(app)
      .patch("/api/comments/17")
      .send({ inc_votes: -1 })
      .expect(200)
      .then(({ body }) => {
        const { updatedComment } = body;
        expect(updatedComment).toEqual({
          comment_id: 17,
          body: "The owls are not what they seem.",
          article_id: 9,
          author: "icellusedkars",
          votes: 19,
          created_at: "2020-03-14T17:02:00.000Z",
        });
      });
  });
  it("Status:200. Incremetns the inc_votes by 1 and reutn the updated comment", () => {
    return request(app)
      .patch("/api/comments/17")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        const { updatedComment } = body;
        expect(updatedComment).toEqual({
          comment_id: 17,
          body: "The owls are not what they seem.",
          article_id: 9,
          author: "icellusedkars",
          votes: 21,
          created_at: "2020-03-14T17:02:00.000Z",
        });
      });
  });
  it("Status:400. return bad request mesage when the no inc key", () => {
    return request(app)
      .patch("/api/comments/17")
      .send({ Abdul: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  it("Status:400. return bad request message when inc_votes not 1 or -1", () => {
    return request(app)
      .patch("/api/comments/17")
      .send({ inc_votes: 8 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  it("Status:404. return Not found message when no commetn id match", () => {
    return request(app)
      .patch("/api/comments/1010101010")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  it("Status:404. return bad message when passing an invaled Id type", () => {
    return request(app)
      .patch("/api/comments/jdjdj")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
describe("Post /api/articles", () => {
  it("Status:201: creates a new article and returns the new created article ", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "Z",
      body: "I'm the new article.",
      topic: "mitch",
    };
    const returned = {
      author: "butter_bridge",
      title: "Z",
      body: "I'm the new article.",
      topic: "mitch",
      article_id: 13,
      votes: 0,
      comment_count: "0",
      created_at: expect.any(String),
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        const { createdArticle } = body;
        expect(createdArticle[0]).toEqual(returned);
      });
  });
  it("Status: 400; respods with a bad request msg if one of the keys is not valied", () => {
    const newArticle = {
      hello: "icellusedkars",
      title: "Z",
      body: "I'm the new article.",
      topic: "mitch",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  it("Status: 404; respods with a not found msg if no such user in users data base", () => {
    const newArticle = {
      author: "Abdul",
      title: "Z",
      body: "I'm the new article.",
      topic: "mitch",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Username Not found !");
      });
  });
  it("Status: 404; respods with a not found msg if no such topic ", () => {
    const newArticle = {
      author: "Abdul",
      title: "Z",
      body: "I'm the new article.",
      topic: "helllo",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Username Not found !");
      });
  });
});
describe("Patch: /api/articles/3", () => {
  it("should return the  newly updated artilce ", () => {
    const newArticle = {
      title: "Z",
      body: "I'm the Un updated articles article.",
      topic: "mitch",
    };
    return request(app)
      .put("/api/articles/3")
      .send(newArticle)
      .expect(200)
      .then(({ body }) => {
        expect(body.article[0]).toEqual({
          article_id: 3,
          title: "Z",
          topic: "mitch",
          author: "icellusedkars",
          body: "I'm the Un updated articles article.",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
        });
      });
  });
});
