import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaPalette, FaGlobe, FaDownload, FaToggleOn, FaToggleOff, FaCog, FaBell } from 'react-icons/fa';
import { firebaseAuth, db } from '../../../firebase/initFirebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';

const SettingsScreen = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [settings, setSettings] = useState({
    theme: 'dark', language: 'en', currency: 'GBP', autoSave: true,
    downloadFormat: 'xlsx', budgetReminders: true, savingsAlerts: true, monthlyReports: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const user = firebaseAuth.currentUser;
        if (!user) { navigate('/'); return; }
        const settingsDoc = await getDoc(doc(db, user.uid, 'Settings'));
        if (settingsDoc.exists()) setSettings((prev) => ({ ...prev, ...settingsDoc.data() }));
        else await setDoc(doc(db, user.uid, 'Settings'), settings);
      } catch (err) {
        setError('Error loading settings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [navigate]);

  const handleChange = (name, value) => setSettings((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const user = firebaseAuth.currentUser;
      if (!user) { navigate('/'); return; }
      await setDoc(doc(db, user.uid, 'Settings'), settings);
      setSuccess('Settings updated successfully');
    } catch (err) {
      setError('Error updating settings');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center p-8 bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]">
        <div className="min-h-[200px] flex items-center justify-center text-zinc-400 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] text-white">
      <div className="max-w-[800px] mx-auto bg-white/5 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-xl border border-white/10">
        <header className="flex flex-col items-center mb-8 relative">
          <button onClick={() => navigate('/select')} className="absolute left-0 top-0 flex items-center gap-2 text-white cursor-pointer p-2 rounded-lg hover:bg-white/10">
            <FaArrowLeft /> Back to Home
          </button>
          <h1 className="text-2xl my-4 text-center">Settings</h1>
          <div className="text-blue-400 mb-4"><FaCog size={80} /></div>
        </header>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg mb-4 text-center">{error}</div>}
        {success && <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-lg mb-4 text-center">{success}</div>}

        <form onSubmit={handleSubmit}>
          <section className="bg-white/[0.03] rounded-xl p-6 mb-6">
            <h2 className="flex items-center gap-2 text-lg mb-6 text-blue-400"><FaPalette /> Appearance</h2>
            <div className="flex justify-between items-center py-4 border-b border-white/10 last:border-0">
              <label className="text-white">Theme</label>
              <select value={settings.theme} onChange={(e) => handleChange('theme', e.target.value)} className="bg-white/5 border border-white/10 rounded-lg text-white px-4 py-2 min-w-[150px] cursor-pointer focus:outline-none focus:border-blue-500">
                <option value="dark">Dark Theme</option>
                <option value="light">Light Theme</option>
                <option value="system">System Default</option>
              </select>
            </div>
          </section>

          <section className="bg-white/[0.03] rounded-xl p-6 mb-6">
            <h2 className="flex items-center gap-2 text-lg mb-6 text-blue-400"><FaGlobe /> Regional</h2>
            <div className="flex justify-between items-center py-4 border-b border-white/10">
              <label className="text-white">Language</label>
              <select value={settings.language} onChange={(e) => handleChange('language', e.target.value)} className="bg-white/5 border border-white/10 rounded-lg text-white px-4 py-2 min-w-[150px] cursor-pointer focus:outline-none focus:border-blue-500">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            <div className="flex justify-between items-center py-4">
              <label className="text-white">Currency</label>
              <select value={settings.currency} onChange={(e) => handleChange('currency', e.target.value)} className="bg-white/5 border border-white/10 rounded-lg text-white px-4 py-2 min-w-[150px] cursor-pointer focus:outline-none focus:border-blue-500">
                <option value="GBP">British Pound (£)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
          </section>

          <section className="bg-white/[0.03] rounded-xl p-6 mb-6">
            <h2 className="flex items-center gap-2 text-lg mb-6 text-blue-400"><FaDownload /> Export Settings</h2>
            <div className="flex justify-between items-center py-4 border-b border-white/10">
              <label className="text-white">Auto-Save</label>
              <button type="button" onClick={() => handleChange('autoSave', !settings.autoSave)} className="text-blue-400 p-2 rounded-lg hover:bg-blue-500/10 cursor-pointer">
                {settings.autoSave ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
              </button>
            </div>
            <div className="flex justify-between items-center py-4">
              <label className="text-white">Download Format</label>
              <select value={settings.downloadFormat} onChange={(e) => handleChange('downloadFormat', e.target.value)} className="bg-white/5 border border-white/10 rounded-lg text-white px-4 py-2 min-w-[150px] cursor-pointer focus:outline-none focus:border-blue-500">
                <option value="xlsx">Excel (XLSX)</option>
                <option value="csv">CSV</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
          </section>

          <section className="bg-white/[0.03] rounded-xl p-6 mb-6">
            <h2 className="flex items-center gap-2 text-lg mb-6 text-blue-400"><FaBell /> Notifications</h2>
            {[
              { key: 'budgetReminders', label: 'Budget Reminders' },
              { key: 'savingsAlerts', label: 'Savings Alerts' },
              { key: 'monthlyReports', label: 'Monthly Reports' },
            ].map(({ key, label }) => (
              <div key={key} className="flex justify-between items-center py-4 border-b border-white/10 last:border-0">
                <label className="text-white">{label}</label>
                <button type="button" onClick={() => handleChange(key, !settings[key])} className="text-blue-400 p-2 rounded-lg hover:bg-blue-500/10 cursor-pointer">
                  {settings[key] ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                </button>
              </div>
            ))}
          </section>

          <Button type="submit" className="w-full mt-8 bg-blue-500 hover:bg-blue-600">
            <FaSave className="mr-2" /> Save Settings
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SettingsScreen;
