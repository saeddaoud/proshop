import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

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
      toke: null,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

export { authUser };
