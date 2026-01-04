import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Home,
  Flame,
  Droplet,
  Trash2,
  Zap,
  Settings,
  Bell,
  Check,
  Edit2,
  AlertCircle
} from 'lucide-react';

interface ReviewSectionProps {
  icon: React.ElementType;
  title: string;
  items: Array<{ label: string; value: string | number | boolean | undefined }>;
  onEdit?: () => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ icon: Icon, title, items, onEdit }) => {
  const validItems = items.filter(item => item.value !== undefined && item.value !== '' && item.value !== null);

  if (validItems.length === 0) {
    return null;
  }

  return (
    <div className="p-5 rounded-xl bg-warm-stone/20 border-2 border-warm-stone">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-hearth shadow-glow-sm flex items-center justify-center">
            <Icon className="w-5 h-5 text-wool-cream" />
          </div>
          <h3 className="font-semibold text-lg text-wool-cream">{title}</h3>
        </div>
        {onEdit && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="text-ember-glow hover:text-hearth-fire"
          >
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </Button>
        )}
      </div>
      <dl className="space-y-2">
        {validItems.map((item, index) => (
          <div key={index} className="flex justify-between py-2 border-b border-warm-stone/30 last:border-0">
            <dt className="text-sm text-honey">{item.label}</dt>
            <dd className="text-sm font-medium text-wool-cream text-right">
              {typeof item.value === 'boolean' ? (item.value ? 'Yes' : 'No') : item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export const ReviewStep: React.FC = () => {
  const { watch } = useFormContext();

  const homeBasics = watch();

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="p-4 rounded-xl bg-forest-green/10 border border-forest-green/30">
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-northern-lights mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-wool-cream mb-1">Almost Done!</h4>
            <p className="text-sm text-honey/90">
              Review your home configuration below. You can edit any section if needed.
            </p>
          </div>
        </div>
      </div>

      {/* Home Basics */}
      <ReviewSection
        icon={Home}
        title="Home Basics"
        items={[
          { label: 'Home Name', value: homeBasics.homeName },
          { label: 'Home Type', value: homeBasics.homeType?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) },
          { label: 'Community', value: homeBasics.community },
          { label: 'Territory', value: homeBasics.territory },
          { label: 'Year Built', value: homeBasics.yearBuilt },
          { label: 'Bedrooms', value: homeBasics.bedrooms },
          { label: 'Bathrooms', value: homeBasics.bathrooms }
        ]}
      />

      {/* Heating Systems */}
      <ReviewSection
        icon={Flame}
        title="Heating Systems"
        items={[
          { label: 'Primary Heating', value: homeBasics.primaryHeating?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) },
          { label: 'System Age', value: homeBasics.heatingAge ? `${homeBasics.heatingAge} years` : undefined },
          { label: 'Brand', value: homeBasics.heatingBrand },
          { label: 'Secondary Heating', value: homeBasics.secondaryHeating?.length > 0 ? `${homeBasics.secondaryHeating.length} systems` : undefined },
          { label: 'HRV System', value: homeBasics.hasHRV },
          { label: 'HRV Brand', value: homeBasics.hrvBrand },
          { label: 'Heat Trace', value: homeBasics.hasHeatTrace },
          { label: 'Heat Trace Locations', value: homeBasics.heatTraceLocations?.length > 0 ? `${homeBasics.heatTraceLocations.length} locations` : undefined }
        ]}
      />

      {/* Water Systems */}
      <ReviewSection
        icon={Droplet}
        title="Water Systems"
        items={[
          { label: 'Water Source', value: homeBasics.waterSource?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) },
          { label: 'Tank Capacity', value: homeBasics.tankCapacity ? `${homeBasics.tankCapacity} gal` : undefined },
          { label: 'Refill Frequency', value: homeBasics.refillFrequency },
          { label: 'Hot Water System', value: homeBasics.hotWaterSystem?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) },
          { label: 'Tank Size', value: homeBasics.tankSize ? `${homeBasics.tankSize} gal` : undefined },
          { label: 'Tank Fuel', value: homeBasics.tankFuel },
          { label: 'Water Treatment', value: homeBasics.hasTreatment },
          { label: 'Treatment Systems', value: homeBasics.treatmentSystems?.length > 0 ? `${homeBasics.treatmentSystems.length} systems` : undefined }
        ]}
      />

      {/* Sewage Systems */}
      <ReviewSection
        icon={Trash2}
        title="Sewage & Waste"
        items={[
          { label: 'Sewage System', value: homeBasics.sewageSystem?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) },
          { label: 'Septic Tank Size', value: homeBasics.septicTankSize ? `${homeBasics.septicTankSize} gal` : undefined },
          { label: 'Pump-Out Frequency', value: homeBasics.septicFrequency },
          { label: 'Holding Tank Size', value: homeBasics.holdingTankSize ? `${homeBasics.holdingTankSize} gal` : undefined },
          { label: 'Holding Tank Frequency', value: homeBasics.holdingTankFrequency }
        ]}
      />

      {/* Electrical Systems */}
      <ReviewSection
        icon={Zap}
        title="Electrical & Power"
        items={[
          { label: 'Power Source', value: homeBasics.powerSource?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) },
          { label: 'Backup Generator', value: homeBasics.hasGenerator },
          { label: 'Generator Type', value: homeBasics.generatorType },
          { label: 'Generator Fuel', value: homeBasics.generatorFuel },
          { label: 'Generator Brand', value: homeBasics.generatorBrand },
          { label: 'Auto Transfer Switch', value: homeBasics.hasAutoTransfer },
          { label: 'Panel Amperage', value: homeBasics.panelAmperage ? `${homeBasics.panelAmperage}A` : undefined }
        ]}
      />

      {/* Additional Systems */}
      <ReviewSection
        icon={Settings}
        title="Additional Systems"
        items={[
          { label: 'Appliances', value: homeBasics.appliances?.length > 0 ? `${homeBasics.appliances.length} tracked` : undefined },
          { label: 'Specialized Systems', value: homeBasics.specializedSystems?.length > 0 ? `${homeBasics.specializedSystems.length} systems` : undefined },
          { label: 'Fuel Storage', value: homeBasics.fuelStorage?.length > 0 ? `${homeBasics.fuelStorage.length} types` : undefined }
        ]}
      />

      {/* Preferences */}
      <ReviewSection
        icon={Bell}
        title="Preferences"
        items={[
          { label: 'Reminder Methods', value: homeBasics.reminderMethods?.length > 0 ? homeBasics.reminderMethods.length : undefined },
          { label: 'Reminder Timing', value: homeBasics.reminderTiming?.replace('-', ' ') },
          { label: 'Auto Checklists', value: homeBasics.autoGenerateChecklists },
          { label: 'DIY Level', value: homeBasics.diyLevel?.replace('-', ' ') },
          { label: 'Service Providers', value: homeBasics.interestedInProviders },
          { label: 'Provider Types', value: homeBasics.providerTypes?.length > 0 ? `${homeBasics.providerTypes.length} selected` : undefined }
        ]}
      />

      {/* What's Next Info */}
      <div className="p-4 rounded-xl bg-sunset-amber/10 border border-sunset-amber/30">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-sunset-amber mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-wool-cream mb-2">What happens next?</h4>
            <ul className="space-y-1 text-sm text-honey/90">
              <li className="flex items-start gap-2">
                <span className="text-ember-glow mt-1">•</span>
                <span>Your personalized dashboard will show only relevant systems and tasks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ember-glow mt-1">•</span>
                <span>Maintenance schedules will be automatically generated based on your configuration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ember-glow mt-1">•</span>
                <span>You'll receive reminders according to your preferred schedule</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ember-glow mt-1">•</span>
                <span>You can always update these settings from your dashboard</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
