import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '../../../../hooks/useAnalytics';
import { db } from '../../../../firebase/initFirebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  writeBatch
} from 'firebase/firestore';
import {
  FaDatabase,
  FaArrowLeft,
  FaChartBar,
  FaTrash,
  FaSync,
  FaDownload,
  FaClock
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const AdminDatabaseManagement = () => {
  const navigate = useNavigate();
  const { trackFeatureView, trackAdminAction, trackError } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    collections: {},
    totalDocuments: 0,
    lastBackup: null,
    storageUsed: 0
  });
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Collection names to track
  const COLLECTIONS = [
    'Users',
    'Profiles',
    'Classes',
    'Assignments',
    'Submissions',
    'Messages',
    'SystemSettings',
    'Analytics'
  ];

  useEffect(() => {
    trackFeatureView('admin_database_management');
    loadDatabaseStats();
  }, []);

  const loadDatabaseStats = async () => {
    try {
      setLoading(true);
      const collectionsStats = {};
      let totalDocs = 0;

      for (const collectionName of COLLECTIONS) {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        const docsCount = snapshot.size;

        // Get the most recent document
        const recentQuery = query(collectionRef, orderBy('createdAt', 'desc'), limit(1));
        const recentDocs = await getDocs(recentQuery);
        const lastUpdated = recentDocs.docs[0]?.data()?.createdAt?.toDate() || null;

        collectionsStats[collectionName] = {
          documentCount: docsCount,
          lastUpdated: lastUpdated,
          estimatedSize: docsCount * 2, // Rough estimate in KB
        };

        totalDocs += docsCount;
      }

      setStats({
        collections: collectionsStats,
        totalDocuments: totalDocs,
        lastBackup: new Date().toISOString(), // This should come from your backup service
        storageUsed: totalDocs * 2 // Rough estimate in KB
      });

    } catch (error) {
      console.error('Error loading database stats:', error);
      trackError('LOAD_DB_STATS_ERROR', error.message, 'AdminDatabaseManagement');
    } finally {
      setLoading(false);
    }
  };

  const handleBackupDatabase = async () => {
    try {
      setProcessing(true);
      // Implement your backup logic here
      // This could involve Cloud Functions or a dedicated backup service

      trackAdminAction('backup_database', {
        timestamp: new Date().toISOString()
      });

      alert('Database backup initiated successfully!');
    } catch (error) {
      console.error('Error backing up database:', error);
      trackError('BACKUP_DB_ERROR', error.message, 'AdminDatabaseManagement');
      alert('Error backing up database: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handlePurgeCollection = async (collectionName) => {
    if (!window.confirm(`Are you sure you want to purge all documents in ${collectionName}? This action cannot be undone!`)) {
      return;
    }

    try {
      setProcessing(true);
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);

      // Use batched writes for better performance
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      trackAdminAction('purge_collection', {
        collection: collectionName,
        documentsDeleted: snapshot.size
      });

      await loadDatabaseStats(); // Refresh stats
      alert(`Successfully purged ${snapshot.size} documents from ${collectionName}`);
    } catch (error) {
      console.error('Error purging collection:', error);
      trackError('PURGE_COLLECTION_ERROR', error.message, 'AdminDatabaseManagement');
      alert('Error purging collection: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const toggleMaintenanceMode = async () => {
    try {
      setProcessing(true);
      // Implementation would depend on your maintenance mode logic
      // const maintenanceRef = doc(db, 'SystemSettings', 'maintenance');
      // This is a simplified example
      setMaintenanceMode(!maintenanceMode);

      trackAdminAction('toggle_maintenance_mode', {
        enabled: !maintenanceMode
      });

      alert(`Maintenance mode ${!maintenanceMode ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error toggling maintenance mode:', error);
      trackError('TOGGLE_MAINTENANCE_ERROR', error.message, 'AdminDatabaseManagement');
      alert('Error toggling maintenance mode: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
  };

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
            <FaDatabase className="text-blue-500 [data-theme=light]:text-blue-600" />
            Database Management
          </h1>
          <p className="text-zinc-300 text-lg [data-theme=light]:text-zinc-600">Monitor and manage your database collections</p>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/5 border-white/10 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200 hover:-translate-y-0.5 transition-all duration-300 hover:bg-white/10 [data-theme=light]:hover:bg-zinc-50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="text-2xl text-blue-500 [data-theme=light]:text-blue-600">
                <FaChartBar />
              </div>
              <div>
                <h3 className="text-base text-zinc-300 mb-2 [data-theme=light]:text-zinc-600">Total Documents</h3>
                <p className="text-xl font-semibold m-0">{stats.totalDocuments.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200 hover:-translate-y-0.5 transition-all duration-300 hover:bg-white/10 [data-theme=light]:hover:bg-zinc-50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="text-2xl text-blue-500 [data-theme=light]:text-blue-600">
                <FaDatabase />
              </div>
              <div>
                <h3 className="text-base text-zinc-300 mb-2 [data-theme=light]:text-zinc-600">Storage Used</h3>
                <p className="text-xl font-semibold m-0">{formatBytes(stats.storageUsed * 1024)}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200 hover:-translate-y-0.5 transition-all duration-300 hover:bg-white/10 [data-theme=light]:hover:bg-zinc-50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="text-2xl text-blue-500 [data-theme=light]:text-blue-600">
                <FaClock />
              </div>
              <div>
                <h3 className="text-base text-zinc-300 mb-2 [data-theme=light]:text-zinc-600">Last Backup</h3>
                <p className="text-xl font-semibold m-0">{formatDate(stats.lastBackup)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Button
            onClick={handleBackupDatabase}
            disabled={processing}
            className="flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-70 disabled:cursor-not-allowed [data-theme=light]:bg-blue-600 [data-theme=light]:hover:bg-blue-700"
          >
            <FaDownload />
            Backup Database
          </Button>
          <Button
            onClick={toggleMaintenanceMode}
            disabled={processing}
            className={cn(
              "flex items-center gap-3 text-white disabled:opacity-70 disabled:cursor-not-allowed",
              maintenanceMode
                ? "bg-red-500 hover:bg-red-600 [data-theme=light]:bg-red-600 [data-theme=light]:hover:bg-red-700"
                : "bg-amber-500 hover:bg-amber-600 [data-theme=light]:bg-amber-600 [data-theme=light]:hover:bg-amber-700"
            )}
          >
            <FaSync />
            {maintenanceMode ? 'Disable' : 'Enable'} Maintenance Mode
          </Button>
        </div>

        <Card className="bg-white/5 border-white/10 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200">
          <CardHeader>
            <h2 className="text-xl text-blue-500 mb-6 [data-theme=light]:text-blue-600">Collections</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {COLLECTIONS.map(collectionName => (
                <Card key={collectionName} className="bg-white/5 border-white/10 [data-theme=light]:bg-zinc-50 [data-theme=light]:border-zinc-200 hover:-translate-y-0.5 transition-all duration-300 hover:bg-white/10 [data-theme=light]:hover:bg-zinc-100">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white m-0 [data-theme=light]:text-zinc-900">{collectionName}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePurgeCollection(collectionName)}
                        disabled={processing}
                        className="text-red-500 hover:bg-red-500/10 hover:text-red-400 [data-theme=light]:text-red-600 [data-theme=light]:hover:bg-red-100"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-300 [data-theme=light]:text-zinc-600">Documents:</span>
                        <strong className="text-white [data-theme=light]:text-zinc-900">{stats.collections[collectionName]?.documentCount.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-300 [data-theme=light]:text-zinc-600">Size:</span>
                        <strong className="text-white [data-theme=light]:text-zinc-900">{formatBytes(stats.collections[collectionName]?.estimatedSize * 1024)}</strong>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-zinc-300 [data-theme=light]:text-zinc-600">Last Updated:</span>
                        <strong className="text-white [data-theme=light]:text-zinc-900">{formatDate(stats.collections[collectionName]?.lastUpdated)}</strong>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDatabaseManagement;
