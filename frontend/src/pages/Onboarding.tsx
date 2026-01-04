import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { OnboardingWizard, WizardStep } from '@/components/onboarding/OnboardingWizard';
import { HomeBasicsStep } from '@/components/onboarding/steps/HomeBasicsStep';
import { HeatingSystemsStep } from '@/components/onboarding/steps/HeatingSystemsStep';
import { WaterSystemsStep } from '@/components/onboarding/steps/WaterSystemsStep';
import { SewageSystemsStep } from '@/components/onboarding/steps/SewageSystemsStep';
import { ElectricalSystemsStep } from '@/components/onboarding/steps/ElectricalSystemsStep';
import { AdditionalSystemsStep } from '@/components/onboarding/steps/AdditionalSystemsStep';
import { PreferencesStep } from '@/components/onboarding/steps/PreferencesStep';
import { ReviewStep } from '@/components/onboarding/steps/ReviewStep';
import {
  Home,
  Flame,
  Droplet,
  Trash2,
  Zap,
  Settings,
  Bell,
  CheckCircle
} from 'lucide-react';

// Comprehensive validation schema
const onboardingSchema = z.object({
  // Home Basics - Required fields
  homeName: z.string().min(1, 'Home name is required'),
  homeType: z.enum(['modular', 'stick-built', 'log', 'mobile', 'other'], {
    required_error: 'Please select a home type'
  }),
  community: z.string().min(1, 'Community is required'),
  territory: z.enum(['NWT', 'Nunavut', 'Yukon', 'Other'], {
    required_error: 'Please select a territory'
  }),
  yearBuilt: z.number().min(1800).max(new Date().getFullYear() + 1).optional().or(z.nan()),
  bedrooms: z.number().min(0).max(20).optional().or(z.nan()),
  bathrooms: z.number().min(0).max(10).optional().or(z.nan()),

  // Heating Systems - Required
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
    required_error: 'Please select a primary heating system'
  }),
  heatingAge: z.number().optional().or(z.nan()),
  heatingBrand: z.string().optional(),
  secondaryHeating: z.array(z.string()).optional(),
  hasHRV: z.boolean().optional(),
  hrvBrand: z.string().optional(),
  hrvAge: z.number().optional().or(z.nan()),
  hasHeatTrace: z.boolean().optional(),
  heatTraceLocations: z.array(z.string()).optional(),

  // Water Systems - Required
  waterSource: z.enum(['municipal', 'well', 'trucked', 'combination'], {
    required_error: 'Please select a water source'
  }),
  tankCapacity: z.number().optional().or(z.nan()),
  refillFrequency: z.string().optional(),
  refillCost: z.number().optional().or(z.nan()),
  enableWaterReminders: z.boolean().optional(),
  pumpType: z.string().optional(),
  wellDepth: z.number().optional().or(z.nan()),
  hotWaterSystem: z.enum(['tank', 'tankless', 'boiler-integrated'], {
    required_error: 'Please select a hot water system'
  }),
  tankSize: z.number().optional().or(z.nan()),
  tankFuel: z.string().optional(),
  tankAge: z.number().optional().or(z.nan()),
  hasTreatment: z.boolean().optional(),
  treatmentSystems: z.array(z.string()).optional(),

  // Sewage Systems - Required
  sewageSystem: z.enum(['municipal', 'septic', 'holding-tank', 'combination'], {
    required_error: 'Please select a sewage system'
  }),
  septicTankSize: z.number().optional().or(z.nan()),
  septicLastPumped: z.string().optional(),
  septicFrequency: z.string().optional(),
  septicCost: z.number().optional().or(z.nan()),
  holdingTankSize: z.number().optional().or(z.nan()),
  holdingTankFrequency: z.string().optional(),
  holdingTankCost: z.number().optional().or(z.nan()),

  // Electrical Systems - Required
  powerSource: z.enum(['grid', 'generator-primary', 'hybrid', 'solar'], {
    required_error: 'Please select a power source'
  }),
  hasGenerator: z.boolean().optional(),
  generatorType: z.string().optional(),
  generatorFuel: z.string().optional(),
  generatorBrand: z.string().optional(),
  generatorHours: z.number().optional().or(z.nan()),
  hasAutoTransfer: z.boolean().optional(),
  panelAmperage: z.string().optional(),
  panelAge: z.number().optional().or(z.nan()),

  // Additional Systems - All optional
  appliances: z.array(z.string()).optional(),
  specializedSystems: z.array(z.string()).optional(),
  fuelStorage: z.array(z.string()).optional(),

  // Preferences - Optional
  reminderMethods: z.array(z.string()).optional(),
  reminderTiming: z.string().optional(),
  autoGenerateChecklists: z.boolean().optional(),
  diyLevel: z.string().optional(),
  interestedInProviders: z.boolean().optional(),
  providerTypes: z.array(z.string()).optional()
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

// Define all wizard steps
const wizardSteps: WizardStep[] = [
  {
    id: 'home-basics',
    title: 'Home Basics',
    subtitle: 'Tell us about your property',
    icon: Home,
    component: <HomeBasicsStep />
  },
  {
    id: 'heating',
    title: 'Heating Systems',
    subtitle: 'Critical for northern climates',
    icon: Flame,
    component: <HeatingSystemsStep />
  },
  {
    id: 'water',
    title: 'Water Systems',
    subtitle: 'Configure your water setup',
    icon: Droplet,
    component: <WaterSystemsStep />
  },
  {
    id: 'sewage',
    title: 'Sewage & Waste',
    subtitle: 'Septic, holding tank, or municipal',
    icon: Trash2,
    component: <SewageSystemsStep />
  },
  {
    id: 'electrical',
    title: 'Electrical & Power',
    subtitle: 'Grid, generator, or hybrid',
    icon: Zap,
    component: <ElectricalSystemsStep />
  },
  {
    id: 'additional',
    title: 'Additional Systems',
    subtitle: 'Appliances and specialized equipment',
    icon: Settings,
    optional: true,
    component: <AdditionalSystemsStep />
  },
  {
    id: 'preferences',
    title: 'Preferences',
    subtitle: 'Customize your experience',
    icon: Bell,
    component: <PreferencesStep />
  },
  {
    id: 'review',
    title: 'Review & Confirm',
    subtitle: 'Check your setup before finishing',
    icon: CheckCircle,
    component: <ReviewStep />
  }
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onBlur',
    defaultValues: {
      homeName: '',
      homeType: undefined,
      community: '',
      territory: undefined,
      secondaryHeating: [],
      hasHRV: false,
      hasHeatTrace: false,
      heatTraceLocations: [],
      enableWaterReminders: false,
      hasTreatment: false,
      treatmentSystems: [],
      hasGenerator: false,
      hasAutoTransfer: false,
      appliances: [],
      specializedSystems: [],
      fuelStorage: [],
      reminderMethods: [],
      autoGenerateChecklists: true,
      interestedInProviders: false,
      providerTypes: []
    }
  });

  const handleSubmit = async (data: OnboardingFormData) => {
    try {
      setIsSubmitting(true);
      console.log('Onboarding data:', data);

      // TODO: Send data to backend API
      // const response = await fetch('/api/v1/onboarding/complete', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   credentials: 'include',
      //   body: JSON.stringify(data)
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Failed to complete onboarding');
      // }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success message
      alert('🎉 Setup complete! Welcome to FurnaceLog.');

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('There was an error saving your setup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveProgress = async (data: Partial<OnboardingFormData>) => {
    try {
      console.log('Saving progress:', data);

      // TODO: Save progress to backend
      // await fetch('/api/v1/onboarding/progress', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   credentials: 'include',
      //   body: JSON.stringify(data)
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Show success message
      alert('✓ Progress saved! You can continue later.');
    } catch (error) {
      console.error('Error saving progress:', error);
      alert('Failed to save progress. Please try again.');
    }
  };

  const handleSkip = () => {
    if (window.confirm('Are you sure you want to skip the setup? You can complete it later from your dashboard.')) {
      navigate('/dashboard');
    }
  };

  return (
    <OnboardingWizard
      steps={wizardSteps}
      methods={methods}
      onSubmit={handleSubmit}
      onSave={handleSaveProgress}
      onSkip={handleSkip}
      isSubmitting={isSubmitting}
      title="Welcome to FurnaceLog"
      subtitle="Let's personalize your home maintenance experience"
    />
  );
};

export default OnboardingPage;
