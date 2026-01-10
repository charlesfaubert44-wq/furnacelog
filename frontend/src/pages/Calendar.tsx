/**
 * Calendar Page
 * Full-page view of the interactive maintenance calendar
 */

import { InteractiveCalendar } from '@/components/calendar/InteractiveCalendar';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Calendar() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">Maintenance Calendar</h1>
            <p className="text-gray-600 mt-2">
              Schedule, manage, and track all your home maintenance tasks
            </p>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <InteractiveCalendar />
      </div>
    </div>
  );
}

export default Calendar;
