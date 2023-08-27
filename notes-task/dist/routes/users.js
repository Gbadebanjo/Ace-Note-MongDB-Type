"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controller/user");
const router = express_1.default.Router();
// /users/dashboard
router.get('/dashboard', user_1.dashboard);
// usersNote
router.get('/dashboard/:userId/notes', user_1.usersNote);
// /users all users/
router.get("/displayAllUsers", user_1.displayAllUsers);
// Delete user
router.delete("/:id", user_1.deleteUser);
// Update user
router.put("/:id", user_1.updateUser);
exports.default = router;
