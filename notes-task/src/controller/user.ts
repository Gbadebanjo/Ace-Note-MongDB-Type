import { Request, Response } from "express";
import { User, } from "../model/user";
import { Note } from "../model/note";
import { signupUserSchema, options, loginUserSchema } from "../utils/utils";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const jwtsecret = process.env.JWT_SECRET as string;

//Register or Register an Admin
export async function register(req: Request, res: Response) {
  const isAdmin = req.url === "/register-admin";
  try {
    if (isAdmin) {
      const admin = await User.find({ where: { isAdmin } });
      if (admin.length > 0) {
        return res.status(400).json({ message: "admin already exist!" });
      }
    }

    //Validate with Joi
    const validationResult = signupUserSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({ Error: validationResult.error.details[0].message });
    }
    
    //Check if user exist in database
    const { email, password } = req.body;
    const user = await User.findOne({where: { email } });
    if (user) {
      return res.json({ message: "email already exist" });
    }
   
    //Hash password
    const passwordHarsh = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      ...req.body,
      password: passwordHarsh,
      // id: uuidv4(),
      isAdmin,
    });
    // res.json({msg: 'registered!', newUser})
    return res.redirect('/login');
  } catch (error: any) {
    res.render('error', { error, message: error.message})
    // res.status(500).json({
      //   message: "failed to signup user",
      // });
    }
  }
  
  //Login User
  export async function login(req: Request, res: Response) {
    console.log('calling login controller')
    try {
       //Validate with Joi
      const validationResult = loginUserSchema.validate(req.body, options);
      if (validationResult.error) {
        return res.status(400).json({ Error: validationResult.error.details[0].message });
      }
      // To find a user by email
      const { email, password } = req.body;
      const user = (await User.findOne({ email }))
      console.log('i got here')
      console.log(user)

      if (!user) {
        return res.status(400).json({ message: "Invalid login details" });
      }
      
      // console.log(user.password)
      // Compare the provided password with the hashed password in the database
      const validUser = await bcrypt.compare(password, user.password);
      if (!validUser) {
        return res.status(400).json({ Error: "Invalid email/password" });
      }
  
      //give user a token after successful login
      const { id } = user;
      const expiresIn = 3 * 60 * 60; //seconds
      const token = jwt.sign({ id, isAdmin: user.isAdmin }, jwtsecret, { expiresIn });
  
      //save token as a cookie
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: expiresIn * 1000,  // in milliseconds
      });
  
      console.log(req.cookies);
      // return res.json({message: 'login', user, token})
     return res.redirect("/users/dashboard");
    } catch (error: any) {
      res.status(500).render('error', { message: error.message, error });
    }
  }

// Display allUsers
  export async function displayAllUsers(req: Request, res: Response) {
  let allUsers = await User.find();
  res.status(201).json({
    data: {
      allUsers,
    },
  });
}


export async function deleteUser(req: Request, res: Response) {
  const id = req.params.id;
  const user = await User.findOne({ where: { id: id } });
  if (user) {
    await user.deleteOne();
    res.json({ msg: "User deleted" });
  } else {
    res.status(404).send("User not found");
  }
}

export async function updateUser(req: Request, res: Response) {
  const id = req.params.id;
  const user = await User.findOne({ where: { id: id } });
  const updates = req.body;

  if (user) {
    Object.assign(user, { ...user, ...updates });
    await user.save();
    return res.redirect(200, `/user/${id}`);
  } else {
    res.json({ msg: "User not found" });
  }
}




//Dashboard controller
export async  function dashboard(req: Request, res: Response) {  
  console.log('calling dashboard...')
  // console.log(req.userKey.id)
  const usersNote = await getNotesById(req.userKey.id);
  res.render("Dashboard", {
   username: req.userKey.user.username,
   userId: req.userKey.id,
   usersNote
  })
}

// GET user's notes
export async function usersNote(req: Request, res: Response) {
  try {
    const userId = req.userKey.user.id;
    // Find all notes associated with the user
    const userNotes = await Note.find({
      where: { userId }, 
    });

    res.status(200).json(userNotes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

async function getNotesById(id:string){
  const notes = await Note.find({userId: id});
  console.log(notes)
  return notes
}

