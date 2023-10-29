import {User} from "../model/user.model";
import {authPayload} from "../interface/";

export const createUser = async (user: any): Promise<authPayload | null> => {
  const newUser: authPayload | any = await User.create(user);
  return newUser;
};

export const getUserByEmail = async (
  email: string,
): Promise<authPayload | null> => {
  try {
    const user: authPayload | any = await User.findOne({ email }).exec();
    return user;
  } catch (error) {
    throw new Error("Failed to fetch user by email");
  }
};
