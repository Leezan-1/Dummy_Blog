# Blog Web Application

## Table of Contents
1. [Introduction](#introduction)
2. [Project Overview](#project-overview)
3. [Features](#features)
4. [Technology Stack](#technology-stack)
5. [Database Modeling](#database-modeling)
5. [API End Points](#api-endpoints)
6. [Challenges and Solutions](#challenges-and-solutions)
7. [Future Enhancements](#future-enhancements)
8. [Conclusions](#conclusions)

## Introduction
The web application project document highlights the development journey of this project. This project is made with Express.js, framework of Node.js. This project is a blog web application inspired by Medium. The goal of this project is to create a platform where user can login and start blogging their ideas. Working as an intern in a software company, this is my first professional project. So, this document records my thought process, challenges, brainstroming the solution.

## Project Overview
The blog web application is a RESTful API (till now), that allows users to:
1. Register and authenticate users.
2. Create and manage blog post with images and tags.
3. Perform CRUD operation on blog post.
4. View all and single blog post.

## Features
    User Authentication: Users can register, log in, and log out.

    Blog Management: Authenticated users can create, read, update, and delete blog posts.

    Pagination: Blog posts are paginated for better performance.

    Error Handling: Custom error handling middleware for better debugging.

    Validation: Input validation for user registration and blog creation.

## Technology Stack
    Backend: Node.js and Express.js
    Database: MySQL
    Authentication: Password hashing(for user login), JWT(for  sessions)
    API testing: Postman
    Version Control: Git

## Database Modeling
![ERD Diagrama](./images/Blog%20ERD.png)

## API Endpoints

#### User Authentication APIs
| Method | Endpoint          | Description                  |
|--------|-------------------|------------------------------|
| POST   | `/auth/signup` | Signs up a new user.     |
| POST   | `/auth/login` | Log in an existing user.     |
| GET   | `/auth/refresh-tokens` | Regenerates refresh tokens for an existing user.     |
| GET   | `/auth/logout/` | Logs out an session user.     |

#### Blog Post APIs
| Method | Endpoint          | Description                  |
|--------|-------------------|------------------------------|
| GET    |`/blogs`           | Get all blog posts.                          |
| GET    |`/blogs/:post_id`  | Get single blog posts with post's id.        |
| POST   |`/blogs/new-post`  | Creates a new blog posts.                    |
| PATCH  |`/blogs/:post_id`  | Update the existing blog posts.              |
| DELETE |`/blogs/:post_id`  | Delete single blog posts.                    |

## Challenges and Solutions
#### Challenges: Session Authentication
#### Challenges: 

## Future Enhancements

## Conclusions
This projects is being a valuable learning opportunity for backend web development.