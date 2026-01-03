import React, { useState } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  title: string;
  description?: string;
  component: React.ReactNode;
}

interface MultiStepFormProps {
  steps: Step[];
  methods: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  submitLabel?: string;
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  steps,
  methods,
  onSubmit,
  submitLabel = 'Submit',
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const nextStep = () => {
    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all',
                    index <= currentStep
                      ? 'bg-tech-blue-600 text-white'
                      : 'bg-aluminum-200 text-aluminum-500'
                  )}
                >
                  {index + 1}
                </div>
                <span className="mt-2 text-micro text-aluminum-600 hidden md:block">
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-1 flex-1 mx-2 transition-all',
                    index < currentStep
                      ? 'bg-tech-blue-600'
                      : 'bg-aluminum-200'
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Content */}
        <Card elevation="elevated">
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            {steps[currentStep].description && (
              <p className="text-small text-aluminum-500">
                {steps[currentStep].description}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {steps[currentStep].component}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={isFirstStep}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            {isLastStep ? (
              <Button type="submit" className="gap-2">
                {submitLabel}
              </Button>
            ) : (
              <Button type="button" onClick={nextStep} className="gap-2">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  );
};
