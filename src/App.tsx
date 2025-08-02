import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import './index.css'

function App() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from('bird_strikes')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error:', error)
      } else {
        setReports(data || [])
      }
      setLoading(false)
    }

    fetchReports()
  }, [])

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Bird Strike Reports</h1>
      <p className="mb-4">Connected to Supabase! Found {reports.length} reports.</p>
      
      {reports.map((report: any) => (
        <div key={report.id} className="border p-4 mb-2 rounded">
          <div className="font-semibold">{report.building}</div>
          <div className="text-sm text-gray-600">
            {report.date} - {report.bird_condition}
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
