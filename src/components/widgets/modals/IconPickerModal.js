import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Input } from '@/components/ui/input';
import { ICON_MAP } from '@/lib/toolConfig';
import { cn } from '@/lib/utils';

const ICON_OPTIONS = Object.keys(ICON_MAP);

const IconPickerModal = ({ isOpen, onClose, onSelect, currentIcon, color = '#2196F3' }) => {
  const [search, setSearch] = useState('');

  const filteredIcons = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ICON_OPTIONS;
    return ICON_OPTIONS.filter(name => name.toLowerCase().includes(q));
  }, [search]);

  const handleSelect = (iconName) => {
    onSelect(iconName);
    setSearch('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && (setSearch(''), onClose())}>
      <DialogContent className="max-w-[480px] max-h-[85vh] bg-zinc-900 border-zinc-700 flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white">Choose Icon</DialogTitle>
        </DialogHeader>
        <Input
          type="text"
          placeholder="Search icons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/5 border-white/20 text-white placeholder:text-zinc-500 focus:border-blue-500"
        />
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 overflow-y-auto max-h-[320px] pr-2">
          {filteredIcons.map((name) => {
            const IconComponent = ICON_MAP[name];
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
      </DialogContent>
    </Dialog>
  );
};

export default IconPickerModal;
