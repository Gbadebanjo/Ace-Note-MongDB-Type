import express, { request } from "express";
import { dashboard, deleteUser,displayAllUsers, usersNote, updateUser } from "../controller/user";

const router = express.Router();

// /users/dashboard
router.get('/dashboard', dashboard);

// usersNote
router.get('/dashboard/:userId/notes', usersNote);

// /users/
router.get("/displayAllUsers", displayAllUsers);

router.delete("/:id", deleteUser);

router.put("/:id", updateUser);


export default router;
