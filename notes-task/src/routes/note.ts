import express from 'express';
import { createNote, deleteNote, getAllNotes, updateNote } from '../controller/note';
import { auth } from "../middlewares/auth"
const router = express.Router();

/* GET home page. */
router.get('/', getAllNotes );

//Create note
router.post('/createNote', createNote );


router.put('/update', updateNote );

router.delete('/delete', deleteNote)

export default router;