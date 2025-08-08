import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'
import { supabase, type BirdStrike } from '../lib/supabase'

interface ReportFormProps {
  onTabChange?: (tab: string) => void
}

const ReportForm = ({ onTabChange }: ReportFormProps) => {
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    location: '',
    building: '',
    bird_condition: '',
    species: '',
    reporter_email: '',
    notes: ''
  })

  const buildings = [
    'Egan Library',
    'Egan Classroom Wing', 
    'Mourant',
    'Novatney',
    'Whitehead',
    'Hendrickson Annex',
    'Soboleff',
    'Hendrickson Main Building',
    'John R. Pugh Residence Hall',
    'Facilities Services',
    'USFS Pacific Northwest Research Station',
    'Student Housing',
    'Other'
  ]

  const commonSpecies = [
    'Unknown', 'Other', 'Common Raven', 'Northwestern Crow', 'Steller\'s Jay', 'Dark-eyed Junco',
    'Song Sparrow', 'Golden-crowned Sparrow', 'White-crowned Sparrow', 'American Robin',
    'Varied Thrush', 'Hermit Thrush', 'Ruby-crowned Kinglet', 'Golden-crowned Kinglet',
    'Chestnut-backed Chickadee', 'Red-breasted Nuthatch', 'Brown Creeper', 'Winter Wren',
    'Pacific Wren', 'American Dipper', 'Cedar Waxwing', 'Orange-crowned Warbler',
    'Yellow Warbler', 'Yellow-rumped Warbler', 'Townsend\'s Warbler', 'Wilson\'s Warbler',
    'Common Yellowthroat', 'Pine Siskin', 'American Goldfinch', 'Red Crossbill',
    'Bald Eagle', 'Sharp-shinned Hawk', 'Red-tailed Hawk', 'Merlin',
    'Belted Kingfisher', 'Downy Woodpecker', 'Hairy Woodpecker', 'Northern Flicker',
    'Red-breasted Sapsucker', 'Mallard', 'Common Goldeneye', 'Bufflehead',
    'Common Merganser', 'Red-breasted Merganser', 'Harlequin Duck', 'Surf Scoter',
    'Great Blue Heron', 'Sandhill Crane', 'Killdeer', 'Spotted Sandpiper',
    'Common Snipe', 'Mew Gull', 'Herring Gull', 'Glaucous-winged Gull'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      console.log('Submitting:', formData) // Debug log
      
      const { data, error } = await supabase
        .from('bird_strikes')
        .insert([{
          date: formData.date,
          time: formData.time || null,
          location: formData.location || null,
          building: formData.building,
          bird_condition: formData.bird_condition as BirdStrike['bird_condition'],
          species: formData.species || null,
          reporter_email: formData.reporter_email,
          notes: formData.notes || null
        }])
        .select()
      
      console.log('Supabase response:', { data, error }) // Debug log
      
      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      console.log('Success! Data inserted:', data) // Debug log
      
             // Success - clear form and show message
       setShowSuccess(true)
       setFormData({
         date: new Date().toISOString().split('T')[0],
         time: new Date().toTimeString().slice(0, 5),
         location: '',
         building: '',
         bird_condition: '',
         species: '',
         reporter_email: '',
         notes: ''
       })
       setTimeout(() => setShowSuccess(false), 5000)
       
       // Redirect to data tab after a short delay
       setTimeout(() => {
         onTabChange?.('data')
       }, 2000)
      
    } catch (error) {
      console.error('Caught error:', error)
      alert(`Error submitting report: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
    {/* Success Message */}
    {showSuccess && (
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl flex items-center gap-3 shadow-lg animate-in slide-in-from-top duration-500">
        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 flex-shrink-0" />
        <div>
            <p className="text-emerald-800 font-semibold text-sm sm:text-base">Report submitted successfully!</p>
            <p className="text-emerald-700 text-xs sm:text-sm">Thank you for helping protect campus wildlife.</p>
        </div>
        </div>
    )}

    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 p-4 sm:p-6 ring-1 ring-slate-100">
        <div className="mb-6 text-center">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 tracking-tight">Report a Bird Strike</h2>
        <p className="text-slate-600 text-sm sm:text-base">Help us document bird-window collisions to improve campus safety for wildlife.</p>
        </div>

                 <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
            <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-3 sm:px-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base bg-white/80 backdrop-blur-sm hover:border-slate-300"
            />
            </div>
            
            <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Time (optional)</label>
            <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-3 py-3 sm:px-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base bg-white/80 backdrop-blur-sm hover:border-slate-300"
            />
            </div>

            <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Building</label>
            <select
                name="building"
                value={formData.building}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-3 sm:px-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base bg-white/80 backdrop-blur-sm hover:border-slate-300"
            >
                <option value="">Select building...</option>
                {buildings.map(building => (
                <option key={building} value={building}>{building}</option>
                ))}
            </select>
            </div>

            <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Specific Location (optional)</label>
            <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., North entrance, 2nd floor east wing"
                className="w-full px-3 py-3 sm:px-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base bg-white/80 backdrop-blur-sm hover:border-slate-300"
            />
            </div>

            <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Bird Condition</label>
            <select
                name="bird_condition"
                value={formData.bird_condition}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-3 sm:px-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base bg-white/80 backdrop-blur-sm hover:border-slate-300"
            >
                <option value="">Select condition...</option>
                <option value="deceased">Deceased</option>
                <option value="injured">Injured but alive</option>
                <option value="stunned">Stunned (recovered)</option>
                <option value="unknown">Unknown</option>
            </select>
            </div>

            <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Bird Species (if known)</label>
            <select
                name="species"
                value={formData.species}
                onChange={handleInputChange}
                className="w-full px-3 py-3 sm:px-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base bg-white/80 backdrop-blur-sm hover:border-slate-300"
            >
                <option value="">Select species...</option>
                {commonSpecies.map(species => (
                <option key={species} value={species}>{species}</option>
                ))}
            </select>
            </div>

            <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Your Email (optional)</label>
            <input
                type="email"
                name="reporter_email"
                value={formData.reporter_email}
                onChange={handleInputChange}
                placeholder="your.email@college.edu"
                className="w-full px-3 py-3 sm:px-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base bg-white/80 backdrop-blur-sm hover:border-slate-300"
            />
            </div>

            <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Notes</label>
            <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                placeholder="Any additional details about the incident, window characteristics, etc."
                className="w-full px-3 py-3 sm:px-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base resize-none bg-white/80 backdrop-blur-sm hover:border-slate-300 min-h-[100px]"
            />
            </div>
        </div>

        <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-2xl font-semibold hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 focus:ring-4 focus:ring-blue-300 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
        >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            {loading ? 'Submitting...' : 'Submit Report'}
        </button>
        </form>
    </div>
    </div>
  )
}

export default ReportForm