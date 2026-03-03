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

/** Default allowedRoles when not specified - all roles can access */
const DEFAULT_ALLOWED_ROLES = ['user', 'admin', 'developer'];

/** Check if a user role can access a tool. If allowedRoles is empty/undefined, allow all. */
export function canRoleAccessTool(tool, userRole) {
  const roles = tool.allowedRoles;
  if (!roles || !Array.isArray(roles) || roles.length === 0) return true;
  return roles.includes(userRole);
}

/** Default tool config - used when Firestore has no data */
export const DEFAULT_TOOL_CONFIG = [
  { id: 'budget-tool', type: 'internal', path: '/budget-tool', label: 'Budget Tool', icon: 'FaWallet', color: '#4CAF50', enabled: true, inDevelopment: false, order: 1, allowedRoles: DEFAULT_ALLOWED_ROLES },
  { id: 'adult-quiz', type: 'internal', path: '/adult-quiz', label: 'Adult Quiz', icon: 'FaGraduationCap', color: '#673AB7', enabled: true, inDevelopment: false, order: 2, allowedRoles: DEFAULT_ALLOWED_ROLES },
  { id: 'life-balance', type: 'internal', path: '/life-balance', label: 'Life Balance', icon: 'FaBalanceScale', color: '#FF5722', enabled: true, inDevelopment: true, order: 3, allowedRoles: DEFAULT_ALLOWED_ROLES },
  { id: 'finance-quest', type: 'internal', path: '/finance-quest', label: 'Finance Quest', icon: 'FaMoneyBillWave', color: '#000000', enabled: true, inDevelopment: false, order: 4, allowedRoles: DEFAULT_ALLOWED_ROLES },
  { id: 'financial-quiz', type: 'internal', path: '/quiz', label: 'School Simulation', icon: 'FaClipboardList', color: '#2196F3', enabled: false, inDevelopment: false, order: 5, allowedRoles: DEFAULT_ALLOWED_ROLES },
  { id: 'investment-calculator', type: 'internal', path: '/investment-calculator', label: 'Investment Calculator', icon: 'FaCalculator', color: '#9C27B0', enabled: false, inDevelopment: false, order: 6, allowedRoles: DEFAULT_ALLOWED_ROLES },
];

/** Get icon component from name - supports any icon in ALL_ICONS (fa, md, fi, bs, hi, bi, io5, tb, ri) */
export function getIconComponent(name, size = 40, color) {
  const Icon = ICON_MAP[name] || ALL_ICONS[name] || FaLink;
  return <Icon size={size} color={color} />;
}
