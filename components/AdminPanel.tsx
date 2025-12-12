import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { userService } from '../services/userService';

interface AdminPanelProps {
  currentUser: User;
  onClose: () => void;
  onUserUpdate: () => void;
  t: any;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser, onClose, onUserUpdate, t }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setUsers(userService.getUsers());
  };

  const handleEditClick = (user: User) => {
    setEditingId(user.id);
    setEditValue(user.balance.toString());
  };

  const handleSave = (userId: string) => {
    const newBalance = parseInt(editValue, 10);
    if (!isNaN(newBalance) && newBalance >= 0) {
      userService.updateBalance(userId, newBalance);
      loadUsers();
      
      // If we updated the currently logged in admin, notify parent
      if (userId === currentUser.id) {
        onUserUpdate();
      }
    }
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-extrabold font-brand text-slate-900">{t.admin.title}</h2>
            <p className="text-sm text-slate-500 font-medium">{t.admin.subtitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 bg-white">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider font-brand">{t.admin.thUser}</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider font-brand">{t.admin.thEmail}</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider font-brand">{t.admin.thBalance}</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider font-brand">{t.admin.thAction}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full border border-slate-100" src={user.avatar} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-slate-900 font-brand">{user.name}</div>
                          <div className="text-xs text-slate-400">ID: {user.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600 font-medium">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === user.id ? (
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-24 px-3 py-1 border border-[#FF6B3D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B3D]/20 text-sm font-bold"
                          autoFocus
                        />
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          user.balance > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.balance}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingId === user.id ? (
                        <div className="flex items-center justify-end space-x-3">
                          <button 
                            onClick={() => handleSave(user.id)}
                            className="text-[#FF6B3D] hover:text-[#E55A2B] font-bold"
                          >
                            {t.admin.save}
                          </button>
                          <button 
                            onClick={handleCancel}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            {t.admin.cancel}
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleEditClick(user)}
                          className="text-slate-400 hover:text-[#FF6B3D] transition-colors"
                        >
                          {t.admin.edit}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};