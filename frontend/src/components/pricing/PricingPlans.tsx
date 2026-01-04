import { Check, Flame, Zap, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  features: string[];
  limitations?: string[];
  cta: string;
  popular?: boolean;
  comingSoon?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Homesteader',
    price: 0,
    period: 'forever',
    description: 'Essential home tracking with ads',
    icon: Flame,
    iconColor: 'from-[#f7931e] to-[#ff6b35]',
    features: [
      'Track unlimited homes',
      'Basic maintenance scheduling',
      'Weather alerts',
      'Mobile responsive',
      'Community support',
      'Seasonal checklists'
    ],
    limitations: [
      'Ads displayed',
      'Basic features only'
    ],
    cta: 'Get Started Free'
  },
  {
    id: 'premium',
    name: 'Northern Pro',
    price: 6.99,
    period: 'month',
    description: 'Ad-free experience with advanced features',
    icon: Zap,
    iconColor: 'from-[#6a994e] to-[#7ea88f]',
    features: [
      'Everything in Homesteader',
      '✨ No advertisements',
      'Advanced maintenance analytics',
      'Custom maintenance schedules',
      'Document storage (5GB)',
      'Priority email support',
      'Export maintenance logs',
      'Multi-home dashboards'
    ],
    cta: 'Go Ad-Free',
    popular: true
  },
  {
    id: 'professional',
    name: 'Contractor',
    price: 19.99,
    period: 'month',
    description: 'For professionals managing multiple properties',
    icon: Crown,
    iconColor: 'from-[#d4a373] to-[#c87941]',
    features: [
      'Everything in Northern Pro',
      'Manage up to 50 homes',
      'Client portal access',
      'Branded reports',
      'Document storage (50GB)',
      'API access',
      'White-label option',
      'Dedicated support',
      'Custom integrations'
    ],
    cta: 'Contact Sales',
    comingSoon: true
  }
];

export const PricingPlans: React.FC = () => {
  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {pricingTiers.map((tier) => (
        <div
          key={tier.id}
          className={cn(
            'relative bg-gradient-to-br from-[#2d1f1a] to-[#1a1412] border rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl',
            tier.popular
              ? 'border-[#6a994e] shadow-[0_8px_32px_rgba(106,153,78,0.3)] hover:shadow-[0_12px_48px_rgba(106,153,78,0.4)] scale-105'
              : 'border-[#f4e8d8]/10 hover:border-[#ff6b35]/30 hover:shadow-[0_8px_32px_rgba(255,107,53,0.2)]'
          )}
        >
          {tier.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-[#6a994e] to-[#7ea88f] text-[#f4e8d8] text-xs font-bold rounded-full shadow-lg">
                <Zap className="w-3 h-3" />
                MOST POPULAR
              </span>
            </div>
          )}

          {tier.comingSoon && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-[#d4a373] to-[#c87941] text-[#f4e8d8] text-xs font-bold rounded-full shadow-lg">
                COMING SOON
              </span>
            </div>
          )}

          {/* Icon */}
          <div className={cn(
            'w-16 h-16 bg-gradient-to-br rounded-xl flex items-center justify-center mb-6 shadow-lg',
            tier.iconColor
          )}>
            <tier.icon className="w-8 h-8 text-[#f4e8d8]" />
          </div>

          {/* Name & Price */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-[#f4e8d8] mb-2">{tier.name}</h3>
            <p className="text-sm text-[#d4a373] mb-4">{tier.description}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-[#f4e8d8]">
                {tier.price === 0 ? 'Free' : `$${tier.price}`}
              </span>
              {tier.price > 0 && (
                <span className="text-[#d4a373]">/ {tier.period}</span>
              )}
            </div>
          </div>

          {/* Features */}
          <ul className="space-y-3 mb-8">
            {tier.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#6a994e] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-[#d4a373]">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Limitations */}
          {tier.limitations && tier.limitations.length > 0 && (
            <div className="mb-8 p-4 bg-[#3d3127]/50 border border-[#f4e8d8]/10 rounded-lg">
              {tier.limitations.map((limitation, index) => (
                <p key={index} className="text-xs text-[#d4a373]/70 italic">
                  • {limitation}
                </p>
              ))}
            </div>
          )}

          {/* CTA */}
          <button
            disabled={tier.comingSoon}
            className={cn(
              'w-full px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg',
              tier.popular
                ? 'bg-gradient-to-r from-[#6a994e] to-[#7ea88f] hover:from-[#7ea88f] hover:to-[#6a994e] text-[#f4e8d8] shadow-[0_4px_16px_rgba(106,153,78,0.4)] hover:shadow-[0_6px_24px_rgba(106,153,78,0.5)] hover:scale-105'
                : tier.comingSoon
                ? 'bg-[#3d3127] text-[#d4a373]/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#ff6b35] to-[#f7931e] hover:from-[#f7931e] hover:to-[#ff6b35] text-[#f4e8d8] shadow-[0_4px_16px_rgba(255,107,53,0.4)] hover:shadow-[0_6px_24px_rgba(255,107,53,0.5)] hover:scale-105'
            )}
          >
            {tier.cta}
          </button>
        </div>
      ))}
    </div>
  );
};

export default PricingPlans;
