import React, { useState } from 'react'
import { AlertTriangle, Plus, BarChart3, Eye } from 'lucide-react'
import ReportForm from './ReportForm'
import DataDashboard from './DataDashboard'
import ReportsList from './ReportsList'

const BirdStrikeApp = () => {
  const [activeTab, setActiveTab] = useState('report')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Bird Strike Reporter</h1>
              <p className="text-sm text-gray-600">Campus Wildlife Safety Initiative</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab('report')}
              className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors ${
                activeTab === 'report'
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-gray-600'
              }`}
            >
              <Plus className="w-4 h-4 mx-auto mb-1" />
              Report
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors ${
                activeTab === 'data'
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-gray-600'
              }`}
            >
              <BarChart3 className="w-4 h-4 mx-auto mb-1" />
              Data
            </button>
            <button
              onClick={() => setActiveTab('view')}
              className={`flex-1 py-3 px-4 text-center border-b-2 transition-colors ${
                activeTab === 'view'
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-gray-600'
              }`}
            >
              <Eye className="w-4 h-4 mx-auto mb-1" />
              Reports
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 pb-8">
        {activeTab === 'report' && <ReportForm />}
        {activeTab === 'data' && <DataDashboard />}
        {activeTab === 'view' && <ReportsList />}
      </div>
    </div>
  )
}

export default BirdStrikeApp
