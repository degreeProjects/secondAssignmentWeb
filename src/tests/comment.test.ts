process.env.JWT_EXPIRATION = "4s";

import request from "supertest";
import mongoose from "mongoose";
import { Express } from "express";
import { initApp } from "../app";
import { CommentModel } from "../models/commentModel";
import { CommentRepository } from "../repositories/commentRepository";

let app: Express;

interface ICommentPayload {
  content: string;
  post: string;
  sender: string;
}

const comment: ICommentPayload = {
  content: "Wow very nice!",
  post: "693998e388a971e1ea9d6636",
  sender: "693998e388a971e1ea9d6636",
};

beforeAll(async () => {
  app = await initApp();
  await CommentModel.deleteMany({ sender: comment.sender });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Comments tests", () => {
  test("Test create comment", async () => {
    const response = await request(app).post("/comments").send(comment);
    expect(response.statusCode).toBe(201);
  });

  test("Test create comment without content", async () => {
    const response = await request(app).post("/comments").send({
      post: comment.post,
      sender: comment.sender,
    });
    expect(response.statusCode).toBe(400);
  });

  test("Test create comment unexpected error", async () => {
    jest
      .spyOn(CommentRepository.prototype, "create")
      .mockRejectedValueOnce(new Error("DB error"));

    const response = await request(app).post("/comments").send(comment);

    expect(response.statusCode).toBe(500);
  });

  test("Test getAll comments", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
  });

  test("Test getAll unexpected error", async () => {
    jest
      .spyOn(CommentRepository.prototype, "getAll")
      .mockRejectedValueOnce(new Error("DB error"));

    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(500);
  });

  test("Test getById comment", async () => {
    const resCreateComment = await request(app).post("/comments").send(comment);
    const response = await request(app).get(
      `/comments/${resCreateComment.body._id}`
    );
    expect(resCreateComment.statusCode).toBe(201);
    expect(response.statusCode).toBe(200);
  });

  test("Test getById not existing", async () => {
    const response = await request(app).get("/comments/123");
    expect(response.statusCode).toBe(500);
  });

  test("Test getByPost", async () => {
    const response = await request(app).get(`/comments/post/${comment.post}`);
    expect(response.statusCode).toBe(200);
  });

  test("Test getByPost not existing", async () => {
    const response = await request(app).get(`/comments/post/123`);
    expect(response.statusCode).toBe(500);
  });

  test("Test getBySender", async () => {
    const response = await request(app).get(
      `/comments/sender/${comment.sender}`
    );
    expect(response.statusCode).toBe(200);
  });

  test("Test getBySender not existing", async () => {
    const response = await request(app).get(`/comments/sender/123`);
    expect(response.statusCode).toBe(500);
  });

  test("Test update comment", async () => {
    const resCreateComment = await request(app).post("/comments").send(comment);
    const response = await request(app)
      .put(`/comments/${resCreateComment.body._id}`)
      .send({ content: "Updated comment" });
    expect(resCreateComment.statusCode).toBe(201);
    expect(response.statusCode).toBe(200);
  });

  test("Test update comment with not existing id", async () => {
    const response = await request(app)
      .put(`/comments/123`)
      .send({ content: "Updated comment" });
    expect(response.statusCode).toBe(500);
  });

  test("Test delete comment", async () => {
    const resCreateComment = await request(app).post("/comments").send(comment);
    const response = await request(app).delete(
      `/comments/${resCreateComment.body._id}`
    );
    expect(resCreateComment.statusCode).toBe(201);
    expect(response.statusCode).toBe(200);
  });

  test("Test delete comment with not existing id", async () => {
    const response = await request(app).delete(`/comments/123`);
    expect(response.statusCode).toBe(500);
  });
});
