import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reorder } from 'framer-motion';
import { useAnalytics } from '../../../../hooks/useAnalytics';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/initFirebase';
import {
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaGripVertical,
  FaSave,
  FaCog,
  FaFolder,
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DEFAULT_GROUP_CONFIG, migrateToGroups, getIconComponent, USER_ROLES, AVAILABLE_PATHS } from '@/lib/toolConfig';
import Modal from '../../../widgets/modals/Modal';
import ConfirmModal from '../../../widgets/modals/ConfirmModal';
import IconPickerModal from '../../../widgets/modals/IconPickerModal';

const TOOL_CONFIG_REF = { collection: 'SystemSettings', id: 'toolConfig' };

const createEmptyTool = () => ({
  id: `tool-${Date.now()}`,
  type: 'internal',
  path: '/',
  label: 'New Tool',
  icon: 'FaLink',
  color: '#2196F3',
  enabled: true,
  inDevelopment: false,
  order: 0,
  allowedRoles: ['user', 'admin', 'developer'],
});

const createEmptyGroup = () => ({
  id: `group-${Date.now()}`,
  label: 'New Group',
  order: 0,
  tools: [],
});

const AdminToolConfig = () => {
  const navigate = useNavigate();
  const { trackFeatureView, trackAdminAction, trackError } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [groups, setGroups] = useState([]);
  const [modal, setModal] = useState({ open: false, title: '', message: '', type: 'success' });
  const [confirmRemove, setConfirmRemove] = useState({ open: false, type: null, groupIndex: null, toolIndex: null });
  const [iconPicker, setIconPicker] = useState({ open: false, groupIndex: null, toolIndex: null });

  useEffect(() => {
    trackFeatureView('admin_tool_config');
    loadConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const ref = doc(db, TOOL_CONFIG_REF.collection, TOOL_CONFIG_REF.id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const migrated = migrateToGroups(snap.data());
        setGroups(migrated);
      } else {
        setGroups([...DEFAULT_GROUP_CONFIG]);
      }
    } catch (err) {
      console.error('loadConfig:', err);
      trackError('LOAD_TOOL_CONFIG_ERROR', err.message, 'AdminToolConfig');
      setGroups([...DEFAULT_GROUP_CONFIG]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const ref = doc(db, TOOL_CONFIG_REF.collection, TOOL_CONFIG_REF.id);
      const toSave = groups.map((g, gi) => ({
        ...g,
        order: gi,
        tools: (g.tools || []).map((t, ti) => ({ ...t, order: ti })),
      }));
      await setDoc(ref, { groups: toSave, updatedAt: new Date().toISOString() });
      trackAdminAction('save_tool_config', { groupCount: groups.length });
      setModal({ open: true, title: 'Saved', message: 'Tool configuration saved successfully!', type: 'success' });
    } catch (err) {
      console.error('handleSave:', err);
      trackError('SAVE_TOOL_CONFIG_ERROR', err.message, 'AdminToolConfig');
      setModal({ open: true, title: 'Error', message: 'Error saving: ' + err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const addGroup = () => {
    setGroups((prev) => [...prev, createEmptyGroup()]);
  };

  const addToolToGroup = (groupIndex) => {
    setGroups((prev) =>
      prev.map((g, i) =>
        i === groupIndex ? { ...g, tools: [...(g.tools || []), createEmptyTool()] } : g
      )
    );
  };

  const updateGroup = (groupIndex, field, value) => {
    setGroups((prev) => prev.map((g, i) => (i === groupIndex ? { ...g, [field]: value } : g)));
  };

  const updateTool = (groupIndex, toolIndex, field, value) => {
    setGroups((prev) =>
      prev.map((g, i) => {
        if (i !== groupIndex) return g;
        const tools = [...(g.tools || [])];
        tools[toolIndex] = { ...tools[toolIndex], [field]: value };
        return { ...g, tools };
      })
    );
  };

  const toggleToolRole = (groupIndex, toolIndex, role) => {
    setGroups((prev) =>
      prev.map((g, i) => {
        if (i !== groupIndex) return g;
        const tools = [...(g.tools || [])];
        const t = tools[toolIndex];
        const roles = Array.isArray(t.allowedRoles) ? [...t.allowedRoles] : ['user', 'admin', 'developer'];
        const idx = roles.indexOf(role);
        if (idx >= 0) roles.splice(idx, 1);
        else roles.push(role);
        tools[toolIndex] = { ...t, allowedRoles: roles.length > 0 ? roles : ['user'] };
        return { ...g, tools };
      })
    );
  };

  const removeGroup = (groupIndex) => {
    setConfirmRemove({ open: true, type: 'group', groupIndex, toolIndex: null });
  };

  const removeTool = (groupIndex, toolIndex) => {
    setConfirmRemove({ open: true, type: 'tool', groupIndex, toolIndex });
  };

  const confirmRemoveAction = () => {
    if (confirmRemove.type === 'group' && confirmRemove.groupIndex !== null) {
      setGroups((prev) => prev.filter((_, i) => i !== confirmRemove.groupIndex));
    } else if (confirmRemove.type === 'tool' && confirmRemove.groupIndex !== null && confirmRemove.toolIndex !== null) {
      setGroups((prev) =>
        prev.map((g, i) =>
          i === confirmRemove.groupIndex
            ? { ...g, tools: (g.tools || []).filter((_, ti) => ti !== confirmRemove.toolIndex) }
            : g
        )
      );
    }
    setConfirmRemove({ open: false, type: null, groupIndex: null, toolIndex: null });
  };

  const reorderGroups = (newGroups) => setGroups(newGroups);

  const reorderToolsInGroup = (groupIndex, newTools) => {
    setGroups((prev) =>
      prev.map((g, i) => (i === groupIndex ? { ...g, tools: newTools } : g))
    );
  };

  const inputClasses = 'bg-white/5 border-white/20 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200 [data-theme=light]:text-zinc-900';
  const selectClasses = 'px-3 py-2 rounded-md border bg-zinc-100 border-zinc-300 text-zinc-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200';
  const labelClasses = 'text-zinc-300 text-sm [data-theme=light]:text-zinc-600';

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-zinc-900 [data-theme=light]:bg-gradient-to-br [data-theme=light]:from-gray-100 [data-theme=light]:to-gray-200">
        <div className="w-12 h-12 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-4 md:p-8 [data-theme=light]:bg-gradient-to-br [data-theme=light]:from-gray-100 [data-theme=light]:to-gray-200 [data-theme=light]:text-zinc-900">
      <header className="max-w-[1200px] mx-auto mb-8 pb-8 border-b border-white/10 [data-theme=light]:border-zinc-200">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin')}
          className="mb-6 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-0 [data-theme=light]:bg-zinc-200 [data-theme=light]:text-zinc-900 [data-theme=light]:hover:bg-zinc-300"
        >
          <FaArrowLeft size={20} />
          Back to Admin Panel
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl mb-2 flex items-center gap-3 font-semibold">
              <FaCog className="text-blue-500 [data-theme=light]:text-blue-600" />
              Tool Configuration
            </h1>
            <p className="text-zinc-300 [data-theme=light]:text-zinc-600">Configure groups and tools shown on the dashboard</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={addGroup}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 hover:-translate-y-0.5"
            >
              <FaFolder className="mr-2" size={16} />
              Add Group
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 hover:-translate-y-0.5"
            >
              <FaSave className="mr-2" size={16} />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto flex flex-col gap-6">
        {groups.length > 0 ? (
          <Reorder.Group axis="y" values={groups} onReorder={reorderGroups} className="flex flex-col gap-6">
            {groups.map((group, groupIndex) => (
              <Reorder.Item key={group.id} value={group} className="relative">
                <Card className="bg-white/5 border-white/10 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200 hover:border-white/20 transition-colors overflow-visible">
                  <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4 border-b border-white/10 [data-theme=light]:border-zinc-200">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <FaGripVertical className="text-zinc-500 flex-shrink-0 cursor-grab active:cursor-grabbing" size={18} />
                      <FaFolder className="text-indigo-400 flex-shrink-0" size={20} />
                      <Input
                        value={group.label || ''}
                        onChange={(e) => updateGroup(groupIndex, 'label', e.target.value)}
                        placeholder="Group name (e.g. Finance Quest)"
                        className={cn(inputClasses, 'text-lg font-medium max-w-[280px]')}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addToolToGroup(groupIndex)}
                        className="text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
                      >
                        <FaPlus className="mr-1" size={14} />
                        Add Tool
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeGroup(groupIndex)}
                        className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                      >
                        <FaTrash size={14} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {(group.tools || []).length > 0 ? (
                      <Reorder.Group axis="y" values={group.tools} onReorder={(newTools) => reorderToolsInGroup(groupIndex, newTools)} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {(group.tools || []).map((tool, toolIndex) => (
                          <Reorder.Item key={tool.id} value={tool} drag className="cursor-grab active:cursor-grabbing relative">
                            <Card className="bg-black/20 border-white/10 [data-theme=light]:bg-zinc-50 [data-theme=light]:border-zinc-200">
                              <CardHeader className="flex flex-row items-center justify-between pb-2 gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <FaGripVertical className="text-zinc-500 flex-shrink-0" size={16} />
                                  <span className="text-sm font-medium truncate">{tool.label || 'Unnamed'}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeTool(groupIndex, toolIndex)}
                                  className="text-red-400 hover:bg-red-500/20 hover:text-red-300 flex-shrink-0 h-7 w-7 p-0"
                                >
                                  <FaTrash size={12} />
                                </Button>
                              </CardHeader>
                              <CardContent className="grid grid-cols-1 gap-2.5 text-sm">
                                <div className="flex flex-col gap-1">
                                  <Label className={labelClasses}>Type</Label>
                                  <select
                                    value={tool.type || 'internal'}
                                    onChange={(e) => updateTool(groupIndex, toolIndex, 'type', e.target.value)}
                                    className={cn('px-2 py-1.5 rounded border text-sm', selectClasses)}
                                  >
                                    <option value="internal">Internal</option>
                                    <option value="external">External</option>
                                  </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <Label className={labelClasses}>Label</Label>
                                  <Input value={tool.label || ''} onChange={(e) => updateTool(groupIndex, toolIndex, 'label', e.target.value)} placeholder="e.g. Production" className={inputClasses} />
                                </div>
                                {tool.type === 'internal' ? (
                                  <div className="flex flex-col gap-1">
                                    <Label className={labelClasses}>Path</Label>
                                    <select
                                      value={AVAILABLE_PATHS.some((p) => p.path === (tool.path || '')) ? (tool.path || '') : '__custom__'}
                                      onChange={(e) => updateTool(groupIndex, toolIndex, 'path', e.target.value === '__custom__' ? (tool.path || '/') : e.target.value)}
                                      className={cn('px-2 py-1.5 rounded border text-sm', selectClasses)}
                                    >
                                      {AVAILABLE_PATHS.map((p) => (
                                        <option key={p.path} value={p.path}>
                                          {p.label} ({p.path})
                                        </option>
                                      ))}
                                      <option value="__custom__">Custom path...</option>
                                    </select>
                                    {!AVAILABLE_PATHS.some((p) => p.path === (tool.path || '')) && (
                                      <Input
                                        value={tool.path || ''}
                                        onChange={(e) => updateTool(groupIndex, toolIndex, 'path', e.target.value)}
                                        placeholder="/custom-path"
                                        className={cn(inputClasses, 'mt-1')}
                                      />
                                    )}
                                  </div>
                                ) : (
                                  <div className="flex flex-col gap-1">
                                    <Label className={labelClasses}>URL</Label>
                                    <Input value={tool.url || ''} onChange={(e) => updateTool(groupIndex, toolIndex, 'url', e.target.value)} placeholder="https://..." className={inputClasses} />
                                  </div>
                                )}
                                <div className="flex flex-col gap-1">
                                  <Label className={labelClasses}>Icon</Label>
                                  <button
                                    type="button"
                                    onClick={() => setIconPicker({ open: true, groupIndex, toolIndex })}
                                    className={cn('flex items-center gap-2 px-2 py-1.5 rounded border text-left', 'bg-white/5 border-white/20 hover:bg-white/10 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200')}
                                  >
                                    {getIconComponent(tool.icon || 'FaLink', 20, tool.color || '#2196F3')}
                                    <span className="text-xs">{tool.icon || 'FaLink'}</span>
                                  </button>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <Label className={labelClasses}>Color</Label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="color"
                                      value={/^#[0-9A-Fa-f]{6}$/.test(tool.color) ? tool.color : '#2196F3'}
                                      onChange={(e) => updateTool(groupIndex, toolIndex, 'color', e.target.value)}
                                      className="h-8 w-8 min-w-[2rem] cursor-pointer rounded border border-white/20 p-0.5"
                                    />
                                    <Input value={tool.color || '#2196F3'} onChange={(e) => updateTool(groupIndex, toolIndex, 'color', e.target.value)} placeholder="#2196F3" className={cn(inputClasses, 'flex-1 text-sm')} />
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <Label className={labelClasses}>Roles</Label>
                                  <div className="flex flex-wrap gap-1">
                                    {USER_ROLES.map((role) => {
                                      const roles = Array.isArray(tool.allowedRoles) ? tool.allowedRoles : ['user', 'admin', 'developer'];
                                      const isChecked = roles.includes(role);
                                      return (
                                        <button
                                          key={role}
                                          type="button"
                                          onClick={() => toggleToolRole(groupIndex, toolIndex, role)}
                                          className={cn(
                                            'px-2 py-0.5 rounded text-xs capitalize',
                                            isChecked ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50' : 'bg-white/5 text-zinc-500 border border-white/10'
                                          )}
                                        >
                                          {role}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  <button type="button" onClick={() => updateTool(groupIndex, toolIndex, 'enabled', !(tool.enabled !== false))} className={cn('px-2 py-0.5 rounded text-xs', tool.enabled !== false ? 'bg-emerald-500/30 text-emerald-300' : 'bg-white/5 text-zinc-500')}>Enabled</button>
                                  <button type="button" onClick={() => updateTool(groupIndex, toolIndex, 'inDevelopment', !(tool.inDevelopment === true))} className={cn('px-2 py-0.5 rounded text-xs', tool.inDevelopment === true ? 'bg-amber-500/30 text-amber-300' : 'bg-white/5 text-zinc-500')}>Dev</button>
                                  {tool.type === 'external' && (
                                    <button type="button" onClick={() => updateTool(groupIndex, toolIndex, 'openInNewTab', !(tool.openInNewTab !== false))} className={cn('px-2 py-0.5 rounded text-xs', tool.openInNewTab !== false ? 'bg-blue-500/30 text-blue-300' : 'bg-white/5 text-zinc-500')}>New tab</button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                    ) : (
                      <div className="py-6 text-center">
                        <p className="text-zinc-500 text-sm mb-2">No tools in this group</p>
                        <Button variant="ghost" size="sm" onClick={() => addToolToGroup(groupIndex)} className="text-blue-400 hover:bg-blue-500/20">
                          <FaPlus className="mr-1" size={14} />
                          Add first tool
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        ) : (
          <Card className="bg-white/5 border-white/10 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200 p-8 text-center">
            <p className="text-zinc-400 mb-4">No groups configured. Add one to get started.</p>
            <Button onClick={addGroup} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <FaFolder className="mr-2" size={16} />
              Add Group
            </Button>
          </Card>
        )}
      </main>

      <Modal isOpen={modal.open} onClose={() => setModal((p) => ({ ...p, open: false }))} title={modal.title} message={modal.message} type={modal.type} />

      <ConfirmModal
        isOpen={confirmRemove.open}
        onClose={() => setConfirmRemove({ open: false, type: null, groupIndex: null, toolIndex: null })}
        onConfirm={confirmRemoveAction}
        title={confirmRemove.type === 'group' ? 'Remove Group' : 'Remove Tool'}
        message={confirmRemove.type === 'group' ? 'Are you sure? All tools in this group will be removed.' : 'Are you sure you want to remove this tool?'}
        type="danger"
      />

      <IconPickerModal
        isOpen={iconPicker.open}
        onClose={() => setIconPicker({ open: false, groupIndex: null, toolIndex: null })}
        onSelect={(iconName) => {
          if (iconPicker.groupIndex != null && iconPicker.toolIndex != null) {
            updateTool(iconPicker.groupIndex, iconPicker.toolIndex, 'icon', iconName);
          }
          setIconPicker({ open: false, groupIndex: null, toolIndex: null });
        }}
        currentIcon={iconPicker.groupIndex != null && iconPicker.toolIndex != null ? groups[iconPicker.groupIndex]?.tools?.[iconPicker.toolIndex]?.icon : null}
        color={iconPicker.groupIndex != null && iconPicker.toolIndex != null ? groups[iconPicker.groupIndex]?.tools?.[iconPicker.toolIndex]?.color : '#2196F3'}
      />
    </div>
  );
};

export default AdminToolConfig;
