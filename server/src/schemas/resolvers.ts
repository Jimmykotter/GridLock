import { Profile } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';

interface Profile {
  _id: string;
  name: string;
  email: string;
  password: string;
  record: Array<{
    wins: number;
    loses: number;
  }>;
}

interface ProfileArgs {
  profileId: string;
}

interface AddProfileArgs {
  input:{
    name: string;
    email: string;
    password: string;
  }
}

interface AddRecordArgs {
  profileId: string;
  record: string;
}

interface RemoveRecordArgs {
  profileId: string;
  record: string;
}

interface Context {
  user?: Profile;
}

const resolvers = {
  Query: {
    profiles: async (): Promise<Profile[]> => {
      return await Profile.find();
    },
    profile: async (_parent: any, { profileId }: ProfileArgs): Promise<Profile | null> => {
      return await Profile.findOne({ _id: profileId });
    },
    me: async (_parent: any, _args: any, context: Context): Promise<Profile | null> => {
      if (context.user) {
        return await Profile.findOne({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
  },
  Mutation: {
    addProfile: async (_parent: any, { input }: AddProfileArgs): Promise<{ token: string; profile: Profile }> => {
      const profile = await Profile.create({ ...input });
      const token = signToken(profile.name, profile.email, profile._id);
      return { token, profile };
    },
    login: async (_parent: any, { email, password }: { email: string; password: string }): Promise<{ token: string; profile: Profile }> => {
      const profile = await Profile.findOne({ email });
      if (!profile) {
        throw AuthenticationError;
      }
      const correctPw = await profile.isCorrectPassword(password);
      if (!correctPw) {
        throw AuthenticationError;
      }
      const token = signToken(profile.name, profile.email, profile._id);
      return { token, profile };
    },
    addrecord: async (_parent: any, { profileId, record }: AddRecordArgs, context: Context): Promise<Profile | null> => {
      if (context.user) {
        return await Profile.findOneAndUpdate(
          { _id: profileId },
          {
            $addToSet: { records: record },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw AuthenticationError;
    },
    removeProfile: async (_parent: any, _args: any, context: Context): Promise<Profile | null> => {
      if (context.user) {
        return await Profile.findOneAndDelete({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
    removerecord: async (_parent: any, { record }: RemoveRecordArgs, context: Context): Promise<Profile | null> => {
      if (context.user) {
        return await Profile.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { record: record} },
          { new: true }
        );
      }
      throw AuthenticationError;
    },
  },
};

export default resolvers;
