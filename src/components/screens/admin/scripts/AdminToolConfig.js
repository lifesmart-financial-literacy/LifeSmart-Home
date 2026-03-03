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
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DEFAULT_TOOL_CONFIG, getIconComponent } from '@/lib/toolConfig';
import Modal from '../../../widgets/modals/Modal';
import ConfirmModal from '../../../widgets/modals/ConfirmModal';
import IconPickerModal from '../../../widgets/modals/IconPickerModal';

const TOOL_CONFIG_REF = { collection: 'SystemSettings', id: 'toolConfig' };

const AdminToolConfig = () => {
  const navigate = useNavigate();
  const { trackFeatureView, trackAdminAction, trackError } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tools, setTools] = useState([]);
  const [modal, setModal] = useState({ open: false, title: '', message: '', type: 'success' });
  const [confirmRemove, setConfirmRemove] = useState({ open: false, index: null });
  const [iconPicker, setIconPicker] = useState({ open: false, toolIndex: null });

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
      if (snap.exists() && Array.isArray(snap.data().tools) && snap.data().tools.length > 0) {
        setTools([...snap.data().tools].sort((a, b) => (a.order ?? 999) - (b.order ?? 999)));
      } else {
        setTools([...DEFAULT_TOOL_CONFIG]);
      }
    } catch (err) {
      console.error('loadConfig:', err);
      trackError('LOAD_TOOL_CONFIG_ERROR', err.message, 'AdminToolConfig');
      setTools([...DEFAULT_TOOL_CONFIG]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const ref = doc(db, TOOL_CONFIG_REF.collection, TOOL_CONFIG_REF.id);
      const toSave = tools.map((t, i) => ({ ...t, order: i }));
      await setDoc(ref, { tools: toSave, updatedAt: new Date().toISOString() });
      trackAdminAction('save_tool_config', { count: tools.length });
      setModal({ open: true, title: 'Saved', message: 'Tool configuration saved successfully!', type: 'success' });
    } catch (err) {
      console.error('handleSave:', err);
      trackError('SAVE_TOOL_CONFIG_ERROR', err.message, 'AdminToolConfig');
      setModal({ open: true, title: 'Error', message: 'Error saving: ' + err.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const updateTool = (index, field, value) => {
    setTools(prev => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
  };

  const addTool = () => {
    setTools(prev => [...prev, {
      id: `tool-${Date.now()}`,
      type: 'internal',
      path: '/',
      label: 'New Tool',
      icon: 'FaLink',
      color: '#2196F3',
      enabled: true,
      inDevelopment: false,
      order: prev.length,
    }]);
  };

  const removeTool = (index) => {
    setConfirmRemove({ open: true, index });
  };

  const confirmRemoveTool = () => {
    if (confirmRemove.index !== null) {
      setTools(prev => prev.filter((_, i) => i !== confirmRemove.index));
      setConfirmRemove({ open: false, index: null });
    }
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
            <p className="text-zinc-300 [data-theme=light]:text-zinc-600">Configure tools and external links shown on the dashboard</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={addTool}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 hover:-translate-y-0.5"
            >
              <FaPlus className="mr-2" size={16} />
              Add Tool
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

      <main className="max-w-[1400px] mx-auto">
        {tools.length > 0 ? (
          <Reorder.Group axis="y" values={tools} onReorder={setTools} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {tools.map((tool, index) => (
              <Reorder.Item key={tool.id} value={tool} drag className="cursor-grab active:cursor-grabbing relative">
                <Card className="bg-white/5 border-white/10 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200 hover:border-white/20 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <FaGripVertical className="text-zinc-500 flex-shrink-0" size={18} />
                      <span className="text-base font-medium truncate">#{index + 1} {tool.label || 'Unnamed'}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTool(index)}
                      className="text-red-400 hover:bg-red-500/20 hover:text-red-300 flex-shrink-0"
                    >
                      <FaTrash size={14} />
                    </Button>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <Label className={labelClasses}>Type</Label>
                      <select
                        value={tool.type || 'internal'}
                        onChange={(e) => updateTool(index, 'type', e.target.value)}
                        className={cn('px-3 py-2 rounded-md border', selectClasses)}
                      >
                        <option value="internal" className="text-zinc-900 bg-white">Internal (route in app)</option>
                        <option value="external" className="text-zinc-900 bg-white">External (link to other site)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className={labelClasses}>Label</Label>
                      <Input
                        value={tool.label || ''}
                        onChange={(e) => updateTool(index, 'label', e.target.value)}
                        placeholder="e.g. Budget Tool"
                        className={inputClasses}
                      />
                    </div>
                    {tool.type === 'internal' ? (
                      <div className="flex flex-col gap-1.5">
                        <Label className={labelClasses}>Path</Label>
                        <Input
                          value={tool.path || ''}
                          onChange={(e) => updateTool(index, 'path', e.target.value)}
                          placeholder="/budget-tool"
                          className={inputClasses}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        <Label className={labelClasses}>URL</Label>
                        <Input
                          value={tool.url || ''}
                          onChange={(e) => updateTool(index, 'url', e.target.value)}
                          placeholder="https://..."
                          className={inputClasses}
                        />
                      </div>
                    )}
                    <div className="flex flex-col gap-1.5">
                      <Label className={labelClasses}>Icon</Label>
                      <button
                        type="button"
                        onClick={() => setIconPicker({ open: true, toolIndex: index })}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-md border text-left',
                          'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30',
                          'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
                          '[data-theme=light]:bg-white [data-theme=light]:border-zinc-200 [data-theme=light]:text-zinc-900 [data-theme=light]:hover:bg-zinc-50'
                        )}
                      >
                        {getIconComponent(tool.icon || 'FaLink', 24, tool.color || '#2196F3')}
                        <span className="text-sm">{tool.icon || 'FaLink'}</span>
                      </button>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className={labelClasses}>Color (hex)</Label>
                      <Input
                        type="text"
                        value={tool.color || '#2196F3'}
                        onChange={(e) => updateTool(index, 'color', e.target.value)}
                        placeholder="#2196F3"
                        className={inputClasses}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label className={labelClasses}>Options</Label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => updateTool(index, 'enabled', !(tool.enabled !== false))}
                          className={cn(
                            'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                            tool.enabled !== false
                              ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 shadow-sm shadow-emerald-500/20'
                              : 'bg-white/5 text-zinc-500 border border-white/10 hover:bg-white/10 hover:text-zinc-400',
                            '[data-theme=light]:border [data-theme=light]:border-zinc-200',
                            tool.enabled !== false && '[data-theme=light]:bg-emerald-100 [data-theme=light]:text-emerald-700 [data-theme=light]:border-emerald-300'
                          )}
                        >
                          Enabled
                        </button>
                        <button
                          type="button"
                          onClick={() => updateTool(index, 'inDevelopment', !(tool.inDevelopment === true))}
                          className={cn(
                            'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                            tool.inDevelopment === true
                              ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-500/20'
                              : 'bg-white/5 text-zinc-500 border border-white/10 hover:bg-white/10 hover:text-zinc-400',
                            '[data-theme=light]:border [data-theme=light]:border-zinc-200',
                            tool.inDevelopment === true && '[data-theme=light]:bg-amber-100 [data-theme=light]:text-amber-700 [data-theme=light]:border-amber-300'
                          )}
                        >
                          In Development
                        </button>
                        {tool.type === 'external' && (
                          <button
                            type="button"
                            onClick={() => updateTool(index, 'openInNewTab', !(tool.openInNewTab !== false))}
                            className={cn(
                              'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                              tool.openInNewTab !== false
                                ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50 shadow-sm shadow-blue-500/20'
                                : 'bg-white/5 text-zinc-500 border border-white/10 hover:bg-white/10 hover:text-zinc-400',
                              '[data-theme=light]:border [data-theme=light]:border-zinc-200',
                              tool.openInNewTab !== false && '[data-theme=light]:bg-blue-100 [data-theme=light]:text-blue-700 [data-theme=light]:border-blue-300'
                            )}
                          >
                            Open in new tab
                          </button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        ) : (
          <Card className="bg-white/5 border-white/10 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200 p-8 text-center">
            <p className="text-zinc-400 mb-4">No tools configured. Add one to get started.</p>
            <Button
              onClick={addTool}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 hover:-translate-y-0.5"
            >
              <FaPlus className="mr-2" size={16} />
              Add Tool
            </Button>
          </Card>
        )}
      </main>

      <Modal
        isOpen={modal.open}
        onClose={() => setModal(prev => ({ ...prev, open: false }))}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />

      <ConfirmModal
        isOpen={confirmRemove.open}
        onClose={() => setConfirmRemove({ open: false, index: null })}
        onConfirm={confirmRemoveTool}
        title="Remove Tool"
        message="Are you sure you want to remove this tool?"
        type="danger"
      />

      <IconPickerModal
        isOpen={iconPicker.open}
        onClose={() => setIconPicker({ open: false, toolIndex: null })}
        onSelect={(iconName) => {
          if (iconPicker.toolIndex != null) {
            updateTool(iconPicker.toolIndex, 'icon', iconName);
          }
          setIconPicker({ open: false, toolIndex: null });
        }}
        currentIcon={iconPicker.toolIndex != null ? tools[iconPicker.toolIndex]?.icon : null}
        color={iconPicker.toolIndex != null ? tools[iconPicker.toolIndex]?.color : '#2196F3'}
      />
    </div>
  );
};

export default AdminToolConfig;
