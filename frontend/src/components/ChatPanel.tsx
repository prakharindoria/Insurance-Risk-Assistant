import { useState } from 'react';
import { Send, Sparkles, User, Shield, Edit2, Save } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import api from '../api/api';

const ChatPanel = () => {
  const [context, setContext] = useState('');
  const [clientName, setClientName] = useState('');
  const [insuranceType, setInsuranceType] = useState('Property Insurance');
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setReport(null);
    setIsEditing(false);
    try {
      const url = `/reports/generate?context=${encodeURIComponent(context)}&client_name=${encodeURIComponent(clientName)}&insurance_type=${encodeURIComponent(insuranceType)}`;
      const res = await api.post(url);
      setReport(res.data);
      setEditContent(res.data.content);
      setEditTitle(res.data.title);
      setContext('');
    } catch (error: any) {
      setReport({ content: `**Error generating report:**\n${error.response?.data?.detail || error.message}`, title: "Error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!report?.id) return;
    try {
      setLoading(true);
      const res = await api.put(`/reports/${report.id}`, {
        title: editTitle,
        content: editContent
      });
      setReport(res.data);
      setIsEditing(false);
    } catch (error) {
      alert("Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pb-48">
        {!report && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
            <Sparkles size={48} className="text-yellow-500 opacity-50" />
            <div>
              <h2 className="text-xl font-bold text-gray-700">Let's analyze the risk.</h2>
              <p className="text-sm mt-2 max-w-md">Add your data sources on the left, fill out the client details below, and generate a comprehensive risk assessment report.</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse flex flex-col items-center">
              <Sparkles size={32} className="text-blue-500 mb-4 animate-bounce" />
              <span className="text-sm text-gray-600 font-medium">Synthesizing data & processing...</span>
            </div>
          </div>
        )}

        {report && !loading && (
          <div className="bg-white/60 p-6 rounded-xl shadow-sm max-w-none">
            <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
              <h3 className="text-blue-800 font-semibold">{isEditing ? "Editing Report" : report.title}</h3>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
                  <Edit2 size={14} /> Edit
                </button>
              ) : (
                <button onClick={handleSaveEdit} className="flex items-center gap-1 text-sm text-white bg-blue-600 px-3 py-1 rounded-md hover:bg-blue-700">
                  <Save size={14} /> Save
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Report Title"
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border rounded-md min-h-[300px] font-mono text-sm"
                />
              </div>
            ) : (
              <div className="prose prose-sm">
                <ReactMarkdown>{report.content}</ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-4 space-y-3">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <User size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Client Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full bg-white/50 pl-10 pr-4 py-2 rounded-xl text-sm outline-none border focus:border-blue-400"
            />
          </div>
          <div className="flex-1 relative">
            <Shield size={16} className="absolute left-3 top-3 text-gray-400" />
            <select
              value={insuranceType}
              onChange={(e) => setInsuranceType(e.target.value)}
              className="w-full bg-white/50 pl-10 pr-4 py-2 rounded-xl text-sm outline-none border focus:border-blue-400 appearance-none"
            >
              <option>Property Insurance</option>
              <option>Liability Insurance</option>
              <option>Cyber Insurance</option>
              <option>Health/Life Insurance</option>
            </select>
          </div>
        </div>
        <div className="relative">
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Add context for generation (e.g. 'Focus on environmental risks for coastal property')"
            className="w-full bg-white/50 p-3 pr-12 rounded-xl resize-none outline-none border focus:border-blue-400 text-sm text-gray-800"
            rows={2}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !clientName}
            className="absolute right-3 bottom-3 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            title={!clientName ? "Please enter a client name" : "Generate Report"}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
