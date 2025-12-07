import User from '../models/user';
import Account from '../models/account';
import { User as SupabaseUser } from '@supabase/supabase-js';

export async function ensureUserExists(
  supabaseUser: SupabaseUser,
  provider?: string
): Promise<User> {
  const userInfo = {
    email: supabaseUser.email!,
    fullName: supabaseUser.user_metadata.full_name,
    avatarUrl: supabaseUser.user_metadata.avatar_url,
    provider: provider || supabaseUser.app_metadata.provider || 'email',
  };

  let user = await User.findOne({
    where: { supabaseId: supabaseUser.id },
  });

  if (!user) {
    // Always create a new account for a new user for now, until we have actual accounts
    const newAccount = await Account.create({
      name: userInfo.fullName || userInfo.email.split('@')[0],
      primaryContactEmail: userInfo.email,
      provider: userInfo.provider,
    });

    user = await User.create({
      supabaseId: supabaseUser.id,
      email: userInfo.email,
      fullName: userInfo.fullName,
      avatarUrl: userInfo.avatarUrl,
      provider: userInfo.provider,
      accountId: newAccount.id,
      lastLogin: new Date(),
    });
  } else {
    const tenMinutesAgo = new Date();
    tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);

    if (user.lastLogin.getTime() < tenMinutesAgo.getTime()) {
      await user.update({
        email: userInfo.email,
        fullName: userInfo.fullName,
        avatarUrl: userInfo.avatarUrl,
        provider: userInfo.provider,
        lastLogin: new Date(),
      });
    }
  }

  return user;
}
