import { Router } from "express";
import commentController from "../controllers/commentController";

const router = Router();

router.get("/", commentController.getAll.bind(commentController));
router.get("/post/:postId", commentController.getByPost.bind(commentController));
router.get("/sender/:senderId", commentController.getBySender.bind(commentController));
router.get("/:id", commentController.getById.bind(commentController));
router.post("/", commentController.create.bind(commentController));
router.put("/:id", commentController.update.bind(commentController));
router.delete("/:id", commentController.delete.bind(commentController));

export default router;
