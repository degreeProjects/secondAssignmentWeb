import PostController from "../controllers/postController";
import express from "express";

const router = express.Router();

router.get("/", PostController.getAll.bind(PostController));
router.get("/sender", PostController.getBySender.bind(PostController));
router.get("/:id", PostController.getById.bind(PostController));
router.post("/", PostController.create.bind(PostController));
router.put("/:id", PostController.update.bind(PostController));
router.delete("/:id", PostController.delete.bind(PostController));

export default router;
