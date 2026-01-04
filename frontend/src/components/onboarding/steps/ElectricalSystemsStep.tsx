import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectionCard, SelectionGrid } from '../SelectionCard';
import {
  Zap,
  Battery,
  Sun,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const powerSources = [
  {
    id: 'grid',
    icon: Zap,
    title: 'Grid Connected',
    description: 'Utility power only'
  },
  {
    id: 'generator-primary',
    icon: Battery,
    title: 'Generator (Primary)',
    description: 'Generator as main power source'
  },
  {
    id: 'hybrid',
    icon: Zap,
    title: 'Hybrid',
    description: 'Grid + generator backup',
    badge: 'Common'
  },
  {
    id: 'solar',
    icon: Sun,
    title: 'Solar + Battery',
    description: 'Solar panels with battery storage'
  }
];

const generatorTypes = [
  { id: 'portable', title: 'Portable' },
  { id: 'standby', title: 'Standby/Fixed' }
];

const fuelTypes = [
  { id: 'diesel', title: 'Diesel' },
  { id: 'propane', title: 'Propane' },
  { id: 'natural-gas', title: 'Natural Gas' },
  { id: 'gasoline', title: 'Gasoline' }
];

export const ElectricalSystemsStep: React.FC = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const powerSource = watch('powerSource');
  const hasGenerator = watch('hasGenerator');

  return (
    <div className="space-y-8">
      {/* Power Source */}
      <div className="space-y-3">
        <div>
          <Label className="text-wool-cream font-medium text-lg">
            Primary Power Source <span className="text-ember-glow">*</span>
          </Label>
          <p className="text-sm text-honey/80 mt-1">
            How is your home powered?
          </p>
        </div>
        <SelectionGrid columns={2}>
          {powerSources.map((source) => (
            <SelectionCard
              key={source.id}
              icon={source.icon}
              title={source.title}
              description={source.description}
              badge={source.badge}
              selected={powerSource === source.id}
              onClick={() => setValue('powerSource', source.id, { shouldValidate: true })}
            />
          ))}
        </SelectionGrid>
        {errors.powerSource && (
          <p className="text-sm text-brick-red">{String(errors.powerSource.message)}</p>
        )}
      </div>

      {/* Backup Generator */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 rounded-xl bg-warm-stone/30 border-2 border-warm-stone hover:border-honey transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-hearth shadow-glow-sm flex items-center justify-center flex-shrink-0">
              <Battery className="w-5 h-5 text-wool-cream" />
            </div>
            <div>
              <h3 className="font-semibold text-wool-cream">Backup Generator</h3>
              <p className="text-sm text-honey">Do you have a backup generator?</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setValue('hasGenerator', !hasGenerator)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ember-glow focus:ring-offset-2 focus:ring-offset-rich-umber",
              hasGenerator ? "bg-forest-green" : "bg-warm-stone/50"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-wool-cream transition-transform",
                hasGenerator ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>

        {hasGenerator && (
          <div className="pl-4 ml-9 border-l-2 border-honey/30 space-y-4">
            {/* Generator Type */}
            <div className="space-y-2">
              <Label className="text-wool-cream font-medium">Generator Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {generatorTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setValue('generatorType', type.id)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all border-2",
                      watch('generatorType') === type.id
                        ? "bg-forest-green/20 border-forest-green/40 text-northern-lights"
                        : "bg-warm-stone/30 border-warm-stone text-honey hover:border-honey/50"
                    )}
                  >
                    {type.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Fuel Type */}
            <div className="space-y-2">
              <Label className="text-wool-cream font-medium">Fuel Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {fuelTypes.map((fuel) => (
                  <button
                    key={fuel.id}
                    type="button"
                    onClick={() => setValue('generatorFuel', fuel.id)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all border-2",
                      watch('generatorFuel') === fuel.id
                        ? "bg-forest-green/20 border-forest-green/40 text-northern-lights"
                        : "bg-warm-stone/30 border-warm-stone text-honey hover:border-honey/50"
                    )}
                  >
                    {fuel.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Generator Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="generatorBrand" className="text-wool-cream font-medium">
                  Brand/Model
                </Label>
                <Input
                  id="generatorBrand"
                  placeholder="e.g., Honda EU2200i"
                  {...register('generatorBrand')}
                  className="bg-warm-stone/50 border-warm-stone text-wool-cream placeholder:text-honey/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="generatorHours" className="text-wool-cream font-medium">
                  Hours (if known)
                </Label>
                <Input
                  id="generatorHours"
                  type="number"
                  placeholder="e.g., 250"
                  {...register('generatorHours', { valueAsNumber: true })}
                  className="bg-warm-stone/50 border-warm-stone text-wool-cream placeholder:text-honey/50"
                />
              </div>
            </div>

            {/* Automatic Transfer Switch */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-warm-stone/30">
              <span className="text-sm text-wool-cream">Automatic transfer switch?</span>
              <button
                type="button"
                onClick={() => setValue('hasAutoTransfer', !watch('hasAutoTransfer'))}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  watch('hasAutoTransfer') ? "bg-forest-green" : "bg-warm-stone/50"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-wool-cream transition-transform",
                    watch('hasAutoTransfer') ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Electrical Panel */}
      <div className="space-y-3">
        <div>
          <Label className="text-wool-cream font-medium text-lg">
            Electrical Panel (Optional)
          </Label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="panelAmperage" className="text-wool-cream font-medium">
              Service Amperage
            </Label>
            <select
              id="panelAmperage"
              {...register('panelAmperage')}
              className="flex h-12 w-full rounded-xl border-2 border-warm-stone bg-warm-stone/50 px-4 py-3 text-sm text-wool-cream transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-glow"
            >
              <option value="">Select...</option>
              <option value="100" className="bg-rich-umber">100A</option>
              <option value="200" className="bg-rich-umber">200A</option>
              <option value="400" className="bg-rich-umber">400A</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="panelAge" className="text-wool-cream font-medium">
              Panel Age (years)
            </Label>
            <Input
              id="panelAge"
              type="number"
              placeholder="e.g., 10"
              {...register('panelAge', { valueAsNumber: true })}
              className="bg-warm-stone/50 border-warm-stone text-wool-cream placeholder:text-honey/50"
            />
          </div>
        </div>
      </div>

      {/* Information Box */}
      <div className="p-4 rounded-xl bg-sunset-amber/10 border border-sunset-amber/30">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-sunset-amber mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-wool-cream mb-1">Generator Maintenance</h4>
            <p className="text-sm text-honey/90">
              Regular generator exercise and oil changes are essential for reliability during power outages.
              We'll help you maintain a proper schedule based on usage and manufacturer recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectricalSystemsStep;
