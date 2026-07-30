import { useState } from 'react';
import { Send, Sparkles, User, Shield } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import api from '../api/api';
import { parseListItems, parseRiskScore, parseSection } from '../utils/reportContent';

const ChatPanel = () => {
  const [context, setContext] = useState('');
  const [clientName, setClientName] = useState('');
  const [insuranceType, setInsuranceType] = useState('Property Insurance');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [report, setReport] = useState<any>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setMessage('');
    setReport(null);
    try {
      const url = `/reports/generate?context=${encodeURIComponent(context)}&client_name=${encodeURIComponent(clientName)}&insurance_type=${encodeURIComponent(insuranceType)}`;
      const res = await api.post(url);
      setReport(res.data);
      setMessage('Report generated successfully.');
      setContext('');
    } catch (error: any) {
      setReport(null);
      setMessage(`Error generating report: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const highlights = parseListItems(parseSection(report?.content || '', 'Highlights'));
  const lowlights = parseListItems(parseSection(report?.content || '', 'Lowlights'));
  const riskScore = parseRiskScore(report?.content || '');

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pb-48">
        {!loading && !message && !report && (
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

        {!loading && report && (
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Generated report</div>
                  <h3 className="text-lg font-semibold text-slate-800">{report.title}</h3>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">Live preview</span>
              </div>
              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <div className="text-sm font-semibold text-blue-800 mb-2">Risk Score</div>
                  <div className="text-3xl font-bold text-slate-900">{riskScore ?? '—'}</div>
                  <div className="text-sm text-blue-700 mt-1">
                    {riskScore !== null ? `AI-assessed score from the model response` : 'Scored from AI assessment'}
                  </div>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="text-sm font-semibold text-emerald-800 mb-2">Highlights</div>
                  {highlights.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1 text-sm text-emerald-900">
                      {highlights.map((item, index) => <li key={`highlight-${index}`}>{item}</li>)}
                    </ul>
                  ) : (
                    <p className="text-sm text-emerald-700">No highlights were generated yet.</p>
                  )}
                </div>
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
                  <div className="text-sm font-semibold text-rose-800 mb-2">Lowlights</div>
                  {lowlights.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1 text-sm text-rose-900">
                      {lowlights.map((item, index) => <li key={`lowlight-${index}`}>{item}</li>)}
                    </ul>
                  ) : (
                    <p className="text-sm text-rose-700">No lowlights were generated yet.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
              <div className="prose prose-sm max-w-none w-full overflow-hidden">
                <div style={{ overflowWrap: 'anywhere', wordBreak: 'break-word', whiteSpace: 'normal' }}>
                  <ReactMarkdown>{report.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && message && !report && (
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-6 text-sm text-blue-800 shadow-sm">
            {message}
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
            placeholder="Add the focus or instructions for the report (e.g. 'Prioritize cyber and operational risks for this client')"
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
