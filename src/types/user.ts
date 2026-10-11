export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  university: string;
  major: string;
  academicYear: string; // e.g. "Sophomore", "Senior", "Master's"
  studentId: string;
  dailyStudyGoalMinutes: number;
  currentStreakDays: number;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  createdAt: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
