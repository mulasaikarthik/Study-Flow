import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types/user';

export type SignUpPayload = {
  fullName: string;
  email: string;
  password: string;
  university?: string;
  major?: string;
  academicYear?: string;
};

export type SignUpResult = {
  user: UserProfile | null;
  needsEmailConfirmation: boolean;
};

function getErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = String((error as { message: unknown }).message || '').trim();
    if (message) return message;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function mapAuthUser(user: User): UserProfile {
  const meta = user.user_metadata ?? {};
  const email = user.email ?? '';
  const fallbackName =
    (typeof meta.full_name === 'string' && meta.full_name.trim()) ||
    email.split('@')[0] ||
    'Student';

  return {
    id: user.id,
    fullName: fallbackName,
    email,
    avatarUrl:
      (typeof meta.avatar_url === 'string' && meta.avatar_url) ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=2563EB&color=fff`,
    university: typeof meta.university === 'string' ? meta.university : '',
    major: typeof meta.major === 'string' ? meta.major : '',
    academicYear:
      typeof meta.academic_year === 'string'
        ? meta.academic_year
        : typeof meta.academicYear === 'string'
          ? meta.academicYear
          : '',
    studentId:
      typeof meta.student_id === 'string'
        ? meta.student_id
        : `STU-${user.id.slice(0, 8).toUpperCase()}`,
    dailyStudyGoalMinutes: Number(meta.daily_study_goal_minutes) || 120,
    currentStreakDays: Number(meta.current_streak_days) || 0,
    notificationsEnabled: meta.notifications_enabled !== false,
    soundEnabled: meta.sound_enabled !== false,
    createdAt: user.created_at,
  };
}

export const authService = {
  async getSessionUser(): Promise<UserProfile | null> {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw new Error(getErrorMessage(error, 'Could not restore your session.'));
    }
    if (!data.session?.user) return null;
    return mapAuthUser(data.session.user);
  },

  async login(email: string, password: string): Promise<UserProfile> {
    if (!email || !email.includes('@')) {
      throw new Error('Please provide a valid university or personal email address.');
    }
    if (!password) {
      throw new Error('Please enter your password.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      throw new Error(getErrorMessage(error, 'Login failed. Please check your credentials.'));
    }
    if (!data.user || !data.session) {
      throw new Error('Login failed. No session was created.');
    }

    return mapAuthUser(data.user);
  },

  async signUp(payload: SignUpPayload): Promise<SignUpResult> {
    if (!payload.fullName.trim()) {
      throw new Error('Full name is required.');
    }
    if (!payload.email.trim() || !payload.email.includes('@')) {
      throw new Error('A valid email address is required.');
    }
    if (!payload.password || payload.password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const { data, error } = await supabase.auth.signUp({
      email: payload.email.trim(),
      password: payload.password,
      options: {
        data: {
          full_name: payload.fullName.trim(),
          university: payload.university || '',
          major: payload.major || '',
          academic_year: payload.academicYear || '',
          student_id: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
          daily_study_goal_minutes: 120,
          current_streak_days: 0,
          notifications_enabled: true,
          sound_enabled: true,
        },
      },
    });

    if (error) {
      throw new Error(getErrorMessage(error, 'Could not create your account.'));
    }

    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    if (!data.session || !data.user) {
      return {
        user: data.user ? mapAuthUser(data.user) : null,
        needsEmailConfirmation: true,
      };
    }

    return {
      user: mapAuthUser(data.user),
      needsEmailConfirmation: false,
    };
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const { data: current, error: currentError } = await supabase.auth.getUser();
    if (currentError) {
      throw new Error(getErrorMessage(currentError, 'Could not load your profile.'));
    }
    if (!current.user) {
      throw new Error('You must be signed in to update your profile.');
    }

    const currentProfile = mapAuthUser(current.user);
    const nextProfile: UserProfile = {
      ...currentProfile,
      ...updates,
    };

    const { data, error } = await supabase.auth.updateUser({
      data: {
        full_name: nextProfile.fullName,
        university: nextProfile.university,
        major: nextProfile.major,
        academic_year: nextProfile.academicYear,
        student_id: nextProfile.studentId,
        avatar_url: nextProfile.avatarUrl,
        daily_study_goal_minutes: nextProfile.dailyStudyGoalMinutes,
        current_streak_days: nextProfile.currentStreakDays,
        notifications_enabled: nextProfile.notificationsEnabled,
        sound_enabled: nextProfile.soundEnabled,
      },
    });

    if (error) {
      throw new Error(getErrorMessage(error, 'Failed to update profile.'));
    }
    if (!data.user) {
      throw new Error('Profile was not saved.');
    }

    return mapAuthUser(data.user);
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(getErrorMessage(error, 'Could not sign out. Please try again.'));
    }
  },
};
