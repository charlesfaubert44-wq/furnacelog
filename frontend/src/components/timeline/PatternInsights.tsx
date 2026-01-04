/**
 * Pattern Insights Component
 *
 * Displays detected maintenance patterns and insights
 * v1.5 feature implementation
 */

import React from 'react';
import { PatternInsight, WeatherCorrelation } from '../../services/timeline.service';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingUp, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

interface PatternInsightsProps {
  patterns: PatternInsight;
  correlations: WeatherCorrelation | null;
}

const PatternInsights: React.FC<PatternInsightsProps> = ({ patterns, correlations }) => {
  const getConfidenceBadge = (confidence: string) => {
    const colors = {
      high: 'bg-green-600',
      medium: 'bg-yellow-600',
      low: 'bg-gray-600'
    };

    return (
      <Badge className={`${colors[confidence as keyof typeof colors] || colors.low} text-white`}>
        {confidence.toUpperCase()} CONFIDENCE
      </Badge>
    );
  };

  const getConsistencyColor = (consistency: number) => {
    if (consistency >= 80) return 'text-green-500';
    if (consistency >= 60) return 'text-yellow-500';
    return 'text-orange-500';
  };

  return (
    <div className="space-y-6">
      {/* Pattern Confidence */}
      <Card className="p-6 bg-gray-800 border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Pattern Analysis</h2>
            <p className="text-gray-400 mt-1">
              Detected patterns in your home maintenance history
            </p>
          </div>
          {getConfidenceBadge(patterns.confidence)}
        </div>
      </Card>

      {/* Recurring Patterns */}
      {patterns.patterns.recurring.length > 0 ? (
        <Card className="p-6 bg-gray-800 border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-orange-500" />
            <h3 className="text-xl font-semibold text-white">Recurring Maintenance Patterns</h3>
          </div>

          <div className="space-y-4">
            {patterns.patterns.recurring.map((pattern, idx) => (
              <div
                key={idx}
                className="p-4 bg-gray-900 border border-gray-700 rounded-lg hover:border-orange-500 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-white">{pattern.system}</h4>
                      <span className={`text-sm font-semibold ${getConsistencyColor(pattern.consistency)}`}>
                        {pattern.consistency}% consistent
                      </span>
                    </div>

                    <p className="text-gray-300 mb-3">{pattern.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Interval</p>
                        <p className="text-white font-semibold">{pattern.interval} days</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Occurrences</p>
                        <p className="text-white font-semibold">{pattern.occurrences}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Status</p>
                        {pattern.consistency >= 70 ? (
                          <div className="flex items-center gap-1 text-green-500">
                            <CheckCircle className="w-4 h-4" />
                            <span className="font-semibold">Reliable</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-yellow-500">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="font-semibold">Variable</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                {pattern.consistency >= 70 && (
                  <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700 rounded">
                    <p className="text-sm text-blue-300">
                      💡 <strong>Recommendation:</strong> Based on this pattern, schedule your next maintenance
                      in approximately {pattern.interval} days to maintain consistency.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="p-6 bg-gray-800 border-gray-700">
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">No Recurring Patterns Detected Yet</h3>
            <p className="text-gray-400">
              Keep logging maintenance activities. Patterns will emerge as you build your history.
            </p>
          </div>
        </Card>
      )}

      {/* Weather Correlations Preview */}
      {correlations && correlations.coldSnapMaintenance.length > 0 && (
        <Card className="p-6 bg-gray-800 border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Weather-Triggered Maintenance</h3>
          </div>

          <div className="mb-4">
            <p className="text-gray-300">
              We detected <strong className="text-orange-500">{correlations.coldSnapMaintenance.length}</strong> maintenance
              events that occurred shortly after extreme cold weather.
            </p>
          </div>

          <div className="space-y-3">
            {correlations.coldSnapMaintenance.slice(0, 3).map((item, idx) => (
              <div key={idx} className="p-3 bg-gray-900 border border-gray-700 rounded">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-medium">{item.maintenance.system}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Occurred {item.daysAfter} days after cold snap • ${item.maintenance.cost}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">
                      {new Date(item.maintenance.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {correlations.coldSnapMaintenance.length > 3 && (
            <p className="text-sm text-gray-400 mt-3">
              ... and {correlations.coldSnapMaintenance.length - 3} more events
            </p>
          )}

          <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700 rounded">
            <p className="text-sm text-blue-300">
              💡 <strong>Insight:</strong> Your home systems show stress after extreme cold events.
              Consider scheduling preventive maintenance before or immediately after cold snaps to reduce emergency repairs.
            </p>
          </div>
        </Card>
      )}

      {/* Key Insights Summary */}
      <Card className="p-6 bg-gray-800 border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Key Insights</h3>

        <div className="space-y-3">
          {patterns.patterns.recurring.length > 0 && (
            <div className="flex items-start gap-3 p-3 bg-gray-900 rounded">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Established Maintenance Rhythm</p>
                <p className="text-sm text-gray-400">
                  You have {patterns.patterns.recurring.length} reliable maintenance patterns,
                  showing consistent home care.
                </p>
              </div>
            </div>
          )}

          {correlations && correlations.seasonalPatterns && (
            <div className="flex items-start gap-3 p-3 bg-gray-900 rounded">
              <TrendingUp className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Seasonal Variations</p>
                <p className="text-sm text-gray-400">
                  {Object.keys(correlations.seasonalPatterns).length} seasons analyzed.
                  {Object.entries(correlations.seasonalPatterns).sort((a: any, b: any) => b[1].count - a[1].count)[0] && (
                    <span>
                      {' '}Most activity in{' '}
                      <span className="text-orange-500 font-semibold">
                        {Object.entries(correlations.seasonalPatterns).sort((a: any, b: any) => b[1].count - a[1].count)[0][0]}
                      </span>.
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {patterns.confidence === 'low' && (
            <div className="flex items-start gap-3 p-3 bg-gray-900 rounded">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-medium">Building Your History</p>
                <p className="text-sm text-gray-400">
                  Keep logging maintenance events. More data will improve pattern detection and predictions.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PatternInsights;
