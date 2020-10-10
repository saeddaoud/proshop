import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admis User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456'),
    isAdmin: true,
  },
  {
    name: 'John',
    email: 'john@example.com',
    password: bcrypt.hashSync('123456'),
  },
  {
    name: 'Jane',
    email: 'jane@example.com',
    password: bcrypt.hashSync('123456'),
  },
];

export default users;
