process.env.JWT_EXPIRATION = "4s";

import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
import { initApp } from "../app";
import { PostModel } from "../models/postModel";
import { PostRepository } from "../repositories/postRepository";

let app: Express;

interface IPostPayload {
  description: string;
  location: string;
  sender: string;
}

const post: IPostPayload = {
  description: "This is my post description",
  location: "Tel Aviv",
  sender: "693998e388a971e1ea9d6636",
};

beforeAll(async () => {
  app = await initApp();
  await PostModel.deleteMany({ sender: post.sender });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Posts tests", () => {
  test("Test create post", async () => {
    const response = await request(app).post("/posts").send(post);
    expect(response.statusCode).toBe(201);
  });

  test("Test create post without description", async () => {
    const response = await request(app).post("/posts").send({
      location: post.location,
      sender: post.sender,
    });
    expect(response.statusCode).toBe(400);
  });

  test("Test create post unexpected error", async () => {
    jest
      .spyOn(PostRepository.prototype, "create")
      .mockRejectedValueOnce(new Error("DB error"));

    const response = await request(app).post("/posts").send(post);

    expect(response.statusCode).toBe(500);
  });

  test("Test getAll posts", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
  });

  test("Test getAll posts unexpected error", async () => {
    jest
      .spyOn(PostRepository.prototype, "getAll")
      .mockRejectedValueOnce(new Error("DB error"));

    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(500);
  });

  test("Test getById post", async () => {
    const resCreatePost = await request(app).post("/posts").send(post);
    const response = await request(app).get(`/posts/${resCreatePost.body._id}`);
    expect(resCreatePost.statusCode).toBe(201);
    expect(response.statusCode).toBe(200);
  });

  test("Test getById not existing", async () => {
    const response = await request(app).get("/posts/123");
    expect(response.statusCode).toBe(500);
  });

  test("Test getBySender", async () => {
    const response = await request(app).get(
      `/posts/sender?senderId=${post.sender}`
    );
    expect(response.statusCode).toBe(200);
  });

  test("Test getBySender without senderId", async () => {
    const response = await request(app).get(`/posts/sender`);
    expect(response.statusCode).toBe(400);
  });

  test("Test getBySender unexpected error", async () => {
    jest
      .spyOn(PostRepository.prototype, "getBySender")
      .mockRejectedValueOnce(new Error("DB error"));

    const response = await request(app).get(
      `/posts/sender?senderId=${post.sender}`
    );
    expect(response.statusCode).toBe(500);
  });

  test("Test update post", async () => {
    const resCreatedPost = await request(app).post("/posts").send(post);
    const response = await request(app)
      .put(`/posts/${resCreatedPost.body._id}`)
      .send({ description: "Updated post" });
    expect(resCreatedPost.statusCode).toBe(201);
    expect(response.statusCode).toBe(200);
  });

  test("Test update post with not existing id", async () => {
    const response = await request(app)
      .put(`/posts/123`)
      .send({ description: "Updated post" });
    expect(response.statusCode).toBe(500);
  });

  test("Test delete post", async () => {
    const resCreatedPost = await request(app).post("/posts").send(post);
    const response = await request(app).delete(
      `/posts/${resCreatedPost.body._id}`
    );
    expect(resCreatedPost.statusCode).toBe(201);
    expect(response.statusCode).toBe(200);
  });

  test("Test delete post with not existing id", async () => {
    const response = await request(app).delete(`/posts/123`);
    expect(response.statusCode).toBe(500);
  });
});
