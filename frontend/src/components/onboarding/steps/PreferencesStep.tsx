import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { SelectionCard, SelectionGrid, SelectionListItem, SelectionList } from '../SelectionCard';
import {
  Mail,
  Bell,
  Calendar,
  Wrench,
  Users,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

const reminderMethods = [
  { id: 'email', icon: Mail, title: 'Email Notifications', description: 'Send reminders via email' },
  { id: 'in-app', icon: Bell, title: 'In-App Notifications', description: 'Dashboard alerts and badges' },
  { id: 'weekly-digest', icon: Calendar, title: 'Weekly Digest', description: 'Summary of upcoming tasks' },
  { id: 'monthly-summary', icon: Calendar, title: 'Monthly Summary', description: 'Monthly maintenance overview' }
];

const reminderTimings = [
  { id: '1-week', title: '1 Week Before', description: 'Get notified 7 days in advance' },
  { id: '2-weeks', title: '2 Weeks Before', description: 'Get notified 14 days in advance' },
  { id: '1-month', title: '1 Month Before', description: 'Get notified 30 days in advance' },
  { id: 'no-reminders', title: 'No Auto-Reminders', description: 'I\'ll check manually' }
];

const diyLevels = [
  { id: 'all-diy', icon: Wrench, title: 'I do all maintenance myself', description: 'Handle all tasks independently' },
  { id: 'basic-diy', icon: Wrench, title: 'Basic maintenance, hire for complex', description: 'DIY simple tasks, professional for technical work' },
  { id: 'hire-most', icon: Users, title: 'I hire professionals for most work', description: 'Prefer professional services' },
  { id: 'learning', icon: Info, title: 'I\'m learning and want guidance', description: 'Need help learning maintenance skills' }
];

const serviceProviderTypes = [
  { id: 'hvac', title: 'Furnace/HVAC Technicians' },
  { id: 'plumber', title: 'Plumbers' },
  { id: 'electrician', title: 'Electricians' },
  { id: 'septic', title: 'Septic/Tank Pump-Out' },
  { id: 'fuel-delivery', title: 'Fuel Delivery' },
  { id: 'general', title: 'General Handyman' }
];

export const PreferencesStep: React.FC = () => {
  const { watch, setValue } = useFormContext();
  const selectedReminderMethods = watch('reminderMethods') || [];
  const reminderTiming = watch('reminderTiming');
  const diyLevel = watch('diyLevel');
  const autoGenerateChecklists = watch('autoGenerateChecklists');
  const interestedInProviders = watch('interestedInProviders');
  const selectedProviderTypes = watch('providerTypes') || [];

  const toggleReminderMethod = (id: string) => {
    const current = selectedReminderMethods || [];
    if (current.includes(id)) {
      setValue('reminderMethods', current.filter((item: string) => item !== id));
    } else {
      setValue('reminderMethods', [...current, id]);
    }
  };

  const toggleProviderType = (id: string) => {
    const current = selectedProviderTypes || [];
    if (current.includes(id)) {
      setValue('providerTypes', current.filter((item: string) => item !== id));
    } else {
      setValue('providerTypes', [...current, id]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Reminder Methods */}
      <div className="space-y-3">
        <div>
          <Label className="text-wool-cream font-medium text-lg">
            How would you like to receive reminders?
          </Label>
          <p className="text-sm text-honey/80 mt-1">
            Select all that apply
          </p>
        </div>
        <SelectionList>
          {reminderMethods.map((method) => (
            <SelectionListItem
              key={method.id}
              icon={method.icon}
              title={method.title}
              description={method.description}
              selected={selectedReminderMethods.includes(method.id)}
              onClick={() => toggleReminderMethod(method.id)}
            />
          ))}
        </SelectionList>
      </div>

      {/* Reminder Timing */}
      <div className="space-y-3">
        <div>
          <Label className="text-wool-cream font-medium text-lg">
            When should we remind you?
          </Label>
          <p className="text-sm text-honey/80 mt-1">
            Choose your preferred advance notice
          </p>
        </div>
        <SelectionGrid columns={2}>
          {reminderTimings.map((timing) => (
            <button
              key={timing.id}
              type="button"
              onClick={() => setValue('reminderTiming', timing.id, { shouldValidate: true })}
              className={cn(
                "relative w-full p-4 rounded-xl border-2 transition-all duration-300 text-left",
                "focus:outline-none focus:ring-2 focus:ring-ember-glow focus:ring-offset-2 focus:ring-offset-rich-umber",
                reminderTiming === timing.id && "bg-gradient-hearth border-hearth-fire shadow-glow-md",
                reminderTiming !== timing.id && "bg-warm-stone/30 border-warm-stone hover:border-honey hover:bg-warm-stone/50"
              )}
            >
              <h3 className={cn(
                "font-semibold text-base mb-1",
                reminderTiming === timing.id ? "text-wool-cream" : "text-wool-cream/90"
              )}>
                {timing.title}
              </h3>
              <p className={cn(
                "text-sm",
                reminderTiming === timing.id ? "text-wool-cream/80" : "text-honey"
              )}>
                {timing.description}
              </p>
            </button>
          ))}
        </SelectionGrid>
      </div>

      {/* Auto-Generate Seasonal Checklists */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 rounded-xl bg-warm-stone/30 border-2 border-warm-stone hover:border-honey transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-hearth shadow-glow-sm flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-wool-cream" />
            </div>
            <div>
              <h3 className="font-semibold text-wool-cream">Auto-Generate Seasonal Checklists</h3>
              <p className="text-sm text-honey">Automatically create fall/winter/spring/summer tasks</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setValue('autoGenerateChecklists', !autoGenerateChecklists)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ember-glow focus:ring-offset-2 focus:ring-offset-rich-umber",
              autoGenerateChecklists ? "bg-forest-green" : "bg-warm-stone/50"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-wool-cream transition-transform",
                autoGenerateChecklists ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>
      </div>

      {/* DIY Level */}
      <div className="space-y-3">
        <div>
          <Label className="text-wool-cream font-medium text-lg">
            Your Maintenance Approach
          </Label>
          <p className="text-sm text-honey/80 mt-1">
            Helps us provide appropriate guidance
          </p>
        </div>
        <SelectionGrid columns={2}>
          {diyLevels.map((level) => (
            <SelectionCard
              key={level.id}
              icon={level.icon}
              title={level.title}
              description={level.description}
              selected={diyLevel === level.id}
              onClick={() => setValue('diyLevel', level.id)}
            />
          ))}
        </SelectionGrid>
      </div>

      {/* Service Providers Interest */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 rounded-xl bg-warm-stone/30 border-2 border-warm-stone hover:border-honey transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-hearth shadow-glow-sm flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-wool-cream" />
            </div>
            <div>
              <h3 className="font-semibold text-wool-cream">Connect with Local Service Providers</h3>
              <p className="text-sm text-honey">Find qualified professionals in your community</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setValue('interestedInProviders', !interestedInProviders)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ember-glow focus:ring-offset-2 focus:ring-offset-rich-umber",
              interestedInProviders ? "bg-forest-green" : "bg-warm-stone/50"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-wool-cream transition-transform",
                interestedInProviders ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>

        {interestedInProviders && (
          <div className="pl-4 ml-9 border-l-2 border-honey/30 space-y-2">
            <Label className="text-wool-cream font-medium">Types of services needed</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {serviceProviderTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => toggleProviderType(type.id)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all text-left border-2",
                    selectedProviderTypes.includes(type.id)
                      ? "bg-forest-green/20 border-forest-green/40 text-northern-lights"
                      : "bg-warm-stone/30 border-warm-stone text-honey hover:border-honey/50"
                  )}
                >
                  {type.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreferencesStep;
