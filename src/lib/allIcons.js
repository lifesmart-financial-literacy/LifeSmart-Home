/**
 * Aggregates icons from multiple react-icons libraries.
 * Used by IconPickerModal and getIconComponent for full icon support.
 */

import * as Fa from 'react-icons/fa';
import * as Md from 'react-icons/md';
import * as Fi from 'react-icons/fi';
import * as Bs from 'react-icons/bs';
import * as Hi from 'react-icons/hi';
import * as Bi from 'react-icons/bi';
import * as Io5 from 'react-icons/io5';
import * as Tb from 'react-icons/tb';
import * as Ri from 'react-icons/ri';

const iconSets = [Fa, Md, Fi, Bs, Hi, Bi, Io5, Tb, Ri];

/** All icons: { FaWallet, MdHome, FiSettings, ... } - keys are unique across sets */
export const ALL_ICONS = {};

iconSets.forEach((set) => {
  Object.entries(set).forEach(([key, value]) => {
    if (typeof value === 'function') {
      ALL_ICONS[key] = value;
    }
  });
});

export const ICON_NAMES = Object.keys(ALL_ICONS).sort();
