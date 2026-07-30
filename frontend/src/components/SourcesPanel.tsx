import { useState, useEffect } from 'react';
import api from '../api/api';
import { FilePlus, FileText, Trash2, FileSpreadsheet, FileJson } from 'lucide-react';

interface Source {
  id: number;
  filename: string;
  content_type: string;
  created_at: string;
}

const SourcesPanel = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSources = async () => {
    try {
      const res = await api.get('/sources/');
      setSources(res.data);
    } catch (error) {
      console.error("Failed to fetch sources", error);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setLoading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      await api.post('/sources/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchSources();
    } catch (error) {
      alert("Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/sources/${id}`);
      fetchSources();
    } catch (error) {
      alert("Failed to delete source");
    }
  };

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.csv')) return <FileSpreadsheet size={16} className="text-green-600" />;
    if (filename.endsWith('.json')) return <FileJson size={16} className="text-yellow-600" />;
    return <FileText size={16} className="text-blue-600" />;
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/40 border border-white/50 rounded-xl p-4 flex flex-col items-center justify-center border-dashed cursor-pointer hover:bg-white/60 transition relative">
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          onChange={handleFileUpload} 
          disabled={loading}
        />
        <FilePlus size={24} className="text-blue-600 mb-2" />
        <span className="text-sm font-medium">{loading ? 'Uploading...' : 'Add Source'}</span>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Saved Sources</h3>
        {sources.map(source => (
          <div key={source.id} className="flex items-center justify-between p-2 rounded-lg bg-white/30 hover:bg-white/50 transition group">
            <div className="flex items-center gap-2 truncate">
              {getFileIcon(source.filename)}
              <span className="text-sm text-gray-700 truncate max-w-[150px]" title={source.filename}>{source.filename}</span>
            </div>
            <button onClick={() => handleDelete(source.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {sources.length === 0 && (
          <div className="text-xs text-gray-400 text-center py-4">No sources added yet.</div>
        )}
      </div>
    </div>
  );
};

export default SourcesPanel;
