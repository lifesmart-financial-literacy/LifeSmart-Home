/**
 * Tool configuration utilities and defaults.
 * Tools can be internal (routes in this app) or external (links to other LifeSmart sites).
 */

import { ALL_ICONS } from './allIcons';
import {
  FaWallet,
  FaClipboardList,
  FaCalculator,
  FaGraduationCap,
  FaBalanceScale,
  FaMoneyBillWave,
  FaSchool,
  FaExternalLinkAlt,
  FaChartLine,
  FaPiggyBank,
  FaBook,
  FaStar,
  FaLink,
  FaCog,
} from 'react-icons/fa';

/** Map icon name (string) to React Icon component */
export const ICON_MAP = {
  FaWallet,
  FaClipboardList,
  FaCalculator,
  FaGraduationCap,
  FaBalanceScale,
  FaMoneyBillWave,
  FaSchool,
  FaExternalLinkAlt,
  FaChartLine,
  FaPiggyBank,
  FaBook,
  FaStar,
  FaLink,
  FaCog,
};

/** Role types for tool access control */
export const USER_ROLES = ['user', 'admin', 'developer'];

/** Available internal routes - used for path dropdown in tool config */
export const AVAILABLE_PATHS = [
  { path: '/', label: 'Home' },
  { path: '/select', label: 'Select' },
  { path: '/profile', label: 'Profile' },
  { path: '/settings', label: 'Settings' },
  { path: '/admin', label: 'Admin' },
  { path: '/admin/analytics', label: 'Admin Analytics' },
  { path: '/admin/users', label: 'Admin Users' },
  { path: '/admin/system-settings', label: 'Admin System Settings' },
  { path: '/admin/database', label: 'Admin Database' },
  { path: '/admin/login-codes', label: 'Admin Login Codes' },
  { path: '/admin/tool-config', label: 'Admin Tool Config' },
  { path: '/quiz-landing', label: 'Quiz Landing' },
  { path: '/quiz', label: 'School Quiz' },
  { path: '/finance-quest', label: 'Finance Quest' },
  { path: '/finance-quest-quiz', label: 'Finance Quest Quiz' },
  { path: '/finance-quest-team-creation', label: 'Finance Quest Team Creation' },
  { path: '/finance-quest-leaderboard', label: 'Finance Quest Leaderboard' },
  { path: '/finance-quest-results', label: 'Finance Quest Results' },
  { path: '/finance-quest-setup', label: 'Finance Quest Setup' },
  { path: '/finance-quest-past-simulations', label: 'Finance Quest Past Simulations' },
  { path: '/finance-quest-controls', label: 'Finance Quest Controls' },
  { path: '/finance-quest-page', label: 'Finance Quest Page' },
  { path: '/adult-quiz', label: 'Adult Quiz' },
  { path: '/life-balance', label: 'Life Balance' },
  { path: '/investment-calculator', label: 'Investment Calculator' },
  { path: '/budget-tool', label: 'Budget Tool' },
];

/** Default allowedRoles when not specified - all roles can access */
const DEFAULT_ALLOWED_ROLES = ['user', 'admin', 'developer'];

/** Check if a user role can access a tool. If allowedRoles is empty/undefined, allow all. */
export function canRoleAccessTool(tool, userRole) {
  const roles = tool.allowedRoles;
  if (!roles || !Array.isArray(roles) || roles.length === 0) return true;
  return roles.includes(userRole);
}

/** Default tools - used when migrating from flat config */
const DEFAULT_TOOLS = [
  { id: 'budget-tool', type: 'internal', path: '/budget-tool', label: 'Budget Tool', icon: 'FaWallet', color: '#4CAF50', enabled: true, inDevelopment: false, order: 1, allowedRoles: DEFAULT_ALLOWED_ROLES },
  { id: 'adult-quiz', type: 'internal', path: '/adult-quiz', label: 'Adult Quiz', icon: 'FaGraduationCap', color: '#673AB7', enabled: true, inDevelopment: false, order: 2, allowedRoles: DEFAULT_ALLOWED_ROLES },
  { id: 'life-balance', type: 'internal', path: '/life-balance', label: 'Life Balance', icon: 'FaBalanceScale', color: '#FF5722', enabled: true, inDevelopment: true, order: 3, allowedRoles: DEFAULT_ALLOWED_ROLES },
  { id: 'finance-quest', type: 'internal', path: '/finance-quest', label: 'Finance Quest', icon: 'FaMoneyBillWave', color: '#000000', enabled: true, inDevelopment: false, order: 4, allowedRoles: DEFAULT_ALLOWED_ROLES },
  { id: 'financial-quiz', type: 'internal', path: '/quiz', label: 'School Simulation', icon: 'FaClipboardList', color: '#2196F3', enabled: false, inDevelopment: false, order: 5, allowedRoles: DEFAULT_ALLOWED_ROLES },
  { id: 'investment-calculator', type: 'internal', path: '/investment-calculator', label: 'Investment Calculator', icon: 'FaCalculator', color: '#9C27B0', enabled: false, inDevelopment: false, order: 6, allowedRoles: DEFAULT_ALLOWED_ROLES },
];

/** Migrate legacy flat tools array to groups format. */
export function migrateToGroups(data) {
  if (Array.isArray(data.groups) && data.groups.length > 0) {
    return data.groups.map((g) => ({
      id: g.id || `group-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      label: g.label || 'Tools',
      order: g.order ?? 999,
      tools: (g.tools || []).map((t, i) => ({
        ...t,
        order: t.order ?? i,
        allowedRoles: Array.isArray(t.allowedRoles) && t.allowedRoles.length > 0 ? t.allowedRoles : DEFAULT_ALLOWED_ROLES,
      })),
    })).sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }
  if (Array.isArray(data.tools) && data.tools.length > 0) {
    const normalized = data.tools.map((t, i) => ({
      ...t,
      order: t.order ?? i,
      allowedRoles: Array.isArray(t.allowedRoles) && t.allowedRoles.length > 0 ? t.allowedRoles : DEFAULT_ALLOWED_ROLES,
    })).sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    return [{ id: 'default', label: 'Tools', order: 0, tools: normalized }];
  }
  return [{ id: 'default', label: 'Tools', order: 0, tools: DEFAULT_TOOLS }];
}

/** Default group config - used when Firestore has no data */
export const DEFAULT_GROUP_CONFIG = migrateToGroups({ tools: DEFAULT_TOOLS });

/** Get icon component from name - supports any icon in ALL_ICONS (fa, md, fi, bs, hi, bi, io5, tb, ri) */
export function getIconComponent(name, size = 40, color) {
  const Icon = ICON_MAP[name] || ALL_ICONS[name] || FaLink;
  return <Icon size={size} color={color} />;
}
