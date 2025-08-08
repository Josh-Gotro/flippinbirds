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
        <div className="w-full max-w-md lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-blue-100">
              <AlertTriangle className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 leading-tight tracking-tight">Bird Strike Reporter</h1>
              <p className="text-xs sm:text-sm lg:text-base text-blue-600 font-medium truncate">KOBA — Keep Our Birds Alive</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Modern mobile-first tabs */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-slate-200/50 sticky top-[88px] sm:top-[104px] lg:top-[120px] z-10">
        <div className="w-full max-w-md lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-3">
            <button
              onClick={() => setActiveTab('report')}
              className={`flex-1 py-3 px-2 sm:px-3 lg:px-4 rounded-xl text-center transition-all duration-300 relative overflow-hidden ${
                activeTab === 'report'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 scale-105'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 active:scale-95'
              }`}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mx-auto mb-1" />
              <div className="text-xs sm:text-sm lg:text-base font-semibold">Report</div>
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`flex-1 py-3 px-2 sm:px-3 lg:px-4 rounded-xl text-center transition-all duration-300 relative overflow-hidden ${
                activeTab === 'data'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 scale-105'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 active:scale-95'
              }`}
            >
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mx-auto mb-1" />
              <div className="text-xs sm:text-sm lg:text-base font-semibold">Data</div>
            </button>
            <button
              onClick={() => setActiveTab('view')}
              className={`flex-1 py-3 px-2 sm:px-3 lg:px-4 rounded-xl text-center transition-all duration-300 relative overflow-hidden ${
                activeTab === 'view'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 scale-105'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 active:scale-95'
              }`}
            >
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mx-auto mb-1" />
              <div className="text-xs sm:text-sm lg:text-base font-semibold">Reports</div>
            </button>
          </div>
        </div>
      </div>

      {/* Content - Responsive with safe area */}
      <div className="w-full max-w-md lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pb-safe">
        <div className="min-h-[50vh]">
          {activeTab === 'report' && <ReportForm />}
          {activeTab === 'data' && <DataDashboard />}
          {activeTab === 'view' && <ReportsList />}
        </div>
      </div>

      {/* Footer with KOBA link */}
      <div className="bg-white/95 backdrop-blur-sm border-t border-slate-200/50 mt-auto">
        <div className="w-full max-w-md lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center space-y-2">
            <p className="text-xs text-slate-500 leading-relaxed">
              Not affiliated with UAS: KOBA is a community effort.
            </p>
            <a 
              href="https://sites.google.com/view/keepourbirdsalive/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              About KOBA
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BirdStrikeApp