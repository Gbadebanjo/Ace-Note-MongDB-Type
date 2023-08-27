"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const note_1 = require("../controller/note");
const router = express_1.default.Router();
/* GET home page. */
router.get('/', note_1.getAllNotes);
// View a note
router.get('/:id/info', note_1.viewNote);
//update Notes
router.post('/:id/update', note_1.updateNote);
//Create note
router.post('/createNote', note_1.createNote);
router.get('/createNote', note_1.createNote);
//Delete Note
router.post('/:id/delete', note_1.deleteNote);
exports.default = router;
