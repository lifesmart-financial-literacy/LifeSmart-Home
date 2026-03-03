import React from 'react';
import { FaBookOpen } from 'react-icons/fa';

const GlossaryModal = ({ open, onClose, title, children }) => {
  return (
    <div
      className={`fixed inset-0 bg-black/20 z-[9999] transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div
        className={`fixed top-0 right-0 w-[420px] h-screen bg-[#FFC247] rounded-l-[36px] shadow-[-4px_0_32px_rgba(0,0,0,0.18)] z-[10000] flex flex-col transition-[right] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${open ? 'right-0' : '-right-[520px]'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-9 pt-9 pb-5 border-b-2 border-[#e6b200] text-2xl font-bold text-[#222] relative">
          <FaBookOpen className="text-2xl text-[#222]" />
          <span className="ml-3 text-2xl font-bold text-[#222]">{title}</span>
          <button
            type="button"
            className="absolute right-9 top-9 bg-transparent border-none text-[2.1rem] text-[#222] cursor-pointer font-bold hover:text-[#e67e22] transition-colors"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="p-9 text-[#222] text-[1.1rem] overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

export default GlossaryModal;
