import { useState, useEffect } from 'react'
import { Calendar, AlertCircle, User, FileText } from 'lucide-react'
import { type BirdStrike } from '../lib/supabase'

const ReportsList = () => {
  const [reports, setReports] = useState<BirdStrike[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  // Redact email addresses
    const formatEmail = (email: string) => {
        const domain = email.split('@')[1]
        return `***@${domain}`
    }

  // Load reports from Supabase
  useEffect(() => {
    const loadReports = async () => {
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/bird_strikes?select=*&order=created_at.desc`
        const response = await fetch(url, {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY!}`
          }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        setReports(data)
      } catch (error) {
        console.error('Error loading reports:', error)
      } finally {
        setLoading(false)
      }
    }
    loadReports()
  }, [])

  // Filter reports based on condition
  const filteredReports = filter === 'all' 
    ? reports 
    : reports.filter(report => report.bird_condition === filter)

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Format time for display
  const formatTime = (timeString: string | null | undefined) => {
    if (!timeString) return 'Time not recorded'
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  if (loading) {
    return (
      <div className="mt-4 sm:mt-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 p-4 sm:p-6 ring-1 ring-slate-100">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-slate-600 ml-3">Loading reports...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 sm:mt-6">
      {/* Header with filter */}
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 mb-4 sm:mb-6 ring-1 ring-slate-100">
        <div className="p-4 sm:p-5 border-b border-slate-200/50">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Recent Reports</h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {filteredReports.length} of {reports.length} reports
          </p>
        </div>
        
        {/* Filter buttons */}
        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 shadow-sm scale-105'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 active:scale-95'
              }`}
            >
              All ({reports.length})
            </button>
            <button
              onClick={() => setFilter('deceased')}
              className={`px-3 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                filter === 'deceased'
                  ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 shadow-sm scale-105'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 active:scale-95'
              }`}
            >
              Fatal ({reports.filter(r => r.bird_condition === 'deceased').length})
            </button>
            <button
              onClick={() => setFilter('injured')}
              className={`px-3 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                filter === 'injured'
                  ? 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 shadow-sm scale-105'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 active:scale-95'
              }`}
            >
              Injured ({reports.filter(r => r.bird_condition === 'injured').length})
            </button>
            <button
              onClick={() => setFilter('stunned')}
              className={`px-3 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                filter === 'stunned'
                  ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 shadow-sm scale-105'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 active:scale-95'
              }`}
            >
              Stunned ({reports.filter(r => r.bird_condition === 'stunned').length})
            </button>
          </div>
        </div>
      </div>

      {/* Reports list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {filteredReports.length === 0 ? (
          <div className="lg:col-span-2 bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 p-6 sm:p-8 text-center ring-1 ring-slate-100">
            <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500 text-sm sm:text-base">
              {filter === 'all' ? 'No reports found.' : `No ${filter} reports found.`}
            </p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div key={report.id} className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg border border-slate-200/50 ring-1 ring-slate-100 hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200/50">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">{report.building}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 truncate">
                      {report.location || 'Location not specified'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-2xl text-xs font-semibold flex-shrink-0 ${
                    report.bird_condition === 'deceased' ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800' :
                    report.bird_condition === 'injured' ? 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800' :
                    report.bird_condition === 'stunned' ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800' :
                    'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800'
                  }`}>
                    {report.bird_condition.charAt(0).toUpperCase() + report.bird_condition.slice(1)}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-4 sm:p-5">
                <div className="grid grid-cols-1 gap-3">
                  {/* Date & Time */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                    <span className="font-medium">{formatDate(report.date)}</span>
                    <span className="text-slate-400">•</span>
                    <span>{formatTime(report.time)}</span>
                  </div>

                  {/* Species */}
                  {report.species && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <span className="text-slate-500">Species:</span>
                      <span className="font-semibold text-slate-900">{report.species}</span>
                    </div>
                  )}

                  {/* Reporter */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                    <span className="font-mono text-xs">{formatEmail(report.reporter_email)}</span>
                    </div>

                  {/* Notes */}
                  {report.notes && (
                    <div className="border-t border-slate-200/50 pt-3 mt-3">
                      <div className="flex items-start gap-2 text-xs sm:text-sm">
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="text-slate-500 block font-medium">Notes:</span>
                          <p className="text-slate-700 mt-1 leading-relaxed">{report.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ReportsList