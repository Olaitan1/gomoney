import  { Request, Response } from 'express'
import User  from '../model/user.model';
import bcrypt from 'bcrypt';

import { GeneratePassword, GenerateSalt,GenerateToken, option, registerSchema, loginSchema,  } from '../utils/utility';







export const RegisterUser = async (req: Request, res: Response) =>
{
    try
    {
        const { email, username, phone, password } = req.body
        const validateRegister = registerSchema.validate(req.body, option);
        if (validateRegister.error)
        {
            return res
                .status(400)
                .json({ Error: validateRegister.error.details[0].message });
        }
        //Generate salt
        const salt = await GenerateSalt(10);
        //Encrypting password
        const userPassword = await GeneratePassword(password, salt);
        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (user)
        {
            if (user.username === username)
            {
                return res.status(400).json({ Error: "Username already exists" });
            }
            if (user.email === email)
            {
                return res.status(400).json({ Error: "User email already exists" });
            }
        }

        //create user
        const newUser = await User.create({
            username,
            email,
            phone,
            password: userPassword,
            role: "user"
        })
        return res.status(201).json(
            {
                message: "User created successfully",
                newUser: newUser
            }
            
        )
        
    } catch (error)
    {
        res.status(500).json(error)
        console.log(error)
    }
};


export const userLogin = async (req:Request, res:Response) => {
  try {
    const { email, password } = req.body
        const validateRegister = loginSchema.validate(req.body, option);
        if (validateRegister.error)
        {
            return res
                .status(400)
                .json({ Error: validateRegister.error.details[0].message });
        }
    // Find the user by email
    const user = await User.findOne({ email });
    
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "Not a registered User" });
    }
    
    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    
    // Generate and return a token if the login is successful
      const token = await GenerateToken({
          id: user.id,
          email: user.email,
          role: '',
          
      });
    res.status(200).json({ token , user});
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};