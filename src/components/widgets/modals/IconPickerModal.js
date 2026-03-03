import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Input } from '@/components/ui/input';
import { ALL_ICONS, ICON_NAMES } from '@/lib/allIcons';
import { cn } from '@/lib/utils';

const DISPLAY_LIMIT = 120;
const SEARCH_DEBOUNCE_MS = 150;

const IconPickerModal = ({ isOpen, onClose, onSelect, currentIcon, color = '#2196F3' }) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchDebounced(searchInput);
      debounceRef.current = null;
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  const filteredIcons = useMemo(() => {
    const q = searchDebounced.trim().toLowerCase();
    const list = q ? ICON_NAMES.filter((name) => name.toLowerCase().includes(q)) : ICON_NAMES;
    const limited = list.slice(0, DISPLAY_LIMIT);
    if (currentIcon && list.includes(currentIcon) && !limited.includes(currentIcon)) {
      limited.push(currentIcon);
    }
    return limited;
  }, [searchDebounced, currentIcon]);

  const hasMoreIcons = useMemo(() => {
    const q = searchDebounced.trim().toLowerCase();
    if (!q) return ICON_NAMES.length > DISPLAY_LIMIT;
    const count = ICON_NAMES.filter((name) => name.toLowerCase().includes(q)).length;
    return count > DISPLAY_LIMIT;
  }, [searchDebounced]);

  const handleSelect = (iconName) => {
    onSelect(iconName);
    setSearchInput('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && (setSearchInput(''), onClose())}>
      <DialogContent className="max-w-[560px] max-h-[85vh] bg-zinc-900 border-zinc-700 flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white">Choose Icon</DialogTitle>
          <p className="text-zinc-400 text-sm mt-1">{ICON_NAMES.length.toLocaleString()} icons — type to search</p>
        </DialogHeader>
        <Input
          type="text"
          placeholder="Search icons..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="bg-white/5 border-white/20 text-white placeholder:text-zinc-500 focus:border-blue-500"
        />
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 overflow-y-auto max-h-[400px] pr-2">
          {filteredIcons.map((name) => {
            const IconComponent = ALL_ICONS[name];
            const isSelected = name === currentIcon;
            return (
              <button
                key={name}
                type="button"
                onClick={() => handleSelect(name)}
                className={cn(
                  'flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg border transition-all',
                  'hover:bg-white/10 hover:border-blue-500/50',
                  isSelected
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/10 bg-white/5'
                )}
              >
                {IconComponent ? (
                  <IconComponent size={28} color={color} />
                ) : (
                  <span className="text-zinc-500 text-lg">?</span>
                )}
                <span className="text-xs text-zinc-400 truncate w-full text-center">{name}</span>
              </button>
            );
          })}
        </div>
        {filteredIcons.length === 0 && (
          <p className="text-zinc-500 text-sm text-center py-4">No icons match your search</p>
        )}
        {hasMoreIcons && (
          <p className="text-zinc-500 text-xs text-center py-2">Refine your search to see more icons</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default IconPickerModal;
