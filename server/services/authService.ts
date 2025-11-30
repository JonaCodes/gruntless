import { supabase } from '../utils/general';
import User from '../models/user';

export class AuthService {
  static async signUpWithEmail(email: string, password: string) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          provider: 'email',
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user data returned');

    // Create user in our database
    const user = await User.create({
      supabaseId: authData.user.id,
      email: authData.user.email!,
      provider: 'email',
    });

    return user;
  }

  static async signInWithEmail(email: string, password: string) {
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user data returned');

    // Update or create user in our database
    const [user] = await User.findOrCreate({
      where: { supabaseId: authData.user.id },
      defaults: {
        email: authData.user.email!,
        provider: 'email',
      },
    });

    await user.update({ lastLogin: new Date() });
    return user;
  }

  static async signInWithProvider(provider: 'google' | 'apple', token: string) {
    const { data: authData, error: authError } =
      await supabase.auth.signInWithIdToken({
        provider,
        token,
      });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user data returned');

    // Update or create user in our database
    const [user] = await User.findOrCreate({
      where: { supabaseId: authData.user.id },
      defaults: {
        email: authData.user.email!,
        fullName: authData.user.user_metadata.full_name,
        avatarUrl: authData.user.user_metadata.avatar_url,
        provider,
      },
    });

    await user.update({ lastLogin: new Date() });
    return user;
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  static async getCurrentUser(token: string) {
    const {
      data: { user: authUser },
      error,
    } = await supabase.auth.getUser(token);

    if (error) throw error;
    if (!authUser) return null;

    const [user] = await User.findOrCreate({
      where: { supabaseId: authUser.id },
      defaults: {
        email: authUser.email!,
        fullName: authUser.user_metadata.full_name,
        avatarUrl: authUser.user_metadata.avatar_url,
        provider: authUser.app_metadata.provider,
        lastLogin: new Date(),
      },
    });

    await user.update({ lastLogin: new Date() });
    return user;
  }
}
