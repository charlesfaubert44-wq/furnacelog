import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { completeOnboarding } from '@/services/onboarding.service';
import {
  Home,
  Flame,
  Droplet,
  Trash2,
  MapPin,
  ArrowRight,
  X,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Simplified validation schema - only 5 essential questions
const onboardingSchema = z.object({
  // Question 1: Home basics
  homeName: z.string().min(1, 'Please enter a name for your home'),
  community: z.string().min(1, 'Community is required'),
  territory: z.enum(['NWT', 'Nunavut', 'Yukon', 'Other'], {
    required_error: 'Please select a territory'
  }),

  // Question 2: Home type
  homeType: z.enum(['modular', 'stick-built', 'log', 'mobile', 'other'], {
    required_error: 'Please select a home type'
  }),
  yearBuilt: z.string().optional(),

  // Question 3: Heating system
  primaryHeating: z.enum([
    'oil-furnace',
    'propane-furnace',
    'natural-gas',
    'electric-furnace',
    'boiler',
    'wood-stove',
    'pellet-stove',
    'heat-pump'
  ], {
    required_error: 'Please select your primary heating system'
  }),

  // Question 4: Water source
  waterSource: z.enum(['municipal', 'well', 'trucked', 'combination'], {
    required_error: 'Please select your water source'
  }),

  // Question 5: Sewage system
  sewageSystem: z.enum(['municipal', 'septic', 'holding-tank', 'combination'], {
    required_error: 'Please select your sewage system'
  }),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

const homeTypeOptions = [
  { value: 'modular', label: 'Modular Home', description: 'Factory-built in sections' },
  { value: 'stick-built', label: 'Stick-Built', description: 'Traditional on-site construction' },
  { value: 'log', label: 'Log Home', description: 'Log cabin construction' },
  { value: 'mobile', label: 'Mobile Home', description: 'Manufactured/trailer home' },
  { value: 'other', label: 'Other', description: 'Different type' },
];

const heatingOptions = [
  { value: 'oil-furnace', label: 'Oil Furnace', icon: Flame },
  { value: 'propane-furnace', label: 'Propane Furnace', icon: Flame },
  { value: 'natural-gas', label: 'Natural Gas Furnace', icon: Flame },
  { value: 'electric-furnace', label: 'Electric Furnace', icon: Flame },
  { value: 'boiler', label: 'Boiler', icon: Flame },
  { value: 'wood-stove', label: 'Wood Stove', icon: Flame },
  { value: 'pellet-stove', label: 'Pellet Stove', icon: Flame },
  { value: 'heat-pump', label: 'Heat Pump', icon: Flame },
];

const waterOptions = [
  { value: 'municipal', label: 'Municipal Water', description: 'City/town water supply' },
  { value: 'well', label: 'Well Water', description: 'Private well' },
  { value: 'trucked', label: 'Trucked Water', description: 'Delivered to tank' },
  { value: 'combination', label: 'Combination', description: 'Multiple sources' },
];

const sewageOptions = [
  { value: 'municipal', label: 'Municipal Sewer', description: 'City/town sewer system' },
  { value: 'septic', label: 'Septic System', description: 'Septic tank and field' },
  { value: 'holding-tank', label: 'Holding Tank', description: 'Requires pumping' },
  { value: 'combination', label: 'Combination', description: 'Multiple systems' },
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onBlur',
    defaultValues: {
      homeName: '',
      community: '',
      yearBuilt: '',
    }
  });

  const selectedHomeType = watch('homeType');
  const selectedHeating = watch('primaryHeating');
  const selectedWater = watch('waterSource');
  const selectedSewage = watch('sewageSystem');

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      setIsSubmitting(true);
      console.log('Submitting simplified onboarding data:', data);

      // Transform data to match API format
      const onboardingData = {
        home: {
          name: data.homeName,
          homeType: data.homeType,
          community: data.community,
          territory: data.territory,
          yearBuilt: data.yearBuilt ? parseInt(data.yearBuilt) : undefined,
        },
        systems: {
          heating: {
            primaryHeating: data.primaryHeating,
          },
          water: {
            waterSource: data.waterSource,
          },
          sewage: {
            sewageSystem: data.sewageSystem,
          },
        },
        preferences: {
          autoGenerateChecklists: true,
        }
      };

      // Call backend API
      try {
        const response = await completeOnboarding(onboardingData);
        console.log('Onboarding completed successfully:', response);
      } catch (apiError: any) {
        console.warn('Onboarding API error (continuing anyway):', apiError);
      }

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      alert(`There was an error completing setup. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    try {
      setIsSubmitting(true);
      console.log('Skipping onboarding - marking as complete with minimal data');

      // Submit minimal data to mark onboarding as complete
      const minimalData = {
        home: {
          name: 'My Home',
          homeType: 'other',
          community: 'Unknown',
          territory: 'Other',
        },
        systems: {
          heating: {
            primaryHeating: 'oil-furnace',
          },
          water: {
            waterSource: 'municipal',
          },
          sewage: {
            sewageSystem: 'municipal',
          },
        },
        preferences: {
          autoGenerateChecklists: true,
        }
      };

      try {
        await completeOnboarding(minimalData);
        console.log('Onboarding marked as complete (skipped)');
      } catch (apiError: any) {
        console.warn('Failed to mark onboarding as complete:', apiError);
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error skipping onboarding:', error);
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-white via-cream to-warm-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-burnt-sienna to-warm-orange shadow-lg mb-4">
            <Home className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-charcoal mb-2">
            Welcome to FurnaceLog
          </h1>
          <p className="text-lg text-warm-gray">
            Tell us about your home in just 5 quick questions
          </p>
        </div>

        {/* Skip Button */}
        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={handleSkip}
            disabled={isSubmitting}
            className="text-sm text-warm-gray hover:text-burnt-sienna transition-colors inline-flex items-center gap-1 font-medium disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Skipping...
              </>
            ) : (
              <>
                <X className="w-4 h-4" />
                Skip for now
              </>
            )}
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Question 1: Home Location */}
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-soft-amber/30 shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-burnt-sienna to-warm-orange shadow-md flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-charcoal mb-1">
                    1. Where is your home?
                  </h2>
                  <p className="text-sm text-warm-gray">
                    Basic information about your home's location
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Home Name
                  </label>
                  <input
                    {...register('homeName')}
                    type="text"
                    placeholder="e.g., My Yellowknife Home"
                    className={cn(
                      "w-full px-4 py-3 bg-white border-2 rounded-xl text-charcoal placeholder-warm-gray/50 transition-colors",
                      errors.homeName ? 'border-warm-coral' : 'border-soft-amber/30 focus:border-burnt-sienna focus:outline-none'
                    )}
                  />
                  {errors.homeName && (
                    <p className="text-sm text-warm-coral mt-1">{errors.homeName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Community
                    </label>
                    <input
                      {...register('community')}
                      type="text"
                      placeholder="e.g., Yellowknife"
                      className={cn(
                        "w-full px-4 py-3 bg-white border-2 rounded-xl text-charcoal placeholder-warm-gray/50 transition-colors",
                        errors.community ? 'border-warm-coral' : 'border-soft-amber/30 focus:border-burnt-sienna focus:outline-none'
                      )}
                    />
                    {errors.community && (
                      <p className="text-sm text-warm-coral mt-1">{errors.community.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Territory
                    </label>
                    <select
                      {...register('territory')}
                      className={cn(
                        "w-full px-4 py-3 bg-white border-2 rounded-xl text-charcoal transition-colors",
                        errors.territory ? 'border-warm-coral' : 'border-soft-amber/30 focus:border-burnt-sienna focus:outline-none'
                      )}
                    >
                      <option value="">Select...</option>
                      <option value="NWT">Northwest Territories</option>
                      <option value="Nunavut">Nunavut</option>
                      <option value="Yukon">Yukon</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.territory && (
                      <p className="text-sm text-warm-coral mt-1">{errors.territory.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Question 2: Home Type */}
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-soft-amber/30 shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-burnt-sienna to-warm-orange shadow-md flex items-center justify-center flex-shrink-0">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-charcoal mb-1">
                    2. What type of home is it?
                  </h2>
                  <p className="text-sm text-warm-gray">
                    This helps us understand your home's construction
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {homeTypeOptions.map((option) => (
                    <label
                      key={option.value}
                      className={cn(
                        "relative flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                        selectedHomeType === option.value
                          ? 'border-burnt-sienna bg-burnt-sienna/5'
                          : 'border-soft-amber/30 hover:border-soft-amber/50 hover:bg-soft-amber/5'
                      )}
                    >
                      <input
                        {...register('homeType')}
                        type="radio"
                        value={option.value}
                        className="mt-1 text-burnt-sienna focus:ring-burnt-sienna"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-charcoal">{option.label}</div>
                        <div className="text-sm text-warm-gray">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.homeType && (
                  <p className="text-sm text-warm-coral">{errors.homeType.message}</p>
                )}

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Year Built (Optional)
                  </label>
                  <input
                    {...register('yearBuilt')}
                    type="text"
                    placeholder="e.g., 2010"
                    className="w-full px-4 py-3 bg-white border-2 border-soft-amber/30 rounded-xl text-charcoal placeholder-warm-gray/50 focus:border-burnt-sienna focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Question 3: Heating System */}
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-soft-amber/30 shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-burnt-sienna to-warm-orange shadow-md flex items-center justify-center flex-shrink-0">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-charcoal mb-1">
                    3. What's your primary heating system?
                  </h2>
                  <p className="text-sm text-warm-gray">
                    Critical for northern climate maintenance
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {heatingOptions.map((option) => (
                    <label
                      key={option.value}
                      className={cn(
                        "relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                        selectedHeating === option.value
                          ? 'border-burnt-sienna bg-burnt-sienna/5'
                          : 'border-soft-amber/30 hover:border-soft-amber/50 hover:bg-soft-amber/5'
                      )}
                    >
                      <input
                        {...register('primaryHeating')}
                        type="radio"
                        value={option.value}
                        className="text-burnt-sienna focus:ring-burnt-sienna"
                      />
                      <div className="font-medium text-charcoal">{option.label}</div>
                    </label>
                  ))}
                </div>
                {errors.primaryHeating && (
                  <p className="text-sm text-warm-coral">{errors.primaryHeating.message}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Question 4: Water Source */}
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-soft-amber/30 shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-burnt-sienna to-warm-orange shadow-md flex items-center justify-center flex-shrink-0">
                  <Droplet className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-charcoal mb-1">
                    4. Where does your water come from?
                  </h2>
                  <p className="text-sm text-warm-gray">
                    Understanding your water source helps us track maintenance
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {waterOptions.map((option) => (
                    <label
                      key={option.value}
                      className={cn(
                        "relative flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                        selectedWater === option.value
                          ? 'border-burnt-sienna bg-burnt-sienna/5'
                          : 'border-soft-amber/30 hover:border-soft-amber/50 hover:bg-soft-amber/5'
                      )}
                    >
                      <input
                        {...register('waterSource')}
                        type="radio"
                        value={option.value}
                        className="mt-1 text-burnt-sienna focus:ring-burnt-sienna"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-charcoal">{option.label}</div>
                        <div className="text-sm text-warm-gray">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.waterSource && (
                  <p className="text-sm text-warm-coral">{errors.waterSource.message}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Question 5: Sewage System */}
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-soft-amber/30 shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-burnt-sienna to-warm-orange shadow-md flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-charcoal mb-1">
                    5. What type of sewage system do you have?
                  </h2>
                  <p className="text-sm text-warm-gray">
                    Important for scheduling maintenance and pump-outs
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sewageOptions.map((option) => (
                    <label
                      key={option.value}
                      className={cn(
                        "relative flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                        selectedSewage === option.value
                          ? 'border-burnt-sienna bg-burnt-sienna/5'
                          : 'border-soft-amber/30 hover:border-soft-amber/50 hover:bg-soft-amber/5'
                      )}
                    >
                      <input
                        {...register('sewageSystem')}
                        type="radio"
                        value={option.value}
                        className="mt-1 text-burnt-sienna focus:ring-burnt-sienna"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-charcoal">{option.label}</div>
                        <div className="text-sm text-warm-gray">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.sewageSystem && (
                  <p className="text-sm text-warm-coral">{errors.sewageSystem.message}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              type="button"
              onClick={handleSkip}
              disabled={isSubmitting}
              variant="outline"
              className="flex-1 text-charcoal border-2 border-soft-amber/30 hover:bg-soft-amber/10 hover:border-soft-amber/50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Skipping...
                </>
              ) : (
                'Skip and Complete Later'
              )}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-burnt-sienna to-warm-orange hover:from-warm-orange hover:to-burnt-sienna text-white shadow-lg hover:shadow-xl transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  Complete Setup
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-center pt-4">
            <p className="text-sm text-warm-gray">
              You can add more details and configure advanced settings in your dashboard after setup.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;
