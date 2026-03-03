import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/initFirebase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const EditModal = ({ isOpen, onClose, userId, onSave }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    isActive: true,
    admin: false,
    developer: false,
    user: true,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const userRef = doc(db, 'Users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const ud = userSnap.data();
          setUserData({
            firstName: ud.firstName || '',
            lastName: ud.lastName || '',
            email: ud.email || '',
            isActive: ud.isActive !== false,
            admin: ud.admin || false,
            developer: ud.developer || false,
            user: ud.user !== false,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (isOpen && userId) fetchUserData();
  }, [isOpen, userId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'Users', userId), userData);
      await updateDoc(doc(db, userId, 'Profile'), userData);
      onSave?.(userData);
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user: ' + error.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-white text-center text-2xl">Edit User Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-zinc-300">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="space-y-4 border-b border-white/10 pb-6">
              <h3 className="text-lg font-medium text-blue-400">Personal Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium text-zinc-300">First Name</label>
                  <Input id="firstName" name="firstName" value={userData.firstName} onChange={handleChange} className="bg-white/5 border-white/20 text-white" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium text-zinc-300">Last Name</label>
                  <Input id="lastName" name="lastName" value={userData.lastName} onChange={handleChange} className="bg-white/5 border-white/20 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300">Email</label>
                <Input id="email" type="email" name="email" value={userData.email} onChange={handleChange} className="bg-white/5 border-white/20 text-white" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-blue-400">Account Status</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {['isActive', 'admin', 'developer', 'user'].map((key, i) => (
                  <label key={key} className="flex items-center gap-2 p-2 rounded-md hover:bg-white/5 cursor-pointer">
                    <input type="checkbox" name={key} checked={userData[key]} onChange={handleChange} className="w-4 h-4 cursor-pointer" />
                    <span className="text-zinc-300">{key === 'isActive' ? 'Active Account' : key === 'user' ? 'Regular User' : key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600">Save Changes</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
