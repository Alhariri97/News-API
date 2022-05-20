# News API

## About this API

This is a backend API server which serves a news website. It's written in node.js and fully tested with the Jest testing framework,and was built as a project for the backend part of the [Northcoders](https://northcoders.com/) coding bootcamp. It provides several endpoints and you can read a description of these endpoints at: [this Hosted version api ](https://redcar-news.herokuapp.com/api).

---

## Setup

If you would like to further develop or locally run this project you will need to carry out these following steps:

### 1 - Cloning

Clone this repo to your local machine.

### 2 - Installation

Install the packages by typing `npm i` in your terminal. This should install the following packages:

```
    "dotenv": "^16.0.0",
    "express": "^4.18.1",
    "jest-sorted": "^1.0.14",
    "pg": "^8.7.3",
    "supertest": "^6.2.3"
```

If there were any missing packages in your dependencies you will need to install them manually. You can do this by typing `npm run missing-package `

### 3 - Environment

You will then need to set up your environment to connect to the desired database.

You can do this by creating `.env.development` and `.env.test` files.

In the .development file you need to assign the database to your data base name:

```
PGDATABASE=database_name_here
```

And then in your .test file:

```
PGDATABASE=database_name_here_test
```

There is a example file, `.env-example`, which provides an example of this. You do not need to add anything to this file.

The `env` file will be ignored and won't be pushed to github.

### 4 - Testing

To run the tests you need to install `jest` framework and `supertest` library which are used in this project:

```
npm i -D jest-sorted
npm i -D supertest
```

---

### 5 - Running

Now you are all set up and ready to start building and testing your development. First though you will need to build and seed your database:

```
npm run setup-dbs
npm run seed

```

## You are Good To Go!

Now to ensure everything works as it should, enter:

`npm test `

You should now be seeing 51 lovely green ticks which represent successful tests across 2 files.

## Minimum verions

You need to upgrade Your `node` or `psql` if they are lower than:

```
Node v18.1.0
Psql 14.2
```

# HAVE FUN :)
