import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  LogOut,
  Settings,
  LayoutDashboard,
  CheckSquare,
  ClipboardList,
  Briefcase,
  Sun,
  Moon,
  ChevronDown,
  User,
  Bell,
  Trash2,
} from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';
import { useThemeStore } from '../../store/useThemeStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../../context/SocketProvider';
import { useTasks } from '../../features/tasks/hooks/useTasks';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

export const Navbar: React.FC = () => {
  const { user, logout } = useUserStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { notifications, unreadCount, clearNotifications } = useSocket();
  const { tasks } = useTasks();

  // Merge runtime notifications with historical tasks
  const displayNotifications = [...notifications];
  if (user && user.role === 'employee') {
    const historicalTasks = tasks.filter(t => t.assignedTo?._id === user._id || t.assignedTo === user._id || t.assignedTo?._id === user.id || t.assignedTo === user.id);

    historicalTasks.forEach(t => {
      const isDuplicate = displayNotifications.some(n => n.message.includes(t.title));
      if (!isDuplicate) {
        displayNotifications.push({
          id: `hist-${t._id || t.id}`,
          message: `Assigned Task: ${t.title}`,
          timestamp: t.createdAt || new Date(),
          read: true,
          type: "history"
        });
      }
    });
  }

  displayNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on outside tap
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#mobile-drawer') && !target.closest('#mobile-menu-btn')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const adminLinks: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Allocation', path: '/allocate', icon: Briefcase },
    { name: 'Requests', path: '/requests', icon: ClipboardList },
  ];

  const userLinks: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
  ];

  const navLinks = user?.role === 'admin' ? adminLinks : userLinks;
  const initials = (user?.name ?? 'U').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  /* ─── Desktop Nav Item ─── */
  const DesktopNavItem = ({ item }: { item: NavItem }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive
          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
        }`
      }
    >
      <item.icon className="w-4 h-4" />
      {item.name}
    </NavLink>
  );

  /* ─── Mobile Bottom Tab Item ─── */
  const MobileTabItem = ({ item }: { item: NavItem }) => {
    const { pathname } = useLocation();
    const isActive = pathname === item.path;
    return (
      <NavLink
        to={item.path}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 text-xs font-medium transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
      >
        <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
        <span>{item.name}</span>
      </NavLink>
    );
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          DESKTOP TOP NAVBAR
      ═══════════════════════════════════════════════════ */}
      <nav className="hidden md:block sticky top-0 z-50 w-full bg-white/80 dark:bg-white/10 backdrop-blur-md border-b border-gray-200 dark:border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left: Logo + Nav Links */}
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center gap-2 mr-8">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">T</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Task Manager
                </span>
              </Link>

              {user && (
                <div className="flex items-center space-x-1">
                  {navLinks.map((item) => (
                    <DesktopNavItem key={item.path} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Right: Theme + Profile or Login */}
            <div className="flex items-center space-x-3">
              {user ? (
                <>


                  {/* Notifications Bell */}
                  <div className="relative">
                    <button
                      onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                      className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white rounded-full transition-all relative"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    <AnimatePresence>
                      {isNotificationsOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 dark:bg-gray-950/95 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100]"
                        >
                          <div className="p-4 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Notifications</h3>
                            <button onClick={clearNotifications} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-400/10 rounded-lg transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                            {displayNotifications.length > 0 ? (
                              displayNotifications.map((msg) => (
                                <div key={msg.id} className="p-4 border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                  <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
                                      <Bell size={14} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm text-gray-800 dark:text-gray-200 leading-tight mb-1">{msg.message}</p>
                                      <p className="text-[10px] text-gray-500 uppercase font-bold">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="p-10 text-center text-gray-500 text-sm">
                                <p>No new notifications</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Profile Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus:outline-none"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium shadow-sm text-sm">
                        {initials}
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-300 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isProfileDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900/95 backdrop-blur-md rounded-xl shadow-xl ring-1 ring-gray-200 dark:ring-white/10 py-2 border border-gray-100 dark:border-transparent"
                        >
                          <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{user.email}</p>
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 capitalize">
                                {user.role}
                              </span>
                            </div>
                          </div>
                          <div className="py-1">
                            <Link
                              to="/settings"
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
                            >
                              <Settings className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400" />
                              Settings
                            </Link>
                          </div>
                          <div className="pt-1 pb-1 border-t border-gray-100 dark:border-white/10">
                            <button
                              onClick={handleLogout}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <LogOut className="w-4 h-4 mr-3" />
                              Sign out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm font-medium transition-colors">
                    Log in
                  </Link>
                  <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════
          MOBILE BOTTOM TAB BAR
      ═══════════════════════════════════════════════════ */}
      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-t border-gray-200 dark:border-white/10 flex items-stretch safe-area-pb shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] dark:shadow-none">
          {/* Nav Link Tabs */}
          {navLinks.map((item) => (
            <MobileTabItem key={item.path} item={item} />
          ))}

          {/* Menu Tab */}
          <button
            id="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 text-xs font-medium transition-colors ${isMobileMenuOpen ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
          >
            <Menu className={`w-5 h-5 ${isMobileMenuOpen ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
            <span>Menu</span>
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          MOBILE SLIDE-UP MENU DRAWER
      ═══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isMobileMenuOpen && user && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-40 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              id="mobile-drawer"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="md:hidden fixed bottom-16 left-0 right-0 z-50 bg-white dark:bg-gray-950/95 backdrop-blur-xl rounded-t-3xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-gray-300 dark:bg-white/20 rounded-full" />
              </div>

              {/* User Info */}
              <div className="px-5 py-4 border-b border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow-md flex-shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">{user.email}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-700/30 capitalize flex-shrink-0">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Menu Items */}
              <div className="px-4 py-3 space-y-1">

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? (
                      <Moon className="w-5 h-5 text-indigo-400" />
                    ) : (
                      <Sun className="w-5 h-5 text-amber-500" />
                    )}
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Tap to switch theme</p>
                    </div>
                  </div>
                  {/* Visual toggle pill */}
                  <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                </button>

                {/* Settings */}
                <Link
                  to="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Settings</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Account & preferences</p>
                  </div>
                </Link>

                {/* Profile */}
                <Link
                  to="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 transition-colors"
                >
                  <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Profile</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Edit your info</p>
                  </div>
                </Link>
              </div>

              {/* Sign Out */}
              <div className="px-4 pb-5 pt-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:border-red-500/20 text-red-600 dark:text-red-400 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-semibold">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
