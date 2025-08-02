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
      .slice(0, 12) // Top 12 buildings to keep chart readable
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
      .slice(0, 8) // Top 8 species for readability
  }



  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280']

  if (loading) {
    return (
      <div className="mt-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    )
  }

  const fatalityRate = reports.length > 0 ? Math.round((reports.filter(r => r.bird_condition === 'deceased').length / reports.length) * 100) : 0
  const topBuilding = getBuildingData()[0]
  const topSpecies = getSpeciesData()[0]

  return (
    <div className="mt-6 space-y-6">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 p-6 lg:p-8 ring-1 ring-slate-100">
        <h2 className="text-lg lg:text-xl font-semibold text-slate-900 mb-6 tracking-tight">Campus Bird Strike Data</h2>
        
        {/* Key Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 lg:p-6 rounded-2xl text-center border border-red-200">
            <div className="text-2xl lg:text-3xl font-bold text-red-600">{reports.length}</div>
            <div className="text-sm lg:text-base text-red-700 font-medium">Total Reports</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 lg:p-6 rounded-2xl text-center border border-orange-200">
            <div className="text-2xl lg:text-3xl font-bold text-orange-600">
              {reports.filter(r => r.bird_condition === 'deceased').length}
            </div>
            <div className="text-sm lg:text-base text-orange-700 font-medium">Fatalities</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 lg:p-6 rounded-2xl text-center border border-blue-200">
            <div className="text-2xl lg:text-3xl font-bold text-blue-600">
              {reports.filter(r => r.bird_condition === 'injured').length}
            </div>
            <div className="text-sm lg:text-base text-blue-700 font-medium">Injured</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 lg:p-6 rounded-2xl text-center border border-green-200">
            <div className="text-2xl lg:text-3xl font-bold text-green-600">
              {reports.filter(r => r.bird_condition === 'stunned').length}
            </div>
            <div className="text-sm lg:text-base text-green-700 font-medium">Recovered</div>
          </div>
        </div>

                          {/* Charts Section */}
         <div className="space-y-6 lg:space-y-8">
           {/* Top Row - Building and Condition Charts */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                           {/* Reports by Building */}
              {getBuildingData().length > 0 && (
                                 <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-4 pb-20 lg:pb-0 border border-slate-200/50">
                 <div className="flex justify-between items-center mb-16">
                   <h3 className="text-md lg:text-lg font-semibold text-slate-900">Reports by Building</h3>
                   {new Set(reports.map(r => r.building)).size > 12 && (
                     <span className="text-xs text-slate-500">
                       Showing top 12 of {new Set(reports.map(r => r.building)).size} buildings
                     </span>
                   )}
                 </div>
                                                                  <ResponsiveContainer width="100%" height={280}>
                                   <BarChart data={getBuildingData()} margin={{ bottom: 0, left: 0, right: 20, top: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                         <XAxis 
                       dataKey="building" 
                       angle={-45} 
                       textAnchor="end" 
                       height={100} 
                       fontSize={10}
                       interval={0}
                       tick={{ fill: '#64748b' }}
                       tickFormatter={(value) => {
                         // Truncate very long names and add ellipsis
                         if (value.length > 15) {
                           return value.substring(0, 12) + '...'
                         }
                         return value
                       }}
                     />
                                         <YAxis 
                       tick={{ fill: '#64748b' }} 
                       tickFormatter={(value) => Math.round(value).toString()}
                       domain={[0, 'dataMax']}
                       allowDecimals={false}
                     />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

             {/* Bird Condition Outcomes */}
             {getConditionData().length > 0 && (
               <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-slate-200/50">
                 <h3 className="text-md lg:text-lg font-semibold text-slate-900 mb-4">Bird Condition Outcomes</h3>
                 <ResponsiveContainer width="100%" height={250}>
                   <PieChart>
                     <Pie
                       data={getConditionData()}
                       cx="50%"
                       cy="50%"
                       labelLine={false}
                       outerRadius={70}
                       fill="#8884d8"
                       dataKey="count"
                     >
                       {getConditionData().map((_, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip 
                       contentStyle={{ 
                         backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                         border: '1px solid #e2e8f0',
                         borderRadius: '12px',
                         boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                       }}
                     />
                   </PieChart>
                 </ResponsiveContainer>
                 
                 {/* Legend */}
                 <div className="mt-4 flex flex-wrap justify-center gap-3">
                   {getConditionData().map((item, index) => (
                     <div key={item.condition} className="flex items-center gap-2 text-sm">
                       <div 
                         className="w-3 h-3 rounded-full" 
                         style={{ backgroundColor: COLORS[index % COLORS.length] }}
                       />
                       <span className="font-medium text-slate-700">{item.condition}</span>
                       <span className="text-slate-500">({item.count})</span>
                     </div>
                   ))}
                 </div>
               </div>
             )}
           </div>

                       {/* Species Chart - Full Width Row */}
            {getSpeciesData().length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 pb-24 lg:pb-6 border border-slate-200/50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md lg:text-lg font-semibold text-slate-900">Most Affected Species</h3>
                  {new Set(reports.filter(r => r.species && r.species !== 'Unknown' && r.species !== 'Other').map(r => r.species)).size > 8 && (
                    <span className="text-xs text-slate-500">
                      Showing top 8 of {new Set(reports.filter(r => r.species && r.species !== 'Unknown' && r.species !== 'Other').map(r => r.species)).size} species
                    </span>
                  )}
                </div>
                                 <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={getSpeciesData()} margin={{ bottom: 0, left: -20, right: 0, top: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                         <XAxis 
                       dataKey="species" 
                       angle={-45} 
                       textAnchor="end" 
                       height={70} 
                       fontSize={10}
                       interval={0}
                       tick={{ fill: '#64748b' }}
                                           tickFormatter={(value) => {
                       // Truncate very long names and add ellipsis
                       if (value.length > 15) {
                         return value.substring(0, 12) + '...'
                       }
                       return value
                     }}
                    />
                    <YAxis 
                      tick={{ fill: '#64748b' }} 
                      tickFormatter={(value) => Math.round(value).toString()}
                      domain={[0, 'dataMax']}
                      allowDecimals={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                      }}
                      labelFormatter={(value) => value} // Show full name in tooltip
                    />
                    <Bar dataKey="count" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

        {/* Key Insights */}
        <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Key Insights</h3>
        <ul className="text-sm text-blue-800 space-y-1">
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
                 {getSpeciesData().length > 0 && getSpeciesData()[0]?.count > 10 && (
                 <li>• <strong>{getSpeciesData()[0].species}</strong> is the most frequently reported species ({getSpeciesData()[0].count} reports)</li>
                 )}
            </>
            )}
            <li>• Data collection period: {Math.ceil((new Date().getTime() - new Date(Math.min(...reports.map(r => new Date(r.date).getTime()))).getTime()) / (1000 * 60 * 60 * 24))} days</li>
        </ul>
        
        {reports.length < 10 && (
            <div className="mt-3 p-3 bg-blue-100 rounded border">
            <p className="text-xs text-blue-700">
                💡 <strong>Tip:</strong> More meaningful patterns will emerge as additional reports are collected.
            </p>
            </div>
        )}
        </div>
      </div>
    </div>
  )
}

export default DataDashboard
