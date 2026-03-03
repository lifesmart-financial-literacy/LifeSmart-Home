import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '../../../../hooks/useAnalytics';
import { db } from '../../../../firebase/initFirebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  FaCog,
  FaArrowLeft,
  FaSchool,
  FaLock,
  FaBell,
  FaChartLine,
  FaSave
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const AdminSystemSettings = () => {
  const navigate = useNavigate();
  const { trackFeatureView, trackAdminAction, trackError } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    academic: {
      maxClassSize: 35,
      allowNewRegistrations: true,
      requireSchoolCode: true,
      defaultSchoolCode: 'LIFESMART2024',
      academicYear: '2023-2024',
      terms: ['Autumn', 'Spring', 'Summer'],
      currentTerm: 'Spring'
    },
    security: {
      requireEmailVerification: true,
      maxLoginAttempts: 5,
      sessionTimeout: 60, // minutes
      passwordMinLength: 8,
      requireStrongPassword: true,
      twoFactorEnabled: false
    },
    notifications: {
      enableEmailNotifications: true,
      enablePushNotifications: false,
      notifyOnNewRegistration: true,
      notifyOnUserDelete: true,
      notifyOnFailedLogin: true,
      dailyReportTime: '06:00'
    },
    analytics: {
      trackUserBehavior: true,
      trackErrors: true,
      trackPerformance: true,
      retentionPeriod: 90, // days
      anonymizeData: true
    }
  });

  useEffect(() => {
    trackFeatureView('admin_system_settings');
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settingsRef = doc(db, 'SystemSettings', 'config');
      const settingsSnap = await getDoc(settingsRef);

      if (settingsSnap.exists()) {
        setSettings(prevSettings => ({
          ...prevSettings,
          ...settingsSnap.data()
        }));
      } else {
        // If no settings exist, create them with defaults
        await setDoc(settingsRef, settings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      trackError('LOAD_SETTINGS_ERROR', error.message, 'AdminSystemSettings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const settingsRef = doc(db, 'SystemSettings', 'config');
      await setDoc(settingsRef, settings);

      trackAdminAction('update_system_settings', {
        categories: Object.keys(settings)
      });

      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      trackError('SAVE_SETTINGS_ERROR', error.message, 'AdminSystemSettings');
      alert('Error saving settings: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClasses = "bg-white/5 border-white/20 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200 [data-theme=light]:text-zinc-900";
  const labelClasses = "text-zinc-300 text-base [data-theme=light]:text-zinc-600";

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-zinc-900 [data-theme=light]:bg-gradient-to-br [data-theme=light]:from-gray-100 [data-theme=light]:to-gray-200">
        <div className="w-12 h-12 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-4 md:p-8 [data-theme=light]:bg-gradient-to-br [data-theme=light]:from-gray-100 [data-theme=light]:to-gray-200 [data-theme=light]:text-zinc-900">
      <header className="max-w-[1200px] mx-auto mb-12 pb-8 border-b border-white/10 [data-theme=light]:border-zinc-200">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin')}
          className="mb-8 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-0 [data-theme=light]:bg-zinc-200 [data-theme=light]:text-zinc-900 [data-theme=light]:hover:bg-zinc-300"
        >
          <FaArrowLeft size={20} />
          <span>Back to Admin Panel</span>
        </Button>
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl mb-4 flex items-center justify-center gap-4 font-semibold">
            <FaCog className="text-blue-500 [data-theme=light]:text-blue-600" />
            System Settings
          </h1>
          <p className="text-zinc-300 text-lg [data-theme=light]:text-zinc-600">Configure system-wide settings and preferences</p>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto flex flex-col gap-8">
        <Card className="bg-white/5 border-white/10 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200">
          <CardHeader>
            <h2 className="text-xl flex items-center gap-3 text-blue-500 [data-theme=light]:text-blue-600"><FaSchool /> Academic Settings</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <Label className={labelClasses}>Maximum Class Size</Label>
                <Input
                  type="number"
                  value={settings.academic.maxClassSize}
                  onChange={(e) => handleChange('academic', 'maxClassSize', parseInt(e.target.value))}
                  className={inputClasses}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className={labelClasses}>Academic Year</Label>
                <Input
                  type="text"
                  value={settings.academic.academicYear}
                  onChange={(e) => handleChange('academic', 'academicYear', e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className={labelClasses}>Current Term</Label>
                <select
                  value={settings.academic.currentTerm}
                  onChange={(e) => handleChange('academic', 'currentTerm', e.target.value)}
                  className={cn("px-3 py-2 rounded-md border transition-all", inputClasses)}
                >
                  {settings.academic.terms.map(term => (
                    <option key={term} value={term}>{term}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-row items-center gap-3">
                <input
                  type="checkbox"
                  id="allowNewRegistrations"
                  checked={settings.academic.allowNewRegistrations}
                  onChange={(e) => handleChange('academic', 'allowNewRegistrations', e.target.checked)}
                  className="w-5 h-5 cursor-pointer rounded"
                />
                <Label htmlFor="allowNewRegistrations" className={cn(labelClasses, "cursor-pointer")}>Allow New Registrations</Label>
              </div>
              <div className="flex flex-row items-center gap-3">
                <input
                  type="checkbox"
                  id="requireSchoolCode"
                  checked={settings.academic.requireSchoolCode}
                  onChange={(e) => handleChange('academic', 'requireSchoolCode', e.target.checked)}
                  className="w-5 h-5 cursor-pointer rounded"
                />
                <Label htmlFor="requireSchoolCode" className={cn(labelClasses, "cursor-pointer")}>Require School Code</Label>
              </div>
              <div className="flex flex-col gap-2">
                <Label className={labelClasses}>Default School Code</Label>
                <Input
                  type="text"
                  value={settings.academic.defaultSchoolCode}
                  onChange={(e) => handleChange('academic', 'defaultSchoolCode', e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200">
          <CardHeader>
            <h2 className="text-xl flex items-center gap-3 text-blue-500 [data-theme=light]:text-blue-600"><FaLock /> Security Settings</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <Label className={labelClasses}>Maximum Login Attempts</Label>
                <Input
                  type="number"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => handleChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                  className={inputClasses}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className={labelClasses}>Session Timeout (minutes)</Label>
                <Input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value))}
                  className={inputClasses}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className={labelClasses}>Minimum Password Length</Label>
                <Input
                  type="number"
                  value={settings.security.passwordMinLength}
                  onChange={(e) => handleChange('security', 'passwordMinLength', parseInt(e.target.value))}
                  className={inputClasses}
                />
              </div>
              <div className="flex flex-row items-center gap-3">
                <input
                  type="checkbox"
                  id="requireEmailVerification"
                  checked={settings.security.requireEmailVerification}
                  onChange={(e) => handleChange('security', 'requireEmailVerification', e.target.checked)}
                  className="w-5 h-5 cursor-pointer rounded"
                />
                <Label htmlFor="requireEmailVerification" className={cn(labelClasses, "cursor-pointer")}>Require Email Verification</Label>
              </div>
              <div className="flex flex-row items-center gap-3">
                <input
                  type="checkbox"
                  id="requireStrongPassword"
                  checked={settings.security.requireStrongPassword}
                  onChange={(e) => handleChange('security', 'requireStrongPassword', e.target.checked)}
                  className="w-5 h-5 cursor-pointer rounded"
                />
                <Label htmlFor="requireStrongPassword" className={cn(labelClasses, "cursor-pointer")}>Require Strong Password</Label>
              </div>
              <div className="flex flex-row items-center gap-3">
                <input
                  type="checkbox"
                  id="twoFactorEnabled"
                  checked={settings.security.twoFactorEnabled}
                  onChange={(e) => handleChange('security', 'twoFactorEnabled', e.target.checked)}
                  className="w-5 h-5 cursor-pointer rounded"
                />
                <Label htmlFor="twoFactorEnabled" className={cn(labelClasses, "cursor-pointer")}>Enable Two-Factor Authentication</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200">
          <CardHeader>
            <h2 className="text-xl flex items-center gap-3 text-blue-500 [data-theme=light]:text-blue-600"><FaBell /> Notification Settings</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-row items-center gap-3">
                <input
                  type="checkbox"
                  id="enableEmailNotifications"
                  checked={settings.notifications.enableEmailNotifications}
                  onChange={(e) => handleChange('notifications', 'enableEmailNotifications', e.target.checked)}
                  className="w-5 h-5 cursor-pointer rounded"
                />
                <Label htmlFor="enableEmailNotifications" className={cn(labelClasses, "cursor-pointer")}>Enable Email Notifications</Label>
              </div>
              <div className="flex flex-row items-center gap-3">
                <input
                  type="checkbox"
                  id="enablePushNotifications"
                  checked={settings.notifications.enablePushNotifications}
                  onChange={(e) => handleChange('notifications', 'enablePushNotifications', e.target.checked)}
                  className="w-5 h-5 cursor-pointer rounded"
                />
                <Label htmlFor="enablePushNotifications" className={cn(labelClasses, "cursor-pointer")}>Enable Push Notifications</Label>
              </div>
              <div className="flex flex-row items-center gap-3">
                <input
                  type="checkbox"
                  id="notifyOnNewRegistration"
                  checked={settings.notifications.notifyOnNewRegistration}
                  onChange={(e) => handleChange('notifications', 'notifyOnNewRegistration', e.target.checked)}
                  className="w-5 h-5 cursor-pointer rounded"
                />
                <Label htmlFor="notifyOnNewRegistration" className={cn(labelClasses, "cursor-pointer")}>Notify on New Registration</Label>
              </div>
              <div className="flex flex-row items-center gap-3">
                <input
                  type="checkbox"
                  id="notifyOnUserDelete"
                  checked={settings.notifications.notifyOnUserDelete}
                  onChange={(e) => handleChange('notifications', 'notifyOnUserDelete', e.target.checked)}
                  className="w-5 h-5 cursor-pointer rounded"
                />
                <Label htmlFor="notifyOnUserDelete" className={cn(labelClasses, "cursor-pointer")}>Notify on User Deletion</Label>
              </div>
              <div className="flex flex-row items-center gap-3">
                <input
                  type="checkbox"
                  id="notifyOnFailedLogin"
                  checked={settings.notifications.notifyOnFailedLogin}
                  onChange={(e) => handleChange('notifications', 'notifyOnFailedLogin', e.target.checked)}
                  className="w-5 h-5 cursor-pointer rounded"
                />
                <Label htmlFor="notifyOnFailedLogin" className={cn(labelClasses, "cursor-pointer")}>Notify on Failed Login Attempts</Label>
              </div>
              <div className="flex flex-col gap-2">
                <Label className={labelClasses}>Daily Report Time</Label>
                <Input
                  type="time"
                  value={settings.notifications.dailyReportTime}
                  onChange={(e) => handleChange('notifications', 'dailyReportTime', e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200">
          <CardHeader>
            <h2 className="text-xl flex items-center gap-3 text-blue-500 [data-theme=light]:text-blue-600"><FaChartLine /> Analytics Settings</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-row items-center gap-3">
                <input
                  type="checkbox"
                  id="trackUserBehavior"
                  checked={settings.analytics.trackUserBehavior}
                  onChange={(e) => handleChange('analytics', 'trackUserBehavior', e.target.checked)}
                  className="w-5 h-5 cursor-pointer rounded"
                />
                <Label htmlFor="trackUserBehavior" className={cn(labelClasses, "cursor-pointer")}>Track User Behavior</Label>
              </div>
              <div className="flex flex-row items-center gap-3">
                <input
                  type="checkbox"
                  id="trackErrors"
                  checked={settings.analytics.trackErrors}
                  onChange={(e) => handleChange('analytics', 'trackErrors', e.target.checked)}
                  className="w-5 h-5 cursor-pointer rounded"
                />
                <Label htmlFor="trackErrors" className={cn(labelClasses, "cursor-pointer")}>Track Errors</Label>
              </div>
              <div className="flex flex-row items-center gap-3">
                <input
                  type="checkbox"
                  id="trackPerformance"
                  checked={settings.analytics.trackPerformance}
                  onChange={(e) => handleChange('analytics', 'trackPerformance', e.target.checked)}
                  className="w-5 h-5 cursor-pointer rounded"
                />
                <Label htmlFor="trackPerformance" className={cn(labelClasses, "cursor-pointer")}>Track Performance</Label>
              </div>
              <div className="flex flex-col gap-2">
                <Label className={labelClasses}>Data Retention Period (days)</Label>
                <Input
                  type="number"
                  value={settings.analytics.retentionPeriod}
                  onChange={(e) => handleChange('analytics', 'retentionPeriod', parseInt(e.target.value))}
                  className={inputClasses}
                />
              </div>
              <div className="flex flex-row items-center gap-3">
                <input
                  type="checkbox"
                  id="anonymizeData"
                  checked={settings.analytics.anonymizeData}
                  onChange={(e) => handleChange('analytics', 'anonymizeData', e.target.checked)}
                  className="w-5 h-5 cursor-pointer rounded"
                />
                <Label htmlFor="anonymizeData" className={cn(labelClasses, "cursor-pointer")}>Anonymize Analytics Data</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end py-8">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg font-medium disabled:opacity-70 disabled:cursor-not-allowed [data-theme=light]:bg-blue-600 [data-theme=light]:hover:bg-blue-700"
          >
            <FaSave />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AdminSystemSettings;
