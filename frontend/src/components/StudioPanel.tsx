import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../api/api';
import { FileDown, Clock, FileText } from 'lucide-react';
import { parseRiskScore, parseSection, parseListItems } from '../utils/reportContent';

interface Report {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

const getRiskLevel = (score: number | null) => {
  if (score === null) return 'Unknown';
  if (score <= 35) return 'Low';
  if (score <= 65) return 'Moderate';
  if (score <= 85) return 'High';
  return 'Critical';
};

const getRiskColor = (score: number | null) => {
  if (score === null) return 'text-slate-600 bg-slate-100';
  if (score <= 35) return 'text-emerald-700 bg-emerald-100';
  if (score <= 65) return 'text-amber-800 bg-amber-100';
  if (score <= 85) return 'text-orange-800 bg-orange-100';
  return 'text-red-800 bg-red-100';
};

const getRiskBarColor = (score: number | null) => {
  if (score === null) return 'bg-slate-400';
  if (score <= 35) return 'bg-emerald-500';
  if (score <= 65) return 'bg-amber-500';
  if (score <= 85) return 'bg-orange-500';
  return 'bg-red-500';
};

const formatSectionList = (section: string | null) => parseListItems(section);

const StudioPanel = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports/');
      setReports(res.data);
      if (res.data.length > 0 && selectedReportId === null) {
        setSelectedReportId(res.data[0].id);
      }
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch reports', err);
      setError('Unable to load reports.');
    }
  };

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 5000);
    return () => clearInterval(interval);
  }, []);

  const selectedReport = reports.find((report) => report.id === selectedReportId) || null;
  const reportHighlights = selectedReport ? parseSection(selectedReport.content, 'Highlights') : null;
  const reportLowlights = selectedReport ? parseSection(selectedReport.content, 'Lowlights') : null;
  const reportRiskScore = selectedReport ? parseRiskScore(selectedReport.content) : null;
  const reportRiskLevel = getRiskLevel(reportRiskScore);
  const reportRiskBadgeColor = getRiskColor(reportRiskScore);
  const reportRiskPercent = reportRiskScore !== null ? `${reportRiskScore}%` : '0%';

  const handleExport = async (id: number, format: string) => {
    try {
      const res = await api.get(`/reports/${id}/export/${format}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `risk_report_${id}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert(`Failed to export report as ${format.toUpperCase()}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-100/50 to-purple-100/50 p-4 rounded-xl border border-white/40 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-3">
          <FileText size={16} /> Generated Reports
        </h3>
        <p className="text-xs text-gray-600 mb-4">View report details, download exports, and inspect risk visuals here.</p>

        {error && <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-xs text-red-700">{error}</div>}

        <div className="space-y-3">
          {reports.map((report) => (
            <button
              key={report.id}
              type="button"
              onClick={() => setSelectedReportId(report.id)}
              className={`w-full text-left bg-white/70 p-3 rounded-lg shadow-sm border transition ${selectedReportId === report.id ? 'border-blue-300 bg-blue-50' : 'border-white/50 hover:bg-white/90'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-gray-800">{report.title} #{report.id}</span>
                <span className="text-[10px] text-gray-500 flex items-center gap-1">
                  <Clock size={10} /> {new Date(report.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={(event) => { event.stopPropagation(); handleExport(report.id, 'html'); }} className="text-[10px] px-2 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center gap-1">
                  <FileDown size={10} /> HTML
                </button>
                <button onClick={(event) => { event.stopPropagation(); handleExport(report.id, 'pdf'); }} className="text-[10px] px-2 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center gap-1">
                  <FileDown size={10} /> PDF
                </button>
                <button onClick={(event) => { event.stopPropagation(); handleExport(report.id, 'docx'); }} className="text-[10px] px-2 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center gap-1">
                  <FileDown size={10} /> DOCX
                </button>
              </div>
            </button>
          ))}
          {reports.length === 0 && (
            <div className="text-xs text-center text-gray-400 py-4">No reports generated yet.</div>
          )}
        </div>
      </div>

      {selectedReport && (
        <div className="bg-white/70 p-4 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{selectedReport.title}</h3>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Report preview</p>
            </div>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${reportRiskBadgeColor}`}>
              {reportRiskLevel}
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Risk Score</div>
                  <div className="text-sm font-semibold text-slate-700">
                    {reportRiskScore !== null ? `AI-assessed score for ${selectedReport.title}: ${reportRiskScore}/100` : 'Scored from AI assessment'}
                  </div>
                </div>
              </div>
              <div className="text-5xl font-bold text-slate-900">{reportRiskScore !== null ? reportRiskScore : '—'}</div>
              <div className="text-sm text-slate-500">Quantitative risk score (0-100).</div>
              <div className="mt-4">
                <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div className={`${getRiskBarColor(reportRiskScore)} h-full rounded-full`} style={{ width: reportRiskPercent }} />
                </div>
                <div className="mt-2 text-xs text-slate-500">Risk gauge</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500 mb-3">Highlights</div>
                {formatSectionList(reportHighlights).length > 0 ? (
                  <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
                    {formatSectionList(reportHighlights).map((item, index) => (
                      <li key={`highlight-${index}`}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">Highlights will appear here if available.</p>
                )}
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500 mb-3">Lowlights</div>
                {formatSectionList(reportLowlights).length > 0 ? (
                  <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
                    {formatSectionList(reportLowlights).map((item, index) => (
                      <li key={`lowlight-${index}`}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">Lowlights will appear here if available.</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 prose prose-sm max-w-none w-full overflow-hidden">
            <div style={{ overflowWrap: 'anywhere', wordBreak: 'break-word', whiteSpace: 'normal' }}>
              <ReactMarkdown>{selectedReport.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudioPanel;
