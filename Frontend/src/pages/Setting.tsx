import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Moon,
  Sun,
  LogOut,
  Lock,
  Bell,
  Camera,
  CheckCircle,
  AlertTriangle,
  Shield,
  Palette,
  ChevronRight,
  Eye,
  EyeOff,
  Trash2,
  Mail,
  Info,
} from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useThemeStore } from '../store/useThemeStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

/* ────────────────────────────────────────────────────────── */
/*  Types                                                      */
/* ────────────────────────────────────────────────────────── */
type Section = 'profile' | 'appearance' | 'security' | 'notifications' | 'danger';

/* ────────────────────────────────────────────────────────── */
/*  Sidebar nav items                                          */
/* ────────────────────────────────────────────────────────── */
const navItems: { id: Section; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'profile',       label: 'Profile',       icon: User,         color: 'text-blue-500'   },
  { id: 'appearance',    label: 'Appearance',    icon: Palette,      color: 'text-purple-500' },
  { id: 'security',      label: 'Security',      icon: Shield,       color: 'text-green-500'  },
  { id: 'notifications', label: 'Notifications', icon: Bell,         color: 'text-amber-500'  },
  { id: 'danger',        label: 'Danger Zone',   icon: AlertTriangle,color: 'text-red-500'    },
];

/* ────────────────────────────────────────────────────────── */
/*  Reusable Card                                              */
/* ────────────────────────────────────────────────────────── */
const Card: React.FC<{ title: string; subtitle?: string; icon: React.ElementType; iconColor: string; children: React.ReactNode }> = ({
  title, subtitle, icon: Icon, iconColor, children,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
  >
    <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${iconColor}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <div className="px-6 py-5">{children}</div>
  </motion.div>
);

/* ────────────────────────────────────────────────────────── */
/*  Toggle Switch                                              */
/* ────────────────────────────────────────────────────────── */
const Toggle: React.FC<{ checked: boolean; onChange: () => void; id: string }> = ({ checked, onChange, id }) => (
  <button
    id={id}
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
      checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

/* ────────────────────────────────────────────────────────── */
/*  Password Input                                             */
/* ────────────────────────────────────────────────────────── */
const PasswordInput: React.FC<{
  id: string; label: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
}> = ({ id, label, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? '••••••••'}
          className="w-full pr-10 pl-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────── */
/*  Strength meter                                             */
/* ────────────────────────────────────────────────────────── */
function calcStrength(pw: string): { score: number; label: string; color: string } {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map: Record<number, { label: string; color: string }> = {
    0: { label: 'Very weak', color: 'bg-red-500' },
    1: { label: 'Weak',      color: 'bg-orange-500' },
    2: { label: 'Fair',      color: 'bg-yellow-500' },
    3: { label: 'Good',      color: 'bg-blue-500' },
    4: { label: 'Strong',    color: 'bg-green-500' },
  };
  return { score: s, ...map[s] };
}

/* ────────────────────────────────────────────────────────── */
/*  Main Settings Page                                         */
/* ────────────────────────────────────────────────────────── */
const Setting: React.FC = () => {
  const { user, setUser, logout } = useUserStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const [active, setActive] = useState<Section>('profile');

  /* ── Profile ── */
  const [name, setName]           = useState(user?.name ?? '');
  const [email, setEmail]         = useState(user?.email ?? '');
  const [bio, setBio]             = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2 MB'); return; }
    const reader = new FileReader();
    reader.onload = () => setAvatarUrl(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleSaveProfile = async () => {
    if (!name.trim()) { toast.error('Name cannot be empty'); return; }
    setSavingProfile(true);
    await new Promise((r) => setTimeout(r, 900)); // simulate API
    if (user) setUser({ ...user, name: name.trim(), email });
    toast.success('Profile updated successfully!');
    setSavingProfile(false);
  };

  /* ── Security ── */
  const [currentPw, setCurrentPw] = useState('');
  const [newPw,     setNewPw]     = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [savingPw,  setSavingPw]  = useState(false);
  const strength = calcStrength(newPw);

  const handleChangePassword = async () => {
    if (!currentPw) { toast.error('Enter your current password'); return; }
    if (newPw.length < 8) { toast.error('New password must be at least 8 characters'); return; }
    if (newPw !== confirmPw) { toast.error('Passwords do not match'); return; }
    setSavingPw(true);
    await new Promise((r) => setTimeout(r, 900));
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    toast.success('Password changed!');
    setSavingPw(false);
  };

  /* ── Notifications ── */
  const [notifs, setNotifs] = useState({
    emailTaskAssign:   true,
    emailDeadline:     true,
    emailDigest:       false,
    pushBrowser:       true,
    pushTaskComplete:  false,
  });
  const toggleNotif = (k: keyof typeof notifs) => setNotifs((n) => ({ ...n, [k]: !n[k] }));

  /* ── Danger ── */
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const handleLogout = () => { logout(); navigate('/login'); toast.success('Logged out'); };

  /* ── Avatar initials ── */
  const initials = (user?.name ?? 'U').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  /* ────────── Render ────────── */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account, appearance, and preferences.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── Sidebar ── */}
          <aside className="lg:w-56 flex-shrink-0">
            <nav className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              {navItems.map((item, idx) => (
                <button
                  key={item.id}
                  id={`settings-nav-${item.id}`}
                  onClick={() => setActive(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors duration-150
                    ${idx !== 0 ? 'border-t border-gray-100 dark:border-gray-800' : ''}
                    ${active === item.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 ${active === item.id ? 'text-blue-600 dark:text-blue-400' : item.color}`} />
                    {item.label}
                  </span>
                  {active === item.id && <ChevronRight className="w-4 h-4 text-blue-500" />}
                </button>
              ))}
            </nav>

            {/* Quick logout */}
            <button
              id="settings-quick-logout"
              onClick={handleLogout}
              className="mt-3 w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </aside>

          {/* ── Content ── */}
          <main className="flex-1 space-y-5 min-w-0">
            <AnimatePresence mode="wait">

              {/* ═══ PROFILE ═══ */}
              {active === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                  <Card title="Profile Photo" subtitle="Upload a photo to personalise your account" icon={Camera} iconColor="text-blue-500">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100 dark:ring-blue-900/40 shadow-md" />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-blue-100 dark:ring-blue-900/40 shadow-md select-none">
                            {initials}
                          </div>
                        )}
                        <button
                          id="settings-avatar-upload-btn"
                          onClick={() => fileRef.current?.click()}
                          className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                      </div>

                      <div className="flex-1 text-center sm:text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 capitalize">{user?.role}</p>
                        <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                          <button
                            id="settings-choose-photo"
                            onClick={() => fileRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
                          >
                            Choose photo
                          </button>
                          {avatarUrl && (
                            <button
                              id="settings-remove-photo"
                              onClick={() => setAvatarUrl(null)}
                              className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 2 MB</p>
                      </div>
                    </div>
                  </Card>

                  <Card title="Personal Information" subtitle="Update your name and email" icon={User} iconColor="text-blue-500">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="settings-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                        <input
                          id="settings-name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>
                      <div>
                        <label htmlFor="settings-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</span>
                        </label>
                        <input
                          id="settings-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                      </div>
                      <div>
                        <label htmlFor="settings-bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Bio <span className="text-gray-400 font-normal">(optional)</span></label>
                        <textarea
                          id="settings-bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={3}
                          maxLength={160}
                          placeholder="A short bio about yourself…"
                          className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                        />
                        <p className="text-xs text-gray-400 mt-1 text-right">{bio.length}/160</p>
                      </div>

                      {/* Read-only role badge */}
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                        <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          Your role is <span className="font-semibold capitalize">{user?.role}</span>. Contact an admin to change it.
                        </p>
                      </div>

                      <button
                        id="settings-save-profile"
                        onClick={handleSaveProfile}
                        disabled={savingProfile}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium transition-colors"
                      >
                        {savingProfile ? (
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        {savingProfile ? 'Saving…' : 'Save changes'}
                      </button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* ═══ APPEARANCE ═══ */}
              {active === 'appearance' && (
                <motion.div key="appearance" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                  <Card title="Theme" subtitle="Choose between light and dark mode" icon={Palette} iconColor="text-purple-500">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Light */}
                      <button
                        id="settings-theme-light"
                        onClick={() => theme !== 'light' && toggleTheme()}
                        className={`relative rounded-2xl border-2 p-4 transition-all duration-200 text-left overflow-hidden ${
                          theme === 'light'
                            ? 'border-blue-500 ring-2 ring-blue-500/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        {/* Preview */}
                        <div className="w-full h-20 rounded-xl bg-white border border-gray-200 mb-3 p-2 overflow-hidden shadow-sm">
                          <div className="w-12 h-2 bg-gray-800 rounded mb-1.5" />
                          <div className="w-20 h-1.5 bg-gray-300 rounded mb-1.5" />
                          <div className="w-16 h-1.5 bg-gray-300 rounded mb-2" />
                          <div className="flex gap-1.5">
                            <div className="w-8 h-5 rounded bg-blue-500" />
                            <div className="w-8 h-5 rounded bg-gray-200" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Light</span>
                          {theme === 'light' && <CheckCircle className="w-4 h-4 text-blue-500 ml-auto" />}
                        </div>
                      </button>

                      {/* Dark */}
                      <button
                        id="settings-theme-dark"
                        onClick={() => theme !== 'dark' && toggleTheme()}
                        className={`relative rounded-2xl border-2 p-4 transition-all duration-200 text-left overflow-hidden ${
                          theme === 'dark'
                            ? 'border-blue-500 ring-2 ring-blue-500/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        {/* Preview */}
                        <div className="w-full h-20 rounded-xl bg-gray-900 border border-gray-700 mb-3 p-2 overflow-hidden shadow-sm">
                          <div className="w-12 h-2 bg-gray-100 rounded mb-1.5" />
                          <div className="w-20 h-1.5 bg-gray-600 rounded mb-1.5" />
                          <div className="w-16 h-1.5 bg-gray-600 rounded mb-2" />
                          <div className="flex gap-1.5">
                            <div className="w-8 h-5 rounded bg-blue-500" />
                            <div className="w-8 h-5 rounded bg-gray-700" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Moon className="w-4 h-4 text-indigo-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Dark</span>
                          {theme === 'dark' && <CheckCircle className="w-4 h-4 text-blue-500 ml-auto" />}
                        </div>
                      </button>
                    </div>

                    {/* Quick toggle strip */}
                    <div className="mt-5 flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {theme === 'dark' ? 'Dark mode' : 'Light mode'} is on
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Toggle to switch instantly</p>
                        </div>
                      </div>
                      <Toggle id="settings-theme-toggle" checked={theme === 'dark'} onChange={toggleTheme} />
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* ═══ SECURITY ═══ */}
              {active === 'security' && (
                <motion.div key="security" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                  <Card title="Change Password" subtitle="Use a strong, unique password" icon={Lock} iconColor="text-green-500">
                    <div className="space-y-4">
                      <PasswordInput id="settings-current-pw"  label="Current password"  value={currentPw} onChange={setCurrentPw} />
                      <PasswordInput id="settings-new-pw"      label="New password"      value={newPw}     onChange={setNewPw} />

                      {/* Strength bar */}
                      {newPw && (
                        <div className="space-y-1.5">
                          <div className="flex gap-1">
                            {[0,1,2,3].map((i) => (
                              <div key={i} className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${i < strength.score ? strength.color : 'bg-gray-200 dark:bg-gray-700'}`} />
                            ))}
                          </div>
                          <p className={`text-xs font-medium ${strength.score >= 3 ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            {strength.label}
                          </p>
                        </div>
                      )}

                      <PasswordInput id="settings-confirm-pw" label="Confirm new password" value={confirmPw} onChange={setConfirmPw} />

                      {confirmPw && newPw !== confirmPw && (
                        <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Passwords do not match</p>
                      )}

                      <button
                        id="settings-change-password"
                        onClick={handleChangePassword}
                        disabled={savingPw}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-medium transition-colors"
                      >
                        {savingPw ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Shield className="w-4 h-4" />}
                        {savingPw ? 'Updating…' : 'Update password'}
                      </button>
                    </div>
                  </Card>

                  {/* Active sessions info */}
                  <Card title="Active Sessions" subtitle="Devices currently signed into your account" icon={Shield} iconColor="text-green-500">
                    <div className="space-y-3">
                      {[
                        { device: 'This device', location: 'Current session', current: true },
                      ].map((s, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{s.device}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.location}</p>
                          </div>
                          {s.current && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Active
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* ═══ NOTIFICATIONS ═══ */}
              {active === 'notifications' && (
                <motion.div key="notifications" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                  <Card title="Email Notifications" subtitle="Control what emails you receive" icon={Mail} iconColor="text-amber-500">
                    <div className="space-y-4">
                      {[
                        { key: 'emailTaskAssign',  label: 'Task assignments',      desc: 'Notify when a task is assigned to you'       },
                        { key: 'emailDeadline',    label: 'Deadline reminders',    desc: 'Remind you 24h before a task deadline'       },
                        { key: 'emailDigest',      label: 'Weekly digest',         desc: 'Summary of activity every Monday morning'    },
                      ].map(({ key, label, desc }) => (
                        <div key={key} className="flex items-center justify-between gap-4 py-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
                          </div>
                          <Toggle id={`settings-notif-${key}`} checked={notifs[key as keyof typeof notifs]} onChange={() => toggleNotif(key as keyof typeof notifs)} />
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card title="Push Notifications" subtitle="In-browser push alerts" icon={Bell} iconColor="text-amber-500">
                    <div className="space-y-4">
                      {[
                        { key: 'pushBrowser',       label: 'Browser push',         desc: 'Receive push notifications in your browser'  },
                        { key: 'pushTaskComplete',   label: 'Task completions',     desc: 'Alert when your submitted task is reviewed'  },
                      ].map(({ key, label, desc }) => (
                        <div key={key} className="flex items-center justify-between gap-4 py-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
                          </div>
                          <Toggle id={`settings-notif-${key}`} checked={notifs[key as keyof typeof notifs]} onChange={() => toggleNotif(key as keyof typeof notifs)} />
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* ═══ DANGER ZONE ═══ */}
              {active === 'danger' && (
                <motion.div key="danger" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                  {/* Logout */}
                  <Card title="Sign Out" subtitle="Log out of your account on this device" icon={LogOut} iconColor="text-red-500">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        You will be redirected to the login page. Your data will be preserved.
                      </p>
                      <button
                        id="settings-logout-btn"
                        onClick={handleLogout}
                        className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </Card>

                  {/* Delete account */}
                  <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl border-2 border-red-200 dark:border-red-800 overflow-hidden">
                    <div className="px-6 py-5 border-b border-red-200 dark:border-red-800 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400">
                        <Trash2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-red-700 dark:text-red-400 text-sm">Delete Account</h3>
                        <p className="text-xs text-red-500 dark:text-red-500 mt-0.5">This action is permanent and cannot be undone</p>
                      </div>
                    </div>
                    <div className="px-6 py-5 space-y-4">
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-red-100 dark:bg-red-900/30">
                        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-red-700 dark:text-red-300">
                          Deleting your account will permanently remove all your tasks, requests, and profile data. This cannot be reversed.
                        </p>
                      </div>
                      <div>
                        <label htmlFor="settings-delete-confirm" className="block text-sm font-medium text-red-700 dark:text-red-400 mb-1.5">
                          Type <span className="font-mono font-bold">DELETE</span> to confirm
                        </label>
                        <input
                          id="settings-delete-confirm"
                          type="text"
                          value={deleteConfirm}
                          onChange={(e) => setDeleteConfirm(e.target.value)}
                          placeholder="DELETE"
                          className="w-full px-4 py-2.5 text-sm rounded-xl border border-red-300 dark:border-red-700 bg-white dark:bg-gray-900 text-red-700 dark:text-red-300 placeholder-red-300 dark:placeholder-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <button
                        id="settings-delete-account"
                        disabled={deleteConfirm !== 'DELETE'}
                        onClick={() => toast.error('Account deletion requires backend integration')}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Permanently delete account
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Setting;