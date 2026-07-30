import { useState, useEffect } from 'react';
import api from '../api/api';
import { FileDown, Clock, FileText } from 'lucide-react';

interface Report {
  id: number;
  title: string;
  created_at: string;
}

const StudioPanel = () => {
  const [reports, setReports] = useState<Report[]>([]);

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports/');
      setReports(res.data);
    } catch (error) {
      console.error("Failed to fetch reports", error);
    }
  };

  // Poll for new reports or just fetch on mount. For MVP, we can add a refresh button or just fetch on mount
  useEffect(() => {
    fetchReports();
    // Setting up a basic interval to keep reports in sync if generated in ChatPanel
    const interval = setInterval(fetchReports, 5000);
    return () => clearInterval(interval);
  }, []);

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
    } catch (error) {
      alert(`Failed to export report as ${format.toUpperCase()}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-100/50 to-purple-100/50 p-4 rounded-xl border border-white/40 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-3">
          <FileText size={16} /> Generated Reports
        </h3>
        <p className="text-xs text-gray-600 mb-4">View and export AI-synthesized risk assessment reports.</p>
        
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="bg-white/60 p-3 rounded-lg shadow-sm border border-white/50 hover:bg-white/80 transition">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-gray-800">{report.title} #{report.id}</span>
                <span className="text-[10px] text-gray-500 flex items-center gap-1">
                  <Clock size={10} /> {new Date(report.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleExport(report.id, 'html')} className="text-[10px] px-2 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center gap-1">
                  <FileDown size={10} /> HTML
                </button>
                <button onClick={() => handleExport(report.id, 'pdf')} className="text-[10px] px-2 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center gap-1">
                  <FileDown size={10} /> PDF
                </button>
                <button onClick={() => handleExport(report.id, 'docx')} className="text-[10px] px-2 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center gap-1">
                  <FileDown size={10} /> DOCX
                </button>
              </div>
            </div>
          ))}
          {reports.length === 0 && (
            <div className="text-xs text-center text-gray-400 py-4">No reports generated yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudioPanel;
