# News API

## What is it about!

It is a backend api server, serves a news website, written with node.js, fully tested with jest testing framework, coded as a project for the backend part of [Northcoders](https://northcoders.com/) course, wich they mentored me during this project. It provids you with several endpoints wich you can see a description for what they proived through visiting [this Hosted version api ](https://redcar-news.herokuapp.com/api).

---

## Set up

If you would like to develop or localy run this project you need some steps to do befor you can do so.

### 1- cloning

clone this repo to your local machin

### 2- installation

Start with installing the backeges by `npm i` in your termenal. this should instal the following backages:

```
    "dotenv": "^16.0.0",
    "express": "^4.18.1",
    "jest-sorted": "^1.0.14",
    "pg": "^8.7.3",
    "supertest": "^6.2.3"
```

if there were any missing backege in your dependencies you need to install it manually you can run `npm run missing-package `

### 3- environment

Then you need to set up your environment to connect to the
desired Database.
You can do so by creating `.env.development` and `.env.test` files.
In those files the dev one you need to assign the database to your data base name.

```
PGDATABASE=database_name_here
```

and the in env.test file

```
PGDATABASE=database_name_here_test
```

There is a file `.env-example` has an example of doing that you can go back to if you needed.

Be aware that the `env` file will be ingored so won't be pushed to github.

#### jest

To run tests you need to install jest framework && supertest library wich is they used in this project, so you need to run

```
npm i -D jest-sorted
npm i -D supertest
```

---

### -4 Running

Now you are all set up and ready to start piulding and testing your development but you need to run commands to stablish run your database in your machin.

```
npm run setup-dbs
npm run seed

```

## You are Good To Go

Now to ensure all works as it should
run a test to

`npm test `
You should see Lovely 51 tests green passed from 2 files.

## Minimum verions

You need to upgrade Your node or psql if they are lower than

Node v18.1.0
Psql 14.2

# ENJOY
