import React from 'react';
import { Star, Phone, Mail, ChevronRight, User, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Contractor {
  id: string;
  businessName: string;
  contactName?: string;
  phone?: string;
  email?: string;
  specialties: string[];
  rating: number;
  timesHired: number;
  lastUsed: Date;
  averageCost: number;
  wouldHireAgain?: boolean;
}

interface RecentContractorsWidgetProps {
  contractors: Contractor[];
  onContractorClick?: (contractorId: string) => void;
  onContactClick?: (contractorId: string, method: 'phone' | 'email') => void;
  onViewAll?: () => void;
  onAddContractor?: () => void;
}

/**
 * RecentContractorsWidget Component
 * Displays recently used contractors with quick actions
 */
export const RecentContractorsWidget: React.FC<RecentContractorsWidgetProps> = ({
  contractors,
  onContractorClick,
  onContactClick,
  onViewAll,
  onAddContractor
}) => {
  const getSpecialtyColor = (specialty: string): string => {
    const colors: Record<string, string> = {
      'hvac': 'bg-warm-orange/20 text-warm-orange border-warm-orange/30',
      'plumbing': 'bg-sage/20 text-sage border-sage/30',
      'electrical': 'bg-soft-amber/20 text-soft-amber border-soft-amber/30',
      'general': 'bg-warm-gray/20 text-warm-gray border-warm-gray/30'
    };
    return colors[specialty.toLowerCase()] || colors['general'];
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "w-3 h-3",
              star <= rating
                ? "fill-soft-amber text-soft-amber"
                : "text-warm-gray/30"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white border border-soft-amber/20 rounded-2xl p-6 md:p-8 shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-charcoal">Recent Contractors</h3>
          <p className="text-sm text-warm-gray mt-1">Quick access to trusted professionals</p>
        </div>
        {onAddContractor && (
          <button
            onClick={onAddContractor}
            className="p-2 text-warm-gray hover:text-charcoal hover:bg-cream rounded-lg transition-colors"
            title="Add contractor"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Contractors List */}
      <div className="space-y-4">
        {contractors.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-soft-amber/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-soft-amber" />
            </div>
            <p className="text-warm-gray font-medium mb-2">No contractors yet</p>
            <p className="text-warm-gray/70 text-sm mb-4">
              Hire professionals and they'll appear here
            </p>
            {onAddContractor && (
              <button
                onClick={onAddContractor}
                className="px-6 py-3 bg-gradient-to-r from-burnt-sienna to-warm-orange hover:from-warm-orange hover:to-burnt-sienna text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Contractor
              </button>
            )}
          </div>
        ) : (
          <>
            {contractors.slice(0, 3).map((contractor) => (
              <div
                key={contractor.id}
                className="group p-4 bg-cream/30 hover:bg-cream border-2 border-soft-amber/20 hover:border-soft-amber/40 rounded-2xl transition-all duration-300 cursor-pointer hover:shadow-md"
                onClick={() => onContractorClick?.(contractor.id)}
              >
                {/* Contractor Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-charcoal mb-1 line-clamp-1">
                      {contractor.businessName}
                    </h4>
                    {contractor.contactName && (
                      <p className="text-xs text-warm-gray">{contractor.contactName}</p>
                    )}
                  </div>
                  {contractor.wouldHireAgain && (
                    <div className="flex-shrink-0 ml-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-lg bg-sage/20 text-sage text-xs font-medium border border-sage/30">
                        Recommended
                      </span>
                    </div>
                  )}
                </div>

                {/* Rating & Stats */}
                <div className="flex items-center gap-3 mb-3">
                  {renderStars(contractor.rating)}
                  <span className="text-xs text-warm-gray">
                    {contractor.rating.toFixed(1)} ({contractor.timesHired} {contractor.timesHired === 1 ? 'job' : 'jobs'})
                  </span>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {contractor.specialties.slice(0, 3).map((specialty, index) => (
                    <span
                      key={index}
                      className={cn(
                        "text-xs px-2 py-1 rounded-lg border font-medium capitalize",
                        getSpecialtyColor(specialty)
                      )}
                    >
                      {specialty}
                    </span>
                  ))}
                  {contractor.specialties.length > 3 && (
                    <span className="text-xs px-2 py-1 rounded-lg border font-medium bg-warm-gray/20 text-warm-gray border-warm-gray/30">
                      +{contractor.specialties.length - 3} more
                    </span>
                  )}
                </div>

                {/* Cost & Last Used */}
                <div className="flex items-center justify-between text-xs text-warm-gray mb-3">
                  <span>Avg: ${contractor.averageCost.toLocaleString()}</span>
                  <span>Last: {contractor.lastUsed.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })}</span>
                </div>

                {/* Contact Actions */}
                <div className="flex gap-2 pt-3 border-t border-soft-amber/20">
                  {contractor.phone && onContactClick && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onContactClick(contractor.id, 'phone');
                      }}
                      className="flex-1 px-3 py-2 bg-white hover:bg-warm-white text-charcoal border border-soft-amber/30 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Phone className="w-3 h-3" />
                      Call
                    </button>
                  )}
                  {contractor.email && onContactClick && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onContactClick(contractor.id, 'email');
                      }}
                      className="flex-1 px-3 py-2 bg-white hover:bg-warm-white text-charcoal border border-soft-amber/30 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Mail className="w-3 h-3" />
                      Email
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* View All Button */}
            {contractors.length > 3 && onViewAll && (
              <button
                onClick={onViewAll}
                className="w-full px-4 py-3 bg-cream hover:bg-soft-beige text-charcoal font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 mt-4"
              >
                View All Contractors ({contractors.length})
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RecentContractorsWidget;
