import express from 'express';
import { createNote, deleteNote, getAllNotes, updateNote, viewNote } from '../controller/note';
import { dashboard, deleteUser,displayAllUsers, usersNote, updateUser } from "../controller/user";

import { auth } from "../middlewares/auth"
const router = express.Router();

/* GET home page. */
router.get('/', getAllNotes );

// View a note
router.get('/:id/info', viewNote)

//update Notes
router.post('/:id/update', updateNote );

//Create note
router.post('/createNote', createNote );
router.get('/createNote', createNote );

//Delete Note
router.post('/:id/delete', deleteNote);


export default router;