import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { useToast } from '../../context/ToastContext';

export function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('coordinator');
  const [department, setDepartment] = useState('Department of Panchakarma');
  const [institution, setInstitution] = useState('All India Institute of Ayurveda, New Delhi');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the Good Clinical Practice (GCP) & Data Confidentiality Terms.');
      return;
    }

    setIsLoading(true);
    try {
      await signup({ name, email, role, department, institution });
      showToast('Registration submitted! Welcome to AIIA CTMS.', 'success');
      navigate('/dashboard');
    } catch {
      setError('Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-800 text-white shadow-lg mb-3">
          <Leaf className="w-6 h-6 text-teal-200" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-serif">
          Register Investigator / Staff
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          All India Institute of Ayurveda Clinical Trials Portal
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-xl sm:rounded-3xl sm:px-10 border border-slate-200 dark:border-slate-800">
          <form className="space-y-4" onSubmit={handleSignup}>
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Full Name & Title
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Ananya Sen, MD (Ayu)"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 dark:bg-slate-800 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ananya.sen@aiia.gov.in"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 dark:bg-slate-800 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Designated Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 dark:bg-slate-800"
                >
                  <option value="pi">Principal Investigator</option>
                  <option value="coordinator">Study Coordinator</option>
                  <option value="monitor">Clinical Monitor (CRA)</option>
                  <option value="ethics">Ethics Committee Member</option>
                  <option value="safety">Pharmacovigilance Officer</option>
                  <option value="regulator">Regulator / Auditor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 dark:bg-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Institution
              </label>
              <input
                type="text"
                required
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 dark:bg-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:border-slate-700"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  I agree to abide by ICMR Ethical Guidelines, Good Clinical Practice (GCP), and AIIA Clinical Trial Data Protection norms.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold shadow-md transition-all disabled:opacity-70 mt-4"
            >
              <span>{isLoading ? 'Creating credentials...' : 'Register & Enter System'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            <span>Already have an authorized AIIA account? </span>
            <Link to="/login" className="font-bold text-teal-700 dark:text-teal-400 hover:underline">
              Sign In &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
