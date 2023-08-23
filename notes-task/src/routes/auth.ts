import express, { Request, Response, NextFunction } from "express";
import { register,login } from "../controller/user";

const router = express.Router();

// users registration
router.post("/register", register);

// users login
router.post("/login", login);

//users logout
router.get("/users/dashboard/logout",(req, res) => {
    res.send('logging out...');
})



export default router;
