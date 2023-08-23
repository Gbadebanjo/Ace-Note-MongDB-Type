"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersNote = exports.dashboard = exports.updateUser = exports.deleteUser = exports.displayAllUsers = exports.login = exports.register = void 0;
const user_1 = require("../model/user");
const note_1 = require("../model/note");
const utils_1 = require("../utils/utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtsecret = process.env.JWT_SECRET;
//Register or Register an Admin
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const isAdmin = req.url === "/register-admin";
        try {
            if (isAdmin) {
                const admin = yield user_1.User.find({ where: { isAdmin } });
                if (admin.length > 0) {
                    return res.status(400).json({ message: "admin already exist!" });
                }
            }
            //Validate with Joi
            const validationResult = utils_1.signupUserSchema.validate(req.body, utils_1.options);
            if (validationResult.error) {
                return res.status(400).json({ Error: validationResult.error.details[0].message });
            }
            //Check if user exist in database
            const { email, password } = req.body;
            const user = yield user_1.User.findOne({ where: { email } });
            if (user) {
                return res.json({ message: "email already exist" });
            }
            //Hash password
            const passwordHarsh = yield bcryptjs_1.default.hash(password, 10);
            const newUser = yield user_1.User.create(Object.assign(Object.assign({}, req.body), { password: passwordHarsh, 
                // id: uuidv4(),
                isAdmin }));
            // res.json({msg: 'registered!', newUser})
            return res.redirect('/login');
        }
        catch (error) {
            res.render('error', { error, message: error.message });
            // res.status(500).json({
            //   message: "failed to signup user",
            // });
        }
    });
}
exports.register = register;
//Login User
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('calling login controller');
        try {
            //Validate with Joi
            const validationResult = utils_1.loginUserSchema.validate(req.body, utils_1.options);
            if (validationResult.error) {
                return res.status(400).json({ Error: validationResult.error.details[0].message });
            }
            // To find a user by email
            const { email, password } = req.body;
            const user = (yield user_1.User.findOne({ email }));
            console.log('i got here');
            console.log(user);
            if (!user) {
                return res.status(400).json({ message: "Invalid login details" });
            }
            // console.log(user.password)
            // Compare the provided password with the hashed password in the database
            const validUser = yield bcryptjs_1.default.compare(password, user.password);
            if (!validUser) {
                return res.status(400).json({ Error: "Invalid email/password" });
            }
            //give user a token after successful login
            const { id } = user;
            const expiresIn = 3 * 60 * 60; //seconds
            const token = jsonwebtoken_1.default.sign({ id, isAdmin: user.isAdmin }, jwtsecret, { expiresIn });
            //save token as a cookie
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: expiresIn * 1000, // in milliseconds
            });
            console.log(req.cookies);
            // return res.json({message: 'login', user, token})
            return res.redirect("/users/dashboard");
        }
        catch (error) {
            res.status(500).render('error', { message: error.message, error });
        }
    });
}
exports.login = login;
// Display allUsers
function displayAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let allUsers = yield user_1.User.find();
        res.status(201).json({
            data: {
                allUsers,
            },
        });
    });
}
exports.displayAllUsers = displayAllUsers;
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const user = yield user_1.User.findOne({ where: { id: id } });
        if (user) {
            yield user.deleteOne();
            res.json({ msg: "User deleted" });
        }
        else {
            res.status(404).send("User not found");
        }
    });
}
exports.deleteUser = deleteUser;
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const user = yield user_1.User.findOne({ where: { id: id } });
        const updates = req.body;
        if (user) {
            Object.assign(user, Object.assign(Object.assign({}, user), updates));
            yield user.save();
            return res.redirect(200, `/user/${id}`);
        }
        else {
            res.json({ msg: "User not found" });
        }
    });
}
exports.updateUser = updateUser;
//Dashboard controller
function dashboard(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(req.userKey.id);
        const usersNote = yield getNotesById(req.userKey.id);
        res.render("Dashboard", {
            username: req.userKey.user.username,
            usersNote
        });
    });
}
exports.dashboard = dashboard;
// GET user's notes
function usersNote(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.userKey.user.id;
            // Find all notes associated with the user
            const userNotes = yield note_1.Note.find({
                where: { userId },
            });
            res.status(200).json(userNotes);
        }
        catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    });
}
exports.usersNote = usersNote;
;
function getNotesById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const notes = yield note_1.Note.find({ userId: id });
        console.log(notes);
        return notes;
    });
}
