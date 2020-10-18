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
      toke: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
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

export { authUser, getUserProfile };
