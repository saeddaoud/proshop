import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

//@route        POST /api/users/login
//@description  Auth user and get token
//@access       public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmis: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

//@route        POST /api/users
//@description  Register a new user
//@access       public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmis: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

//@route        GET /api/users/profile
//@description  Get user's profile
//@access       Private
const getUserProfile = asyncHandler(async (req, res) => {
  // res.send('success');
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmis: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not Found');
  }
});

export { authUser, registerUser, getUserProfile };
