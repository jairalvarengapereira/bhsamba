'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface Member {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  bioHistory: string | null;
  imageUrl: string | null;
  order: number;
  isActive: boolean;
}

interface Show {
  id: string;
  title: string;
  description: string | null;
  venue: string;
  address: string | null;
  date: Date;
  time: string | null;
  ticketUrl: string | null;
  imageUrl: string | null;
  isPublished: boolean;
}

interface Media {
  id: string;
  type: string;
  url: string;
  caption: string | null;
}

interface Settings {
  hero_subtitle?: string;
  history_title?: string;
  history_content?: string;
  whatsapp_number?: string;
  instagram?: string;
  youtube?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'settings' | 'members' | 'shows' | 'media'>('settings');
  const [members, setMembers] = useState<Member[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const res = await fetch('/api/admin/auth', { method: 'GET' });
    if (res.status === 401) {
      router.push('/admin/login');
    } else {
      loadData();
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [settingsRes, membersRes, showsRes, mediaRes] = await Promise.all([
        fetch('/api/admin/settings'),
        fetch('/api/admin/members'),
        fetch('/api/admin/shows'),
        fetch('/api/admin/media'),
      ]);
      setSettings(await settingsRes.json());
      setMembers(await membersRes.json());
      setShows(await showsRes.json());
      setMedia(await mediaRes.json());
    } catch (error) {
      console.error('Failed to load data:', error);
    }
    setLoading(false);
  };

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const entries = Object.entries(settings);
      for (let i = 0; i < entries.length; i++) {
        const [key, value] = entries[i];
        await fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value }),
        });
      }
      alert('Configurações salvas!');
    } catch (error) {
      alert('Erro ao salvar');
    }
    setSaving(false);
  };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm('Confirmar exclusão?')) return;
    await fetch(`/api/admin/${type}?id=${id}`, { method: 'DELETE' });
    loadData();
  };

  const handleSave = async (type: string, data: any) => {
    const method = data.id ? 'PUT' : 'POST';
    const res = await fetch(`/api/admin/${type}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      alert('Erro: ' + (err.error || ' desconhecido'));
      return;
    }
    setShowModal(false);
    setEditingItem(null);
    loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <p className="text-white">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="bg-zinc-900 border-b border-zinc-800 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-[#C5A059]">Painel Admin - BHSamba</h1>
          <div className="flex gap-4">
            <a href="/" className="text-amber-400 hover:text-amber-300">Ver Site</a>
            <button onClick={() => { document.cookie = 'admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'; router.push('/admin/login'); }} className="text-gray-400 hover:text-white">Sair</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['settings', 'members', 'shows', 'media'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded ${
                activeTab === tab
                  ? 'bg-[#C5A059] text-black'
                  : 'bg-zinc-800 text-white hover:bg-zinc-700'
              }`}
            >
              {tab === 'settings' ? 'Configurações' : tab === 'members' ? 'Músicos' : tab === 'shows' ? 'Shows' : 'Galeria'}
            </button>
          ))}
        </div>

        {activeTab === 'settings' && (
          <SettingsTab settings={settings} setSettings={setSettings} onSave={handleSaveSettings} saving={saving} />
        )}

        {activeTab === 'members' && (
          <CrudTab
            title="Músico"
            items={members}
            onEdit={(item) => { setEditingItem(item); setShowModal(true); }}
            onDelete={(id) => handleDelete('members', id)}
            onAdd={() => { setEditingItem(null); setShowModal(true); }}
            fields={[
              { name: 'name', label: 'Nome', type: 'text' },
              { name: 'role', label: 'Função', type: 'text' },
              { name: 'imageUrl', label: 'Foto', type: 'image' },
              { name: 'bio', label: 'Biografia Curta', type: 'textarea' },
              { name: 'order', label: 'Ordem', type: 'number' },
              { name: 'isActive', label: 'Ativo', type: 'checkbox' },
            ]}
          />
        )}

        {activeTab === 'shows' && (
          <CrudTab
            title="Show"
            items={shows}
            onEdit={(item) => { setEditingItem(item); setShowModal(true); }}
            onDelete={(id) => handleDelete('shows', id)}
            onAdd={() => { setEditingItem(null); setShowModal(true); }}
            fields={[
              { name: 'title', label: 'Título', type: 'text' },
              { name: 'venue', label: 'Local', type: 'text' },
              { name: 'date', label: 'Data', type: 'date' },
              { name: 'time', label: 'Horário', type: 'text' },
              { name: 'imageUrl', label: 'Imagem', type: 'image' },
              { name: 'ticketUrl', label: 'URL Ingresso', type: 'text' },
              { name: 'description', label: 'Descrição', type: 'textarea' },
              { name: 'isPublished', label: 'Publicar', type: 'checkbox' },
            ]}
          />
        )}

        {activeTab === 'media' && (
          <CrudTab
            title="Imagem"
            items={media}
            onEdit={(item) => { setEditingItem(item); setShowModal(true); }}
            onDelete={(id) => handleDelete('media', id)}
            onAdd={() => { setEditingItem(null); setShowModal(true); }}
            fields={[
              { name: 'url', label: 'Imagem', type: 'image' },
              { name: 'caption', label: 'Legenda', type: 'text' },
            ]}
          />
        )}
      </div>

      {showModal && (
        <ModalForm
          type={activeTab}
          item={editingItem}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingItem(null); }}
        />
      )}
    </div>
  );
}

function SettingsTab({ settings, setSettings, onSave, saving }: {
  settings: Settings;
  setSettings: (s: Settings) => void;
  onSave: (e: FormEvent) => void;
  saving: boolean;
}) {
  return (
    <form onSubmit={onSave} className="bg-zinc-900 rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-bold text-[#C5A059] mb-4">Configurações do Site</h2>
      
      <div>
        <label className="block text-gray-400 text-sm mb-1">Subtítulo do Hero</label>
        <input
          type="text"
          value={settings.hero_subtitle || ''}
          onChange={e => setSettings({ ...settings, hero_subtitle: e.target.value })}
          className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-white"
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 text-sm mb-1">WhatsApp</label>
          <input
            type="text"
            value={settings.whatsapp_number || ''}
            onChange={e => setSettings({ ...settings, whatsapp_number: e.target.value })}
            className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-white"
          />
        </div>
        
        <div>
          <label className="block text-gray-400 text-sm mb-1">Instagram</label>
          <input
            type="text"
            value={settings.instagram || ''}
            onChange={e => setSettings({ ...settings, instagram: e.target.value })}
            className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-white"
          />
        </div>
        
        <div>
          <label className="block text-gray-400 text-sm mb-1">YouTube</label>
          <input
            type="text"
            value={settings.youtube || ''}
            onChange={e => setSettings({ ...settings, youtube: e.target.value })}
            className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-white"
          />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={saving}
        className="px-6 py-2 bg-[#009B3A] hover:bg-[#4CAF50] text-white font-bold rounded disabled:opacity-50"
      >
        {saving ? 'Salvando...' : 'Salvar Configurações'}
      </button>
    </form>
  );
}

function CrudTab({ title, items, onEdit, onDelete, onAdd, fields }: {
  title: string;
  items: any[];
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  fields: any[];
}) {
  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
        <h3 className="font-bold text-[#C5A059]">Gerenciar {title}s</h3>
        <button onClick={onAdd} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded">
          + Adicionar
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              {fields.map(f => (
                <th key={f.name} className="text-left p-3">{f.label}</th>
              ))}
              <th className="text-left p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: any) => (
              <tr key={item.id} className="border-b border-zinc-800">
                {fields.map(f => (
                  <td key={f.name} className="p-3">
                    {f.type === 'checkbox' ? (item[f.name] ? 'Sim' : 'Não') : 
                     f.name === 'date' ? new Date(item[f.name]).toLocaleDateString('pt-BR') :
                     f.name.includes('Url') || f.type === 'image' ? (
                       item[f.name] ? <img src={item[f.name]} alt="" className="w-12 h-12 object-cover rounded" /> : '-'
                     ) :
                     item[f.name] || '-'}
                  </td>
                ))}
                <td className="p-3">
                  <button onClick={() => onEdit(item)} className="text-blue-400 hover:text-blue-300 mr-3">Editar</button>
                  <button onClick={() => onDelete(item.id)} className="text-red-400 hover:text-red-300">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {items.length === 0 && (
        <p className="p-4 text-gray-400 text-center">Nenhum registro</p>
      )}
    </div>
  );
}

function ModalForm({ type, item, onSave, onClose }: {
  type: string;
  item: any;
  onSave: (type: string, data: any) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<any>(item || {});
  const [uploading, setUploading] = useState(false);

const fields = type === 'members' ? [
    { name: 'name', label: 'Nome *', type: 'text', placeholder: 'Ex: João Silva', required: true },
    { name: 'role', label: 'Função *', type: 'text', placeholder: 'Ex: Percussão', required: true },
    { name: 'imageUrl', label: 'URL da Foto', type: 'text', placeholder: 'Cole a URL da imagem', isImage: true },
    { name: 'bio', label: 'Biografia Curta', type: 'textarea', placeholder: 'Breve descrição do músico (1-2 frases)' },
    { name: 'order', label: 'Ordem', type: 'number', placeholder: '1' },
  ] : type === 'shows' ? [
    { name: 'title', label: 'Título *', type: 'text', placeholder: 'Ex: Samba no Parque', required: true },
    { name: 'venue', label: 'Local *', type: 'text', placeholder: 'Ex: Centro Cultural', required: true },
    { name: 'address', label: 'Endereço', type: 'text', placeholder: 'Ex: Rua das Flores, 123' },
    { name: 'date', label: 'Data *', type: 'date', required: true },
    { name: 'time', label: 'Horário', type: 'text', placeholder: 'Ex: 21:00' },
    { name: 'imageUrl', label: 'URL da Imagem', type: 'text', placeholder: 'Cole a URL da imagem', isImage: true },
    { name: 'ticketUrl', label: 'URL Ingresso', type: 'text', placeholder: 'Ex: https://ingressos.com/show123' },
    { name: 'description', label: 'Descrição', type: 'textarea', placeholder: 'Descrição do evento' },
  ] : [
    { name: 'url', label: 'URL da Imagem *', type: 'text', placeholder: 'Cole a URL da imagem', isImage: true },
    { name: 'caption', label: 'Legenda', type: 'text', placeholder: 'Legenda para a imagem' },
  ];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      
      if (res.ok) {
        const data = await res.json();
        setFormData((prev: Record<string, any>) => ({ ...prev, [fieldName]: data.url }));
      } else {
        const errorData = await res.json();
        alert('Erro ao fazer upload: ' + errorData.error);
      }
    } catch (error) {
      alert('Erro ao fazer upload');
    }
    setUploading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing = fields.filter(f => f.required && !formData[f.name]);
    if (missing.length) {
      alert('Preencha os campos obrigatórios: ' + missing.map(f => f.label).join(', '));
      return;
    }
    const data = { ...formData, id: item?.id };
    if (data.date) data.date = new Date(data.date).toISOString();
    if (data.order) data.order = parseInt(data.order);
    onSave(type, data);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-6 rounded-lg w-full max-w-lg my-8">
        <h2 className="text-xl font-bold text-[#C5A059] mb-4">
          {item ? 'Editar' : 'Adicionar'} {type === 'members' ? 'Músico' : type === 'shows' ? 'Show' : 'Mídia'}
        </h2>

        {fields.map((field, index) => {
            const nextField = fields[index + 1];
            const isDateAndTime = field.name === 'date' && nextField?.name === 'time';
            
            if (isDateAndTime) {
              return (
                <div key={field.name} className="flex gap-3 mb-3">
                  <div className="flex-1">
                    <label className="block text-gray-400 text-sm mb-1">{field.label}</label>
                    <input
                      type="date"
                      value={formData[field.name] ? new Date(formData[field.name]).toISOString().slice(0, 10) : ''}
                      onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
                      className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-white"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-400 text-sm mb-1">{nextField.label}</label>
                    <input
                      type="text"
                      value={formData['time'] || ''}
                      onChange={e => setFormData({ ...formData, ['time']: e.target.value })}
                      placeholder="Ex: 21:00"
                      className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-white"
                    />
                  </div>
                </div>
              );
            }
            
            if (field.name === 'time' && index > 0 && fields[index - 1].name === 'date') {
              return null;
            }
            
            return (
              <div key={field.name} className="mb-3">
                {field.type === 'checkbox' ? (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData[field.name] || false}
                  onChange={e => setFormData({ ...formData, [field.name]: e.target.checked })}
                />
                {field.label}
              </label>
            ) : field.isImage ? (
              <div>
                <label className="block text-gray-400 text-sm mb-1">{field.label}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUpload(e, field.name)}
                  className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-white mb-2"
                />
                {uploading && <p className="text-amber-400 text-sm">Enviando...</p>}
                {formData[field.name] && (
                  <div className="relative w-full mt-2">
                    <img src={formData[field.name]} alt="Preview" className="w-full h-40 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, [field.name]: '' })}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            ) : field.type === 'textarea' ? (
              <textarea
                value={formData[field.name] || ''}
                onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
                placeholder={field.placeholder}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-white h-24"
              />
            ) : field.type === 'datetime-local' ? (
              <input
                type="datetime-local"
                value={formData[field.name] ? new Date(formData[field.name]).toISOString().slice(0, 16) : ''}
                onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-white"
              />
            ) : field.type === 'date' ? (
              <input
                type="date"
                value={formData[field.name] ? new Date(formData[field.name]).toISOString().slice(0, 10) : ''}
                onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-white"
              />
            ) : field.name === 'date' && fields[index + 1]?.name === 'time' ? null : (
              <input
                type={field.type}
                value={formData[field.name] || ''}
                onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
                placeholder={field.placeholder}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-white"
              />
            )}
          </div>
            );
          })}

        <div className="flex gap-2 mt-4">
          <button type="submit" className="flex-1 py-2 bg-[#C5A059] hover:bg-[#F9C412] text-black font-medium rounded">
            Salvar
          </button>
          <button type="button" onClick={onClose} className="flex-1 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}