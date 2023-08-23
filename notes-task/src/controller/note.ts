import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Note } from "../model/note";

//Create note request
export async function createNote(req: Request | any, res: Response) {
  try {
    // To get id of user creating note
    const verified = req.userKey;
    const id = uuidv4();
    // const { title, description, dueDate, status } = req.body;

    const newNote = await Note.create({
      id,
      //next line is the same as listing all the values in req.body but using the spread method makes the code more optimized.
      ...req.body,
      userId: verified.id,
    });

    res.status(201).json({
      data: {
        newNote,
      },
    });
  } catch (err) {
    console.log(err);
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
  const note = await Note.findOne({ where: { id: id } });
  const update = req.body;

  if (note) {
    Object.assign(note, { ...note, ...update });
    await note.save();
    return res.redirect(200, `/note/${id}`);
  } else {
    res.json({ msg: "Note not found" });
  }
}

// Delete request
export async function deleteNote(req: Request, res: Response) {
  const id = req.params.id;
  const note = await Note.findOne({ where: { id: id } });
  if (note) {
    await note.deleteOne();
    res.json({ msg: "Note deleted" });
  } else {
    res.status(404).send("Note not found");
  }
}
