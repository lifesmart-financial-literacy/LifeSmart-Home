import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../firebase/auth';
import { useAnalytics } from '../../../../hooks/useAnalytics';
import { db } from '../../../../firebase/initFirebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import {
  FaUserShield,
  FaArrowLeft,
  FaSearch,
  FaEdit,
  FaBan,
  FaCheck,
  FaTrash,
  FaStar,
  FaUserCog,
  FaCode
} from 'react-icons/fa';
import ConfirmModal from '../../../widgets/modals/ConfirmModal';
import EditModal from '../../../widgets/modals/EditModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const AdminUserManagement = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { trackFeatureView, trackAdminAction, trackError } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    type: 'info',
    action: null
  });

  // Memoize the fetch users function
  const fetchUsers = useCallback(async () => {
    try {
      const usersRef = collection(db, 'Users');
      const usersSnap = await getDocs(usersRef);
      const usersData = [];

      for (const userDoc of usersSnap.docs) {
        const userData = userDoc.data();

        // Fetch the last login and streak from Login Streak document
        let lastLogin = null;
        let streak = 0;
        try {
          const loginStreakRef = doc(db, userDoc.id, 'Login Streak');
          const loginSnap = await getDoc(loginStreakRef);

          if (loginSnap.exists()) {
            const loginData = loginSnap.data();
            lastLogin = loginData.lastLogin;
            streak = loginData.streak || 0;
          }
        } catch (error) {
          console.error('Error fetching login streak for user:', userDoc.id, error);
        }

        // Fetch total funds
        let totalFunds = 0;
        try {
          const fundsRef = doc(db, userDoc.id, 'Total Funds');
          const fundsSnap = await getDoc(fundsRef);

          if (fundsSnap.exists()) {
            totalFunds = fundsSnap.data().amount || 0;
          }
        } catch (error) {
          console.error('Error fetching total funds for user:', userDoc.id, error);
        }

        // Combine all data from the main document
        const user = {
          id: userDoc.id,
          email: userData.email || '',
          admin: userData.admin || false,
          developer: userData.developer || false,
          isActive: userData.isActive !== false,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          school: userData.school || '',
          class: userData.class || '',
          groupCode: userData.groupCode || '',
          role: userData.role || 'user',
          userUID: userDoc.id,
          lastLogin: lastLogin || userData.lastLogin || null,
          streak: streak,
          createdAt: userData.createdAt || null,
          totalFunds: totalFunds
        };

        console.log('Processing user:', user); // Debug log for each user
        usersData.push(user);
      }

      console.log('All fetched users:', usersData); // Debug log for all users
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      trackError('FETCH_USERS_ERROR', error.message, 'AdminUserManagement');
      setLoading(false);
    }
  }, []);

  // Track feature view once on mount
  useEffect(() => {
    trackFeatureView('admin_user_management');
  }, []);

  // Fetch users once on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserAction = async (action, user) => {
    setSelectedUser(user);

    switch (action) {
      case 'edit':
        setShowEditModal(true);
        break;
      case 'toggle-status':
        setModalConfig({
          title: user.isActive ? 'Deactivate User' : 'Activate User',
          message: `Are you sure you want to ${user.isActive ? 'deactivate' : 'activate'} ${user.email}?`,
          type: 'warning',
          action: 'toggle-status'
        });
        break;
      case 'toggle-admin':
        setModalConfig({
          title: user.admin ? 'Remove Admin' : 'Make Admin',
          message: `Are you sure you want to ${user.admin ? 'remove admin rights from' : 'make admin'} ${user.email}?`,
          type: 'warning',
          action: 'toggle-admin'
        });
        break;
      case 'toggle-developer':
        setModalConfig({
          title: user.developer ? 'Remove Developer' : 'Make Developer',
          message: `Are you sure you want to ${user.developer ? 'remove developer rights from' : 'make developer'} ${user.email}?`,
          type: 'warning',
          action: 'toggle-developer'
        });
        break;
      case 'delete':
        setModalConfig({
          title: 'Delete User',
          message: `Are you sure you want to delete ${user.email}? This action cannot be undone.`,
          type: 'danger',
          action: 'delete'
        });
        break;
      default:
        return;
    }

    setShowModal(true);
  };

  const handleEditSave = async (updatedData) => {
    await fetchUsers(); // Refresh the user list after edit
    trackAdminAction('edit_user', {
      userId: selectedUser.id,
      changes: Object.keys(updatedData).join(', ')
    });
  };

  const handleConfirmAction = async () => {
    if (!selectedUser) return;

    try {
      const userRef = doc(db, 'Users', selectedUser.id);
      const userProfileRef = doc(db, selectedUser.id, 'Profile');

      switch (modalConfig.action) {
        case 'toggle-status':
          console.log('Toggling status for user:', selectedUser.id);
          await updateDoc(userRef, {
            isActive: !selectedUser.isActive
          });
          // Update Profile document
          await updateDoc(userProfileRef, {
            isActive: !selectedUser.isActive
          });
          trackAdminAction('toggle_user_status', {
            userId: selectedUser.id,
            newStatus: !selectedUser.isActive
          });
          break;

        case 'toggle-admin':
          console.log('Toggling admin for user:', selectedUser.id);
          const newAdminStatus = !selectedUser.admin;
          await updateDoc(userRef, {
            admin: newAdminStatus,
            user: !newAdminStatus
          });
          // Update Profile document
          await updateDoc(userProfileRef, {
            admin: newAdminStatus,
            user: !newAdminStatus
          });
          trackAdminAction('toggle_admin_status', {
            userId: selectedUser.id,
            newStatus: newAdminStatus
          });
          break;

        case 'toggle-developer':
          console.log('Toggling developer for user:', selectedUser.id);
          const newDevStatus = !selectedUser.developer;
          await updateDoc(userRef, {
            developer: newDevStatus,
            user: !newDevStatus
          });
          // Update Profile document
          await updateDoc(userProfileRef, {
            developer: newDevStatus,
            user: !newDevStatus
          });
          trackAdminAction('toggle_developer_status', {
            userId: selectedUser.id,
            newStatus: newDevStatus
          });
          break;

        case 'delete':
          console.log('Deleting user:', selectedUser.id);
          try {
            // Delete the Profile document first
            await deleteDoc(userProfileRef);

            // Then delete the main user document
            await deleteDoc(userRef);

            trackAdminAction('delete_user', {
              userId: selectedUser.id
            });
          } catch (deleteError) {
            console.error('Error during delete:', deleteError);
            throw deleteError;
          }
          break;

        default:
          break;
      }

      // Show success message
      alert(`Action ${modalConfig.action} completed successfully`);

      // Refresh the user list after any changes
      await fetchUsers();
      setShowModal(false);
      setSelectedUser(null);

    } catch (error) {
      console.error('Error updating user:', error);
      alert(`Error: ${error.message}`);
      trackError('USER_UPDATE_ERROR', error.message, 'AdminUserManagement');
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <FaUserShield className="text-blue-500 [data-theme=light]:text-blue-600" />
            User Management
          </h1>
          <p className="text-zinc-300 text-lg [data-theme=light]:text-zinc-600">Manage user accounts and permissions</p>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-8">
          <div className="relative flex-1 min-w-[300px]">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 [data-theme=light]:text-zinc-400" size={24} />
            <Input
              type="text"
              placeholder="Search by name, email, school, or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white/5 border-white/15 text-white placeholder:text-white/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200 [data-theme=light]:text-zinc-900 [data-theme=light]:placeholder:text-zinc-400"
            />
          </div>
          <div className="flex gap-8 justify-around md:justify-start">
            <div className="text-center text-zinc-300 [data-theme=light]:text-zinc-600 font-medium">
              <strong className="block text-white text-2xl mb-1 [data-theme=light]:text-zinc-900">{users.length}</strong> Total Users
            </div>
            <div className="text-center text-zinc-300 [data-theme=light]:text-zinc-600 font-medium">
              <strong className="block text-white text-2xl mb-1 [data-theme=light]:text-zinc-900">{users.filter(u => u.admin).length}</strong> Admins
            </div>
            <div className="text-center text-zinc-300 [data-theme=light]:text-zinc-600 font-medium">
              <strong className="block text-white text-2xl mb-1 [data-theme=light]:text-zinc-900">{users.filter(u => u.developer).length}</strong> Developers
            </div>
            <div className="text-center text-zinc-300 [data-theme=light]:text-zinc-600 font-medium">
              <strong className="block text-white text-2xl mb-1 [data-theme=light]:text-zinc-900">{users.filter(u => u.isActive).length}</strong> Active
            </div>
          </div>
        </div>

        <Card className="bg-white/5 border-white/10 overflow-hidden mb-8 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[900px]">
              <thead>
                <tr>
                  <th className="px-4 py-5 text-left bg-black/30 font-semibold text-white text-sm uppercase tracking-wider whitespace-nowrap border-b border-white/10 [data-theme=light]:bg-zinc-100 [data-theme=light]:text-zinc-900 [data-theme=light]:border-zinc-200">User Info</th>
                  <th className="px-4 py-5 text-left bg-black/30 font-semibold text-white text-sm uppercase tracking-wider whitespace-nowrap border-b border-white/10 [data-theme=light]:bg-zinc-100 [data-theme=light]:text-zinc-900 [data-theme=light]:border-zinc-200">School</th>
                  <th className="px-4 py-5 text-left bg-black/30 font-semibold text-white text-sm uppercase tracking-wider whitespace-nowrap border-b border-white/10 [data-theme=light]:bg-zinc-100 [data-theme=light]:text-zinc-900 [data-theme=light]:border-zinc-200">Class & Group</th>
                  <th className="px-4 py-5 text-left bg-black/30 font-semibold text-white text-sm uppercase tracking-wider whitespace-nowrap border-b border-white/10 [data-theme=light]:bg-zinc-100 [data-theme=light]:text-zinc-900 [data-theme=light]:border-zinc-200">Roles</th>
                  <th className="px-4 py-5 text-left bg-black/30 font-semibold text-white text-sm uppercase tracking-wider whitespace-nowrap border-b border-white/10 [data-theme=light]:bg-zinc-100 [data-theme=light]:text-zinc-900 [data-theme=light]:border-zinc-200">Last Login</th>
                  <th className="px-4 py-5 text-left bg-black/30 font-semibold text-white text-sm uppercase tracking-wider whitespace-nowrap border-b border-white/10 [data-theme=light]:bg-zinc-100 [data-theme=light]:text-zinc-900 [data-theme=light]:border-zinc-200">Total Funds</th>
                  <th className="px-4 py-5 text-left bg-black/30 font-semibold text-white text-sm uppercase tracking-wider whitespace-nowrap border-b border-white/10 [data-theme=light]:bg-zinc-100 [data-theme=light]:text-zinc-900 [data-theme=light]:border-zinc-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-white/5 [data-theme=light]:hover:bg-zinc-50">
                    <td className="px-4 py-5 border-b border-white/10 min-w-[250px] [data-theme=light]:border-zinc-200">
                      <div className="flex flex-col gap-1">
                        <span className="text-base font-semibold text-white truncate cursor-help [data-theme=light]:text-zinc-900" title={`${user.firstName} ${user.lastName}`}>
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="text-sm text-zinc-300 [data-theme=light]:text-zinc-600" title={user.email}>
                          {user.email}
                        </span>
                        <span className="text-sm text-zinc-500 font-mono [data-theme=light]:text-zinc-500" title={`User ID: ${user.userUID}`}>
                          ID: {user.userUID}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-5 border-b border-white/10 [data-theme=light]:border-zinc-200">
                      <span className="block text-zinc-300 min-w-[150px] max-w-[250px] [data-theme=light]:text-zinc-600" title={user.school}>
                        {user.school || 'Not specified'}
                      </span>
                    </td>
                    <td className="px-4 py-5 border-b border-white/10 [data-theme=light]:border-zinc-200">
                      <div className="flex flex-col gap-2 min-w-[120px]">
                        <span className="text-base font-medium text-white [data-theme=light]:text-zinc-900" title={`Class: ${user.class}`}>
                          {user.class || 'Not specified'}
                        </span>
                        {user.groupCode && (
                          <span className="text-sm text-zinc-300 px-3 py-1 bg-white/10 rounded inline-block [data-theme=light]:bg-zinc-100 [data-theme=light]:text-zinc-600" title={`Group: ${user.groupCode}`}>
                            Group: {user.groupCode}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-5 border-b border-white/10 [data-theme=light]:border-zinc-200">
                      <div className="flex flex-wrap gap-2 min-w-[120px]">
                        {user.admin ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-500/15 text-blue-300 [data-theme=light]:bg-blue-100 [data-theme=light]:text-blue-700">Admin</span>
                        ) : user.developer ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-500/15 text-purple-300 [data-theme=light]:bg-purple-100 [data-theme=light]:text-purple-700">Developer</span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-500/15 text-amber-300 [data-theme=light]:bg-amber-100 [data-theme=light]:text-amber-700">User</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-5 border-b border-white/10 [data-theme=light]:border-zinc-200">
                      <div className="flex flex-col gap-2">
                        <span className="text-zinc-300 [data-theme=light]:text-zinc-600">
                          {user.lastLogin || 'Never'}
                        </span>
                        {user.streak > 0 && (
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-400 bg-amber-400/10 px-2 py-1 rounded whitespace-nowrap [data-theme=light]:bg-amber-100 [data-theme=light]:text-amber-700" title="Current login streak">
                            🔥 {user.streak} days
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-5 border-b border-white/10 [data-theme=light]:border-zinc-200">
                      <span className="font-mono text-base font-semibold text-green-500 bg-green-500/10 px-3 py-1 rounded inline-block [data-theme=light]:bg-green-100 [data-theme=light]:text-green-700">
                        £{user.totalFunds.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-5 border-b border-white/10 min-w-[200px] [data-theme=light]:border-zinc-200">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUserAction('edit', user)}
                          title="Edit User"
                          className="h-8 w-8 bg-white/10 hover:bg-blue-500 text-white [data-theme=light]:bg-zinc-200 [data-theme=light]:text-zinc-900 [data-theme=light]:hover:bg-blue-500 [data-theme=light]:hover:text-white"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUserAction('toggle-status', user)}
                          title={user.isActive ? 'Deactivate User' : 'Activate User'}
                          className={cn(
                            "h-8 w-8 text-white [data-theme=light]:text-zinc-900",
                            user.isActive ? "bg-white/20 hover:bg-red-500" : "bg-white/10 hover:bg-green-500"
                          )}
                        >
                          {user.isActive ? <FaBan /> : <FaCheck />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUserAction('toggle-admin', user)}
                          title={user.admin ? 'Remove Admin' : 'Make Admin'}
                          className="h-8 w-8 bg-white/10 hover:bg-amber-500 text-white [data-theme=light]:bg-zinc-200 [data-theme=light]:text-zinc-900 [data-theme=light]:hover:bg-purple-500 [data-theme=light]:hover:text-white"
                        >
                          {user.admin ? <FaUserCog /> : <FaStar />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUserAction('toggle-developer', user)}
                          title={user.developer ? 'Remove Developer' : 'Make Developer'}
                          className="h-8 w-8 bg-white/10 hover:bg-purple-500 text-white [data-theme=light]:bg-zinc-200 [data-theme=light]:text-zinc-900 [data-theme=light]:hover:bg-purple-600 [data-theme=light]:hover:text-white"
                        >
                          <FaCode />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUserAction('delete', user)}
                          title="Delete User"
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

      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmAction}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />

      <EditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        userId={selectedUser?.id}
        onSave={handleEditSave}
      />
    </div>
  );
};

export default AdminUserManagement;
