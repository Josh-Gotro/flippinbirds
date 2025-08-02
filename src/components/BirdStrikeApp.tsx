import { useState } from 'react'
import { AlertTriangle, Plus, BarChart3, Eye } from 'lucide-react'
import ReportForm from './ReportForm'
import DataDashboard from './DataDashboard'
import ReportsList from './ReportsList'

const BirdStrikeApp = () => {
  const [activeTab, setActiveTab] = useState('report')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header - Responsive with modern styling */}
      <div className="bg-white/95 backdrop-blur-sm shadow-xl border-b border-slate-200/50 sticky top-0 z-10">
        <div className="w-full max-w-md mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-blue-100">
              <AlertTriangle className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight tracking-tight">Bird Strike Reporter</h1>
              <p className="text-xs sm:text-sm text-blue-600 font-medium truncate">Campus Wildlife Safety Initiative</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Modern mobile-first tabs */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-slate-200/50 sticky top-[88px] sm:top-[104px] z-10">
        <div className="w-full max-w-md mx-auto px-4 sm:px-6">
          <div className="flex gap-1 py-3">
            <button
              onClick={() => setActiveTab('report')}
              className={`flex-1 py-3 px-2 sm:px-3 rounded-xl text-center transition-all duration-300 relative overflow-hidden ${
                activeTab === 'report'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 scale-105'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 active:scale-95'
              }`}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1" />
              <div className="text-xs sm:text-sm font-semibold">Report</div>
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`flex-1 py-3 px-2 sm:px-3 rounded-xl text-center transition-all duration-300 relative overflow-hidden ${
                activeTab === 'data'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 scale-105'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 active:scale-95'
              }`}
            >
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1" />
              <div className="text-xs sm:text-sm font-semibold">Data</div>
            </button>
            <button
              onClick={() => setActiveTab('view')}
              className={`flex-1 py-3 px-2 sm:px-3 rounded-xl text-center transition-all duration-300 relative overflow-hidden ${
                activeTab === 'view'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 scale-105'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 active:scale-95'
              }`}
            >
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1" />
              <div className="text-xs sm:text-sm font-semibold">Reports</div>
            </button>
          </div>
        </div>
      </div>

      {/* Content - Responsive with safe area */}
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-safe">
        <div className="min-h-[50vh]">
          {activeTab === 'report' && <ReportForm />}
          {activeTab === 'data' && <DataDashboard />}
          {activeTab === 'view' && <ReportsList />}
        </div>
      </div>
    </div>
  )
}

export default BirdStrikeApp