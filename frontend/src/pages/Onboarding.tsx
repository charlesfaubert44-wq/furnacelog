import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { OnboardingWizard, WizardStep } from '@/components/onboarding/OnboardingWizard';
import { HomeBasicsStep } from '@/components/onboarding/steps/HomeBasicsStep';
import { HeatingSystemsStep } from '@/components/onboarding/steps/HeatingSystemsStep';
import { WaterSystemsStep } from '@/components/onboarding/steps/WaterSystemsStep';
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

// Validation schema for the onboarding form
const onboardingSchema = z.object({
  // Home Basics
  homeName: z.string().min(1, 'Home name is required'),
  homeType: z.enum(['modular', 'stick-built', 'log', 'mobile', 'other']),
  community: z.string().min(1, 'Community is required'),
  territory: z.enum(['NWT', 'Nunavut', 'Yukon', 'Other']),
  yearBuilt: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),

  // Heating Systems
  primaryHeating: z.enum([
    'oil-furnace',
    'propane-furnace',
    'natural-gas',
    'electric-furnace',
    'boiler',
    'wood-stove',
    'pellet-stove',
    'heat-pump'
  ]),
  heatingAge: z.number().optional(),
  heatingBrand: z.string().optional(),
  secondaryHeating: z.array(z.string()).optional(),
  hasHRV: z.boolean().optional(),
  hrvBrand: z.string().optional(),
  hrvAge: z.number().optional(),
  hasHeatTrace: z.boolean().optional(),
  heatTraceLocations: z.array(z.string()).optional(),

  // Water Systems
  waterSource: z.enum(['municipal', 'well', 'trucked', 'combination']),
  tankCapacity: z.number().optional(),
  refillFrequency: z.string().optional(),
  refillCost: z.number().optional(),
  enableWaterReminders: z.boolean().optional(),
  pumpType: z.string().optional(),
  wellDepth: z.number().optional(),
  hotWaterSystem: z.enum(['tank', 'tankless', 'boiler-integrated']),
  tankSize: z.number().optional(),
  tankFuel: z.string().optional(),
  tankAge: z.number().optional(),
  hasTreatment: z.boolean().optional(),
  treatmentSystems: z.array(z.string()).optional(),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

// Define wizard steps
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
  // Additional steps would go here:
  // {
  //   id: 'sewage',
  //   title: 'Sewage & Waste',
  //   subtitle: 'Septic, holding tank, or municipal',
  //   icon: Trash2,
  //   component: <SewageSystemsStep />
  // },
  // {
  //   id: 'electrical',
  //   title: 'Electrical & Power',
  //   subtitle: 'Grid, generator, or hybrid',
  //   icon: Zap,
  //   component: <ElectricalSystemsStep />
  // },
  // {
  //   id: 'additional',
  //   title: 'Additional Systems',
  //   subtitle: 'Appliances and specialized equipment',
  //   icon: Settings,
  //   optional: true,
  //   component: <AdditionalSystemsStep />
  // },
  // {
  //   id: 'preferences',
  //   title: 'Preferences',
  //   subtitle: 'Customize your experience',
  //   icon: Bell,
  //   component: <PreferencesStep />
  // },
  // {
  //   id: 'review',
  //   title: 'Review & Confirm',
  //   subtitle: 'Check your setup before finishing',
  //   icon: CheckCircle,
  //   component: <ReviewStep />
  // }
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  const methods = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
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
      treatmentSystems: []
    }
  });

  const handleSubmit = async (data: OnboardingFormData) => {
    try {
      console.log('Onboarding data:', data);

      // TODO: Send data to backend API
      // await onboardingService.complete(data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      alert('Setup complete! Welcome to FurnaceLog.');

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('There was an error saving your setup. Please try again.');
    }
  };

  const handleSaveProgress = async (data: Partial<OnboardingFormData>) => {
    try {
      console.log('Saving progress:', data);

      // TODO: Save progress to backend
      // await onboardingService.saveProgress(data);

      // Show success message
      alert('Progress saved! You can continue later.');
    } catch (error) {
      console.error('Error saving progress:', error);
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
      title="Welcome to FurnaceLog"
      subtitle="Let's personalize your home maintenance experience"
    />
  );
};

export default OnboardingPage;
