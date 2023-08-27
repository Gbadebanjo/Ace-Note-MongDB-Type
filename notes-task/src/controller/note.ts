import  { Request, Response } from "express";
import { Note } from "../model/note";
import { User, } from "../model/user";



export async function viewNote (req: Request, res: Response) {
  try {
    // console.log(req.params.id)

    const note = await Note.findById({ _id: req.params.id })
    // console.log(note)
    // console.log("bravo")

    if (note) {
      res.render('view-note', { 
        userId: note.userId,
        noteID: req.params.id,
        note,
        id: note._id
        // layout: '../views/view-note',
       });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  }
  catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};

//Create note request
export async function createNote(req: Request | any, res: Response) {
  console.log('calling create note...')
  if (req.method === 'GET') return res.render('create-note');
  try {
    // To get id of user creating note
    const verified = req.userKey;
    // console.log(verified)
    
    // const { title, description, dueDate, status } = req.body;

    const newNote = await Note.create({
    //next line is the same as listing all the values in req.body but using the spread method makes the code more optimized.
      ...req.body,
      userId: verified.id,
    });
    return res.redirect('/users/dashboard');


    
  } catch (err: any) {
    res.status(400).json({error: err.message});
  }
}

// Read note request
export async function getAllNotes(req: Request, res: Response) {
  try {
    let allNote = await Note.find();
    // A more advance method to the above => let allNote = await Note.findAndCountAll();
    res.status(201).json({
      data: {
        allNote,
      },
    });
  } catch (err) {
    console.log(err);
  }
}

// Update note request
export async function updateNote(req: Request, res: Response) {
  const id = req.params.id;
  const note = await Note.findOne({ _id: id });
  const update = req.body;
  if (note) {
    // Object.assign(note, update)
    Object.assign(note, { ...note, ...update });
    console.log('updated note: ', note)
    await note.save();
    // return res.redirect(200, `/note/${id}`);
    return res.redirect('/users/dashboard')
  } else {
    res.json({ msg: "Note not found" });
  }
}

// Delete request
export async function deleteNote(req: Request, res: Response) {
  const id = req.params.id;
  const note = await Note.findOne({ _id: id });
  if (note) {
    await note.deleteOne();
    res.redirect('/users/dashboard')
  } else {
    res.status(404).send("Note not found");
  }
}
