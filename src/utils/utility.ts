import Joi, { string } from "joi";
import bcrypt from 'bcrypt';
import jwt, {JwtPayload} from 'jsonwebtoken'
import { appSecret } from "../config";
import  {authPayload}  from "../interface/";


export const registerSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
    confirm_password: Joi.any()
        .required()
        .valid(Joi.ref("password"))
        .label("confirm password")
        .messages({ "any.only": "passwords do not match" }),
    //.messages({ "any.only": "{{#label}} does not match with password" }),
});
export const teamSchema = Joi.object({
    teamName: Joi.string().min(3).required(),
    sport: Joi.string().min(3).required(),
    homeCity: Joi.string().min(3).required(),
    homeStadium: Joi.string().min(3).required(),
    country: Joi.string().min(3).required(),
});
export const option = {
  abortEarly: false,
  errors: {
    wrap: {
      label: ''
    }
  }
};





export const GenerateSalt = async (rounds: number) =>
{
  const salt = await bcrypt.genSalt(rounds);
  return salt;
};

export const GeneratePassword = async (password: string, salt: string) =>
{
  const hash = await bcrypt.hash(password, salt);
  return hash;
};


export const GenerateToken = async (payload:authPayload) =>
{
  return jwt.sign(payload,  appSecret, {expiresIn: '1d'}) 
}


export const verifyToken = async (token: string) =>
{
  return jwt.verify(token, appSecret) as JwtPayload
}

export const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});


//password validation
export const validatePassword = async (inputPassword:string, savedPassword: string, salt:string) =>
{ 
  return await GeneratePassword(inputPassword, salt) === savedPassword
}

export const updateSchema = Joi.object().keys({
  address: Joi.string().required(), 
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().required()
});



export const Adminschema = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  address: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

