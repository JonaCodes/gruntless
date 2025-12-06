import { supabase } from '../utils/general';
import User from '../models/user';
import { ensureUserExists } from '../utils/authHelpers';

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

    const user = await ensureUserExists(authData.user, provider);

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

    const user = await ensureUserExists(authUser);

    return user;
  }
}
