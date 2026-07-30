import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import api from '../api/api';

const ChatPanel = () => {
  const [context, setContext] = useState('');
  const [reportPreview, setReportPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setReportPreview(null);
    try {
      // For MVP, we are calling the report generate endpoint and showing the content in chat as a preview
      const res = await api.post(`/reports/generate?context=${encodeURIComponent(context)}`);
      setReportPreview(res.data.content);
      setContext('');
    } catch (error: any) {
      setReportPreview(`**Error generating report:**\n${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pb-20">
        {!reportPreview && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
            <Sparkles size={48} className="text-yellow-500 opacity-50" />
            <div>
              <h2 className="text-xl font-bold text-gray-700">Let's analyze the risk.</h2>
              <p className="text-sm mt-2 max-w-md">Add your data sources on the left, provide any specific context below, and generate a comprehensive risk assessment report.</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse flex flex-col items-center">
              <Sparkles size={32} className="text-blue-500 mb-4 animate-bounce" />
              <span className="text-sm text-gray-600 font-medium">Synthesizing data & generating report...</span>
            </div>
          </div>
        )}

        {reportPreview && (
          <div className="bg-white/60 p-6 rounded-xl shadow-sm prose prose-sm max-w-none">
            <h3 className="text-blue-800 border-b pb-2">Latest Generated Report Preview</h3>
            <ReactMarkdown>{reportPreview}</ReactMarkdown>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Add context for generation (e.g. 'Focus on environmental risks for coastal property')"
            className="w-full bg-transparent p-4 pr-12 rounded-2xl resize-none outline-none text-sm text-gray-800"
            rows={2}
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="absolute right-3 bottom-3 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
