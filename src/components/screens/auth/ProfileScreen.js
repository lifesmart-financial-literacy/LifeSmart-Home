import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaLock, FaEnvelope, FaArrowLeft, FaSave, FaEye, FaEyeSlash, FaFire } from 'react-icons/fa';
import { firebaseAuth, db } from '../../../firebase/initFirebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '',
    currentPassword: '', newPassword: '', confirmPassword: '',
    loginStreak: 0,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = firebaseAuth.currentUser;
        if (!user) { navigate('/'); return; }
        const uid = user.userUID || user.uid;
        const userDoc = await getDoc(doc(db, 'Users', uid));
        if (userDoc.exists()) {
          const ud = userDoc.data();
          setFormData((prev) => ({
            ...prev,
            firstName: ud.firstName || '',
            lastName: ud.lastName || '',
            email: ud.email || '',
            loginStreak: ud.streak || 0,
          }));
        }
      } catch (err) {
        setError('Error loading profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const user = firebaseAuth.currentUser;
      if (!user) { navigate('/'); return; }
      await updateDoc(doc(db, 'Users', user.userUID || user.uid), {
        firstName: formData.firstName, lastName: formData.lastName, email: formData.email,
      });
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Error updating profile');
      console.error(err);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match!');
      return;
    }
    try {
      const user = firebaseAuth.currentUser;
      if (!user) { navigate('/'); return; }
      const credential = EmailAuthProvider.credential(user.email, formData.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, formData.newPassword);
      setSuccess('Password updated successfully');
      setFormData((prev) => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      setError('Error changing password. Please check your current password.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-start p-8 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a]">
        <div className="w-full max-w-[800px] flex justify-center items-center min-h-[200px] text-zinc-400 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-start p-4 md:p-8 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] text-white">
      <div className="w-full max-w-[800px] bg-white/5 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl border border-white/10">
        <header className="text-center mb-8 relative">
          <button onClick={() => navigate('/select')} className="absolute left-0 top-0 flex items-center gap-2 text-white text-base cursor-pointer p-2 rounded-lg transition-all hover:bg-white/10 hover:-translate-x-1">
            <FaArrowLeft /> Back to Home
          </button>
          <h1 className="text-2xl md:text-3xl mb-4 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">Profile Settings</h1>
          <div className="my-4 text-blue-400"><FaUserCircle size={80} /></div>
        </header>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-4 text-center">{error}</div>}
        {success && <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg mb-4 text-center">{success}</div>}

        <div className="flex flex-col gap-8">
          <section className="bg-white/[0.03] rounded-xl p-6 border border-white/10">
            <h2 className="text-xl mb-6 text-white">Personal Information</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {[
                { icon: FaUserCircle, label: 'First Name', name: 'firstName' },
                { icon: FaUserCircle, label: 'Last Name', name: 'lastName' },
                { icon: FaEnvelope, label: 'Email Address', name: 'email', disabled: true },
              ].map(({ icon: Icon, label, name, disabled }) => (
                <div key={name} className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-zinc-300 text-base">
                    <Icon className="text-blue-400" size={18} /> {label}
                  </label>
                  <Input name={name} value={formData[name]} onChange={handleInputChange} disabled={disabled} type={name === 'email' ? 'email' : 'text'} className={`bg-white/5 border-white/10 text-white ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`} />
                </div>
              ))}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-zinc-300"><FaFire className="text-blue-400" size={18} /> Login Streak</label>
                <Input value={`${formData.loginStreak} days`} disabled className="bg-white/5 border-white/10 text-white opacity-70 cursor-not-allowed" />
              </div>
              <Button type="submit" className="mt-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                <FaSave className="mr-2" /> Save Changes
              </Button>
            </form>
          </section>

          <section className="bg-white/[0.03] rounded-xl p-6 border border-white/10">
            <h2 className="text-xl mb-6 text-white">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="flex flex-col gap-6">
              {[
                { label: 'Current Password', name: 'currentPassword', show: showPassword, setShow: setShowPassword },
                { label: 'New Password', name: 'newPassword', show: showNewPassword, setShow: setShowNewPassword },
                { label: 'Confirm New Password', name: 'confirmPassword', show: showConfirmPassword, setShow: setShowConfirmPassword },
              ].map(({ label, name, show, setShow }) => (
                <div key={name} className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-zinc-300"><FaLock className="text-blue-400" size={18} /> {label}</label>
                  <div className="relative flex items-center">
                    <Input type={show ? 'text' : 'password'} name={name} value={formData[name]} onChange={handleInputChange} className="bg-white/5 border-white/10 text-white pr-12" />
                    <button type="button" onClick={() => setShow(!show)} className="absolute right-3 text-zinc-400 hover:text-white p-1 cursor-pointer">
                      {show ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                </div>
              ))}
              <Button type="submit" className="mt-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                <FaLock className="mr-2" /> Change Password
              </Button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
