import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Sparkles, Mail, Lock, User, GraduationCap, Building2, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface SignUpFormProps {
  onSwitchToLogin: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSwitchToLogin }) => {
  const { signUp, isSubmitting } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [university, setUniversity] = useState('Stanford University');
  const [major, setMajor] = useState('Computer Science');
  const [academicYear, setAcademicYear] = useState('Junior Year');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (!fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (!agreeTerms) {
      setError('Please accept terms to continue.');
      return;
    }

    const result = await signUp({
      fullName,
      email,
      password,
      university,
      major,
      academicYear,
    });

    if (result === 'confirm_email') {
      setNotice('Account created. Check your email to confirm your address, then sign in.');
      return;
    }

    if (result === 'error') {
      setError('Failed to create account. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-xl p-7 sm:p-8 space-y-5">
      {/* Brand header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20 mb-2.5">
          <Sparkles className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Create Student Account
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Set up your academic dashboard and track all assignments
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {error}
        </div>
      )}

      {notice && (
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium">
          {notice}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-slate-50/40 focus:bg-white"
              placeholder="e.g. Jordan Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Email <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-slate-50/40 focus:bg-white"
              placeholder="e.g. j.smith@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full pl-10 pr-10 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-slate-50/40 focus:bg-white"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1.5 text-slate-400 hover:text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* University & Major Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              University / School
            </label>
            <div className="relative">
              <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                className="w-full pl-8.5 pr-2.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50/40 focus:bg-white focus:outline-none focus:border-blue-500"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Major / Field
            </label>
            <div className="relative">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                className="w-full pl-8.5 pr-2.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50/40 focus:bg-white focus:outline-none focus:border-blue-500"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Academic Year */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Academic Year
          </label>
          <select
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50/40 focus:bg-white focus:outline-none focus:border-blue-500"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
          >
            <option value="Freshman Year">Freshman Year (1st Year)</option>
            <option value="Sophomore Year">Sophomore Year (2nd Year)</option>
            <option value="Junior Year">Junior Year (3rd Year)</option>
            <option value="Senior Year">Senior Year (4th Year)</option>
            <option value="Master's / Graduate">Master&apos;s / Graduate</option>
            <option value="PhD Candidate">PhD Candidate</option>
          </select>
        </div>

        {/* Terms checkbox */}
        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 pt-1">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
          />
          <span>I agree to academic honesty & productivity guidelines</span>
        </label>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Create Study Workspace
        </Button>
      </form>

      {/* Switch to login */}
      <p className="text-center text-xs text-slate-500">
        Already have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};
