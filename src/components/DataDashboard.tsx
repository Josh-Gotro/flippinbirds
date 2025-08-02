import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { type BirdStrike } from '../lib/supabase'

const DataDashboard = () => {
  const [reports, setReports] = useState<BirdStrike[]>([])
  const [loading, setLoading] = useState(true)

  // Debug environment variables
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY)
console.log('All env vars:', import.meta.env)

  // Load reports from Supabase
  useEffect(() => {
    const loadReports = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/bird_strikes?select=*&order=created_at.desc`, {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY!}`
          }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log('Loaded reports:', data) // Debug log
        setReports(data)
      } catch (error) {
        console.error('Error loading reports:', error)
      } finally {
        setLoading(false)
      }
    }
    loadReports()
  }, [])

  // Data processing for charts
  const getBuildingData = () => {
    const buildingCounts: Record<string, number> = {}
    reports.forEach(report => {
      buildingCounts[report.building] = (buildingCounts[report.building] || 0) + 1
    })
    return Object.entries(buildingCounts)
      .map(([building, count]) => ({ building, count }))
      .sort((a, b) => b.count - a.count)
  }

  const getConditionData = () => {
    const conditionCounts: Record<string, number> = {}
    reports.forEach(report => {
      conditionCounts[report.bird_condition] = (conditionCounts[report.bird_condition] || 0) + 1
    })
    return Object.entries(conditionCounts).map(([condition, count]) => ({ 
      condition: condition.charAt(0).toUpperCase() + condition.slice(1), 
      count 
    }))
  }

  const getSpeciesData = () => {
    const speciesCounts: Record<string, number> = {}
    reports.forEach(report => {
      if (report.species && report.species !== 'Unknown' && report.species !== 'Other') {
        speciesCounts[report.species] = (speciesCounts[report.species] || 0) + 1
      }
    })
    return Object.entries(speciesCounts)
      .map(([species, count]) => ({ species, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8) // Top 8 species
  }


  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280']

  if (loading) {
    return (
      <div className="mt-4 sm:mt-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 p-4 sm:p-6 ring-1 ring-slate-100">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-slate-600 ml-3">Loading data...</p>
          </div>
        </div>
      </div>
    )
  }

  const fatalityRate = reports.length > 0 ? Math.round((reports.filter(r => r.bird_condition === 'deceased').length / reports.length) * 100) : 0
  const topBuilding = getBuildingData()[0]
  const topSpecies = getSpeciesData()[0]

  return (
    <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 p-4 sm:p-6 ring-1 ring-slate-100">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 tracking-tight">Campus Bird Strike Data</h2>
        
        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 sm:p-4 rounded-2xl text-center border border-red-100 shadow-sm">
            <div className="text-xl sm:text-2xl font-bold text-red-600">{reports.length}</div>
            <div className="text-xs sm:text-sm text-red-700 font-medium">Total Reports</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 sm:p-4 rounded-2xl text-center border border-orange-100 shadow-sm">
            <div className="text-xl sm:text-2xl font-bold text-orange-600">
              {reports.filter(r => r.bird_condition === 'deceased').length}
            </div>
            <div className="text-xs sm:text-sm text-orange-700 font-medium">Fatalities</div>
          </div>
        </div>

        {/* Reports by Building */}
        {getBuildingData().length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h3 className="text-sm sm:text-md font-semibold text-slate-900 mb-3 tracking-tight">Reports by Building</h3>
            <div className="bg-slate-50/50 rounded-2xl p-2 sm:p-3 border border-slate-100">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={getBuildingData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="building" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60} 
                  fontSize={10}
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Bird Condition Outcomes */}
        {getConditionData().length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h3 className="text-sm sm:text-md font-semibold text-slate-900 mb-3 tracking-tight">Bird Condition Outcomes</h3>
            <div className="bg-slate-50/50 rounded-2xl p-2 sm:p-3 border border-slate-100">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={getConditionData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ condition, percent }) => `${condition} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {getConditionData().map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Top Species */}
        {getSpeciesData().length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h3 className="text-sm sm:text-md font-semibold text-slate-900 mb-3 tracking-tight">Most Affected Species</h3>
            <div className="bg-slate-50/50 rounded-2xl p-2 sm:p-3 border border-slate-100">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={getSpeciesData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="species" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60} 
                  fontSize={9}
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Key Insights */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-5 rounded-2xl border border-blue-100 shadow-sm">
        <h3 className="font-semibold text-blue-900 mb-3 text-sm sm:text-base tracking-tight">Key Insights</h3>
        <ul className="text-xs sm:text-sm text-blue-800 space-y-2">
            {reports.length >= 10 ? (
            // Show detailed insights when we have enough data
            <>
                {topBuilding && (
                <li>• <strong>{topBuilding.building}</strong> has the highest number of strikes ({topBuilding.count} reports)</li>
                )}
                <li>• <strong>{fatalityRate}%</strong> of reported strikes were fatal</li>
                {topSpecies && (
                <li>• Most affected species: <strong>{topSpecies.species}</strong> ({topSpecies.count} reports)</li>
                )}
            </>
            ) : (
            // Show summary insights for smaller datasets
            <>
                <li>• <strong>{reports.length}</strong> total incidents reported across campus</li>
                <li>• <strong>{reports.filter(r => r.bird_condition === 'deceased').length}</strong> fatalities, <strong>{reports.filter(r => r.bird_condition === 'injured').length}</strong> injuries, <strong>{reports.filter(r => r.bird_condition === 'stunned').length}</strong> recoveries</li>
                <li>• Reports from <strong>{new Set(reports.map(r => r.building)).size}</strong> different buildings</li>
                {getSpeciesData().length > 0 && (
                <li>• <strong>{new Set(reports.filter(r => r.species).map(r => r.species)).size}</strong> different bird species affected</li>
                )}
            </>
            )}
            <li>• Data collection period: {Math.ceil((new Date().getTime() - new Date(Math.min(...reports.map(r => new Date(r.date).getTime()))).getTime()) / (1000 * 60 * 60 * 24))} days</li>
        </ul>
        
        {reports.length < 10 && (
            <div className="mt-3 p-3 bg-blue-100/70 rounded-xl border border-blue-200">
            <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
                💡 <strong>Tip:</strong> More meaningful patterns will emerge as you collect additional reports. Consider encouraging campus-wide participation to identify problem areas.
            </p>
            </div>
        )}
        </div>
      </div>
    </div>
  )
}

export default DataDashboard
