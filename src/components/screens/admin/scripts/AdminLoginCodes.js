import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '../../../../hooks/useAnalytics';
import { db } from '../../../../firebase/initFirebase';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, query } from 'firebase/firestore';
import {
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaCheck,
  FaBan,
  FaCopy,
  FaKey,
  FaFire
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const AdminLoginCodes = () => {
  const navigate = useNavigate();
  const { trackFeatureView, trackAdminAction, trackError } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [codes, setCodes] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCode, setNewCode] = useState({
    name: '',
    active: true
  });

  useEffect(() => {
    trackFeatureView('admin_login_codes');
    fetchCodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  const fetchCodes = async () => {
    try {
      const codesRef = collection(db, 'Login Codes');
      const codesQuery = query(codesRef);
      const codesSnap = await getDocs(codesQuery);

      const codesData = [];

      for (const codeDoc of codesSnap.docs) {
        const codeData = codeDoc.data();

        // Fetch the last login and streak from Login Streak subcollection
        let lastLogin = null;
        let streak = 0;

        if (codeData.lastUsedBy) {
          try {
            const userRef = doc(db, 'Users', codeData.lastUsedBy);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const ud = userSnap.data();
              lastLogin = ud.lastLogin || null;
              streak = ud.streak || 0;
            }
          } catch (error) {
            console.error('Error fetching user for code:', codeDoc.id, error);
          }
        }

        codesData.push({
          id: codeDoc.id,
          active: codeData.active,
          lastLogin,
          streak,
          lastUsedBy: codeData.lastUsedBy || null
        });
      }

      setCodes(codesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching login codes:', error);
      trackError('FETCH_CODES_ERROR', error.message, 'AdminLoginCodes');
      setLoading(false);
    }
  };

  const handleCreateCode = async (e) => {
    e.preventDefault();
    try {
      const codeData = {
        active: true
      };

      await setDoc(doc(db, 'Login Codes', newCode.name), codeData);
      trackAdminAction('create_login_code', { codeName: newCode.name });
      setShowCreateModal(false);
      setNewCode({ name: '', active: true });
      fetchCodes();
    } catch (error) {
      console.error('Error creating login code:', error);
      trackError('CREATE_CODE_ERROR', error.message, 'AdminLoginCodes');
      alert('Error creating login code: ' + error.message);
    }
  };

  const handleToggleCode = async (codeId, currentStatus) => {
    try {
      const codeRef = doc(db, 'Login Codes', codeId);
      await updateDoc(codeRef, {
        active: !currentStatus
      });
      trackAdminAction('toggle_login_code', { codeId, newStatus: !currentStatus });
      fetchCodes();
    } catch (error) {
      console.error('Error toggling login code:', error);
      trackError('TOGGLE_CODE_ERROR', error.message, 'AdminLoginCodes');
      alert('Error updating login code: ' + error.message);
    }
  };

  const handleDeleteCode = async (codeId) => {
    if (!window.confirm('Are you sure you want to delete this login code? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'Login Codes', codeId));
      trackAdminAction('delete_login_code', { codeId });
      fetchCodes();
    } catch (error) {
      console.error('Error deleting login code:', error);
      trackError('DELETE_CODE_ERROR', error.message, 'AdminLoginCodes');
      alert('Error deleting login code: ' + error.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    trackAdminAction('copy_login_code', { codeName: text });
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
      <header className="max-w-[1400px] mx-auto mb-12 pb-8 border-b border-white/10 [data-theme=light]:border-zinc-200">
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
            <FaKey className="text-blue-500 [data-theme=light]:text-blue-600" />
            Login Codes Management
          </h1>
          <p className="text-zinc-300 text-lg [data-theme=light]:text-zinc-600">Manage login codes for user access</p>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-8">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white [data-theme=light]:bg-blue-600 [data-theme=light]:hover:bg-blue-700"
          >
            <FaPlus size={16} />
            Create New Code
          </Button>
          <div className="flex gap-8 justify-around md:justify-start">
            <div className="text-center text-zinc-300 [data-theme=light]:text-zinc-600 font-medium">
              <strong className="block text-white text-2xl mb-1 [data-theme=light]:text-zinc-900">{codes.length}</strong> Total Codes
            </div>
            <div className="text-center text-zinc-300 [data-theme=light]:text-zinc-600 font-medium">
              <strong className="block text-white text-2xl mb-1 [data-theme=light]:text-zinc-900">{codes.filter(c => c.active).length}</strong> Active Codes
            </div>
          </div>
        </div>

        <Card className="bg-white/5 border-white/10 overflow-hidden mb-8 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="px-4 py-5 text-left bg-black/30 font-semibold text-white text-sm uppercase tracking-wider whitespace-nowrap border-b border-white/10 [data-theme=light]:bg-zinc-100 [data-theme=light]:text-zinc-900 [data-theme=light]:border-zinc-200">Code</th>
                  <th className="px-4 py-5 text-left bg-black/30 font-semibold text-white text-sm uppercase tracking-wider whitespace-nowrap border-b border-white/10 [data-theme=light]:bg-zinc-100 [data-theme=light]:text-zinc-900 [data-theme=light]:border-zinc-200">Status</th>
                  <th className="px-4 py-5 text-left bg-black/30 font-semibold text-white text-sm uppercase tracking-wider whitespace-nowrap border-b border-white/10 [data-theme=light]:bg-zinc-100 [data-theme=light]:text-zinc-900 [data-theme=light]:border-zinc-200">Last Used</th>
                  <th className="px-4 py-5 text-left bg-black/30 font-semibold text-white text-sm uppercase tracking-wider whitespace-nowrap border-b border-white/10 [data-theme=light]:bg-zinc-100 [data-theme=light]:text-zinc-900 [data-theme=light]:border-zinc-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {codes.map(code => (
                  <tr key={code.id} className="hover:bg-white/5 [data-theme=light]:hover:bg-zinc-50">
                    <td className="px-4 py-5 border-b border-white/10 [data-theme=light]:border-zinc-200">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base tracking-wide text-green-500 [data-theme=light]:text-green-700">{code.id}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(code.id)}
                          title="Copy code"
                          className="h-8 w-8 text-zinc-500 hover:text-blue-500 hover:bg-blue-500/10 [data-theme=light]:text-zinc-400 [data-theme=light]:hover:text-blue-600"
                        >
                          <FaCopy size={14} />
                        </Button>
                      </div>
                    </td>
                    <td className="px-4 py-5 border-b border-white/10 [data-theme=light]:border-zinc-200">
                      <span className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold",
                        code.active
                          ? "bg-green-500/15 text-green-400 [data-theme=light]:bg-green-100 [data-theme=light]:text-green-700"
                          : "bg-red-500/15 text-red-400 [data-theme=light]:bg-red-100 [data-theme=light]:text-red-700"
                      )}>
                        {code.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-5 border-b border-white/10 [data-theme=light]:border-zinc-200">
                      <div className="flex flex-col gap-2">
                        <span className="text-zinc-300 [data-theme=light]:text-zinc-600">
                          {code.lastLogin ?
                            new Date(code.lastLogin.seconds * 1000).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                            : 'Never'
                          }
                        </span>
                        {code.streak > 0 && (
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-400 [data-theme=light]:text-amber-700" title="Current login streak">
                            <FaFire /> {code.streak} days
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-5 border-b border-white/10 [data-theme=light]:border-zinc-200">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleCode(code.id, code.active)}
                          title={code.active ? 'Deactivate Code' : 'Activate Code'}
                          className={cn(
                            "h-8 w-8 text-white [data-theme=light]:text-zinc-900",
                            code.active ? "bg-white/10 hover:bg-red-500" : "bg-white/10 hover:bg-green-500"
                          )}
                        >
                          {code.active ? <FaBan /> : <FaCheck />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCode(code.id)}
                          title="Delete Code"
                          className="h-8 w-8 bg-white/10 hover:bg-red-500 text-white [data-theme=light]:bg-zinc-200 [data-theme=light]:text-zinc-900 [data-theme=light]:hover:bg-red-500 [data-theme=light]:hover:text-white"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-zinc-900 border-white/10 text-white [data-theme=light]:bg-white [data-theme=light]:border-zinc-200 [data-theme=light]:text-zinc-900">
          <DialogHeader>
            <DialogTitle className="text-xl [data-theme=light]:text-zinc-900">Create New Login Code</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCode}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="codeName" className="text-zinc-300 [data-theme=light]:text-zinc-600">Code Name</Label>
                <Input
                  id="codeName"
                  type="text"
                  value={newCode.name}
                  onChange={(e) => setNewCode({ ...newCode, name: e.target.value })}
                  required
                  placeholder="Enter code name"
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200 [data-theme=light]:text-zinc-900"
                />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="bg-white/10 border-white/10 text-white hover:bg-white/20 [data-theme=light]:bg-zinc-100 [data-theme=light]:text-zinc-900 [data-theme=light]:border-zinc-200 [data-theme=light]:hover:bg-zinc-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white [data-theme=light]:bg-blue-600 [data-theme=light]:hover:bg-blue-700"
              >
                Create Code
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLoginCodes;
