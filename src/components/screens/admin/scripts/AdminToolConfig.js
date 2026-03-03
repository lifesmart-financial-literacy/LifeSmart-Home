import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '../../../../hooks/useAnalytics';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/initFirebase';
import {
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaSave,
  FaLink,
  FaCog,
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ICON_MAP, DEFAULT_TOOL_CONFIG } from '@/lib/toolConfig';

const TOOL_CONFIG_REF = { collection: 'SystemSettings', id: 'toolConfig' };

const ICON_OPTIONS = Object.keys(ICON_MAP);

const AdminToolConfig = () => {
  const navigate = useNavigate();
  const { trackFeatureView, trackAdminAction, trackError } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tools, setTools] = useState([]);

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
      alert('Tool configuration saved successfully!');
    } catch (err) {
      console.error('handleSave:', err);
      trackError('SAVE_TOOL_CONFIG_ERROR', err.message, 'AdminToolConfig');
      alert('Error saving: ' + err.message);
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
    if (window.confirm('Remove this tool?')) {
      setTools(prev => prev.filter((_, i) => i !== index));
    }
  };

  const moveTool = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= tools.length) return;
    setTools(prev => {
      const arr = [...prev];
      [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
      return arr;
    });
  };

  const inputClasses = 'bg-white/5 border-white/20 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200 [data-theme=light]:text-zinc-900';
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
          <div className="flex gap-2">
            <Button onClick={addTool} className="bg-blue-600 hover:bg-blue-700 text-white">
              <FaPlus className="mr-2" size={16} />
              Add Tool
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white">
              <FaSave className="mr-2" size={16} />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto space-y-6">
        {tools.map((tool, index) => (
          <Card key={tool.id} className="bg-white/5 border-white/10 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-lg font-medium">#{index + 1} {tool.label || 'Unnamed'}</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => moveTool(index, -1)} disabled={index === 0} className="text-white hover:bg-white/10">
                  <FaArrowUp size={16} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => moveTool(index, 1)} disabled={index === tools.length - 1} className="text-white hover:bg-white/10">
                  <FaArrowDown size={16} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => removeTool(index)} className="text-red-400 hover:bg-red-500/20">
                  <FaTrash size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label className={labelClasses}>Type</Label>
                <select
                  value={tool.type || 'internal'}
                  onChange={(e) => updateTool(index, 'type', e.target.value)}
                  className={cn('px-3 py-2 rounded-md border', inputClasses)}
                >
                  <option value="internal">Internal (route in app)</option>
                  <option value="external">External (link to other site)</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label className={labelClasses}>Label</Label>
                <Input
                  value={tool.label || ''}
                  onChange={(e) => updateTool(index, 'label', e.target.value)}
                  placeholder="e.g. Budget Tool"
                  className={inputClasses}
                />
              </div>
              {tool.type === 'internal' ? (
                <div className="flex flex-col gap-2">
                  <Label className={labelClasses}>Path</Label>
                  <Input
                    value={tool.path || ''}
                    onChange={(e) => updateTool(index, 'path', e.target.value)}
                    placeholder="/budget-tool"
                    className={inputClasses}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Label className={labelClasses}>URL</Label>
                  <Input
                    value={tool.url || ''}
                    onChange={(e) => updateTool(index, 'url', e.target.value)}
                    placeholder="https://..."
                    className={inputClasses}
                  />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Label className={labelClasses}>Icon</Label>
                <select
                  value={tool.icon || 'FaLink'}
                  onChange={(e) => updateTool(index, 'icon', e.target.value)}
                  className={cn('px-3 py-2 rounded-md border', inputClasses)}
                >
                  {ICON_OPTIONS.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label className={labelClasses}>Color (hex)</Label>
                <Input
                  type="text"
                  value={tool.color || '#2196F3'}
                  onChange={(e) => updateTool(index, 'color', e.target.value)}
                  placeholder="#2196F3"
                  className={inputClasses}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className={labelClasses}>Options</Label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tool.enabled !== false}
                      onChange={(e) => updateTool(index, 'enabled', e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className={labelClasses}>Enabled</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tool.inDevelopment === true}
                      onChange={(e) => updateTool(index, 'inDevelopment', e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className={labelClasses}>In Development</span>
                  </label>
                  {tool.type === 'external' && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tool.openInNewTab !== false}
                        onChange={(e) => updateTool(index, 'openInNewTab', e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <span className={labelClasses}>Open in new tab</span>
                    </label>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {tools.length === 0 && (
          <Card className="bg-white/5 border-white/10 [data-theme=light]:bg-white [data-theme=light]:border-zinc-200 p-8 text-center">
            <p className="text-zinc-400 mb-4">No tools configured. Add one to get started.</p>
            <Button onClick={addTool} className="bg-blue-600 hover:bg-blue-700 text-white">
              <FaPlus className="mr-2" size={16} />
              Add Tool
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminToolConfig;
