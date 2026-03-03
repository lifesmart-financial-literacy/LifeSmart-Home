import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, type = 'info' }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const confirmVariant = {
    info: 'bg-blue-500 hover:bg-blue-600',
    warning: 'bg-amber-500 hover:bg-amber-600',
    danger: 'bg-red-500 hover:bg-red-600',
  }[type];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[500px] bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
          <DialogDescription className="text-zinc-300">{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-4 sm:justify-end">
          <Button variant="outline" onClick={onClose} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            Cancel
          </Button>
          <Button onClick={handleConfirm} className={cn('text-white', confirmVariant)}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmModal;
