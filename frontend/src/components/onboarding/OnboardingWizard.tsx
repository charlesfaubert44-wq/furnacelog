import React, { useState } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Save,
  X,
  Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WizardStep {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  component: React.ReactNode;
  optional?: boolean;
}

interface OnboardingWizardProps {
  steps: WizardStep[];
  methods: UseFormReturn<any>;
  onSubmit: (data: any) => void | Promise<void>;
  onSave?: (data: any) => void | Promise<void>;
  onSkip?: () => void;
  title?: string;
  subtitle?: string;
  isSubmitting?: boolean;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  steps,
  methods,
  onSubmit,
  onSave,
  onSkip,
  title = "Welcome to FurnaceLog",
  subtitle = "Let's personalize your home maintenance experience",
  isSubmitting = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = async () => {
    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex <= currentStep || completedSteps.includes(stepIndex - 1)) {
      setCurrentStep(stepIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveProgress = async () => {
    if (onSave) {
      const data = methods.getValues();
      await onSave(data);
    }
  };

  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gradient-to-br from-warm-white via-cream to-warm-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div
            className="text-center mb-8 animate-fade-slide-up"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-burnt-sienna to-warm-orange shadow-lg mb-4">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-charcoal mb-2">
              {title}
            </h1>
            <p className="text-lg text-warm-gray">
              {subtitle}
            </p>
          </div>

          {/* Progress Bar */}
          <div
            className="mb-8 animate-scale-in"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="relative h-3 bg-soft-amber/20 rounded-full overflow-hidden border border-soft-amber/30">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-burnt-sienna to-warm-orange shadow-lg transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-3 px-1">
              <span className="text-xs font-medium text-warm-gray">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-xs font-medium text-burnt-sienna">
                {Math.round(progress)}% Complete
              </span>
            </div>
          </div>

          {/* Step Navigation Pills */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max pb-2">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = completedSteps.includes(index);
                const isAccessible = index <= currentStep || isCompleted;

                return (
                  <React.Fragment key={step.id}>
                    <button
                      type="button"
                      onClick={() => goToStep(index)}
                      disabled={!isAccessible}
                      className={cn(
                        "relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300",
                        "disabled:cursor-not-allowed disabled:opacity-40",
                        isActive && "bg-gradient-to-r from-burnt-sienna to-warm-orange text-white shadow-lg scale-105",
                        !isActive && isCompleted && "bg-sage/20 text-sage border-2 border-sage/30 hover:bg-sage/30",
                        !isActive && !isCompleted && isAccessible && "bg-soft-amber/10 text-charcoal hover:bg-soft-amber/20 border border-soft-amber/30",
                        !isAccessible && "bg-warm-gray/10 text-warm-gray/40 border border-warm-gray/20"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center w-6 h-6 rounded-full transition-all",
                        isActive && "bg-white/20",
                        isCompleted && "bg-sage"
                      )}>
                        {isCompleted ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : (
                          <Icon className="w-4 h-4" />
                        )}
                      </div>
                      <span className="hidden sm:inline whitespace-nowrap">
                        {step.title}
                      </span>
                      {step.optional && (
                        <span className="text-xs opacity-70">(optional)</span>
                      )}
                    </button>
                    {index < steps.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-warm-gray/40 flex-shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div
            key={currentStep}
            className="animate-fade-slide-up"
          >
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Card className="bg-white/95 backdrop-blur-sm border-2 border-soft-amber/30 shadow-xl overflow-hidden">
                  {/* Card Header */}
                  <div className="relative px-6 sm:px-8 pt-6 sm:pt-8 pb-4">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-warm-orange/5 to-burnt-sienna/5 blur-3xl" />
                    <div className="relative flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-burnt-sienna to-warm-orange shadow-lg flex items-center justify-center">
                          <StepIcon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-2xl sm:text-3xl font-bold text-charcoal mb-1">
                          {currentStepData.title}
                        </h2>
                        {currentStepData.subtitle && (
                          <p className="text-warm-gray text-sm sm:text-base">
                            {currentStepData.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="px-6 sm:px-8 py-6">
                    {currentStepData.component}
                  </div>

                  {/* Card Footer */}
                  <div className="bg-cream/30 px-6 sm:px-8 py-4 sm:py-6 border-t border-soft-amber/20">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      {/* Left side actions */}
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={prevStep}
                          disabled={isFirstStep || isSubmitting}
                          className="flex-1 sm:flex-initial"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span className="hidden sm:inline">Previous</span>
                        </Button>

                        {onSave && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={handleSaveProgress}
                            disabled={isSubmitting}
                            className="flex-1 sm:flex-initial text-charcoal hover:text-burnt-sienna"
                          >
                            <Save className="w-4 h-4" />
                            <span className="hidden sm:inline">Save</span>
                          </Button>
                        )}
                      </div>

                      {/* Right side actions */}
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {onSkip && currentStepData.optional && !isLastStep && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={onSkip}
                            disabled={isSubmitting}
                            className="flex-1 sm:flex-initial text-charcoal hover:text-burnt-sienna"
                          >
                            Skip
                          </Button>
                        )}

                        {isLastStep ? (
                          <Button
                            type="submit"
                            variant="default"
                            disabled={isSubmitting}
                            className="flex-1 sm:flex-initial min-w-[140px] bg-gradient-to-r from-burnt-sienna to-warm-orange hover:from-warm-orange hover:to-burnt-sienna text-white"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Check className="w-4 h-4" />
                                Complete Setup
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="default"
                            onClick={nextStep}
                            disabled={isSubmitting}
                            className="flex-1 sm:flex-initial min-w-[120px] bg-gradient-to-r from-burnt-sienna to-warm-orange hover:from-warm-orange hover:to-burnt-sienna text-white"
                          >
                            Continue
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Cancel option */}
                    {onSkip && !isLastStep && (
                      <div className="mt-4 text-center">
                        <button
                          type="button"
                          onClick={onSkip}
                          disabled={isSubmitting}
                          className="text-sm text-warm-gray hover:text-burnt-sienna transition-colors inline-flex items-center gap-1 disabled:opacity-50"
                        >
                          <X className="w-3 h-3" />
                          I'll complete this later
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              </form>
            </div>

          {/* Help Text */}
          <div
            className="mt-6 text-center animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            <p className="text-sm text-warm-gray">
              Need help? Visit our{' '}
              <a href="/support" className="text-burnt-sienna hover:text-warm-orange underline font-medium transition-colors">
                support center
              </a>
            </p>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default OnboardingWizard;
