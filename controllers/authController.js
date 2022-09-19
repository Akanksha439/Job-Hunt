import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import {BadRequestError,UnAuthenticatedError} from '../errors/index.js'


const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError("Please provide all the values");
  }
  const userAlreadyExists = await User.findOne({email});
  if(userAlreadyExists){
    throw new BadRequestError('Email already in use');
  }
  //creating user
  const user = await User.create({ name, email, password });
  //go on postman and see generated token
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    location: user.location,
    user: {
      email: user.email,
      lastname: user.lastname,
      location: user.location,
      name: user.name,
    },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  //setting up token and sending back reponse
  const token = user.createJWT();
  //now again I don't want to send the password back to response so we will set it as undefined
  user.password = undefined;
  res.status(StatusCodes.OK).json({ user, token, location: user.location });
};

const updateUser = async (req, res) => {
  const { email, name, lastname, location } = req.body;
  if (!email || !name || !lastname || !location) {
    throw new BadRequestError("Please aka provide all values");
  }

  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.lastname = lastname;
  user.location = location;

  //instance method that is available on all the documents that is .save
  await user.save();

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user,
    token,
    location: user.location,
  });
};

export { register, login, updateUser };
