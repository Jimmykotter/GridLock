import ProfileModel from '../models/Profile.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export const resolvers = {
  Query: {
    users: () => ProfileModel.find(),
    user: (_: any, { id }: { id: string }) => ProfileModel.findById(id),
    me: (_: any, __: any, { user }: { user: any }) => user,
  },

  Mutation: {
    signup: async (_: any, { name, email, password }: any) => {
      const hash = await bcrypt.hash(password, 10);
      const user = await ProfileModel.create({ name, email, password: hash, record: [] });
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      return { token, user };
    },

    login: async (_: any, { email, password }: any) => {
      const user = await ProfileModel.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
      }
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      return { token, user };
    },

    addResult: async (_: any, { userId, result }: any) => {
      const user = await ProfileModel.findById(userId);
      if (!user) throw new Error('User not found');
      user.record.push(result);
      await user.save();
      return user;
    },
  },
};

