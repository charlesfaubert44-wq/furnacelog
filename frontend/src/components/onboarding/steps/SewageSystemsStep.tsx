import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectionCard, SelectionGrid } from '../SelectionCard';
import {
  Trash2,
  Droplets,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';

const sewageSystems = [
  {
    id: 'municipal',
    icon: Droplets,
    title: 'Municipal Sewer',
    description: 'Connected to city sewage system'
  },
  {
    id: 'septic',
    icon: TrendingDown,
    title: 'Septic Tank',
    description: 'Septic tank with drain field'
  },
  {
    id: 'holding-tank',
    icon: Trash2,
    title: 'Holding Tank',
    description: 'Pump-out required',
    badge: 'Northern Common'
  },
  {
    id: 'combination',
    icon: Droplets,
    title: 'Combination',
    description: 'Multiple systems'
  }
];

export const SewageSystemsStep: React.FC = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const sewageSystem = watch('sewageSystem');

  return (
    <div className="space-y-8">
      {/* Sewage System Type */}
      <div className="space-y-3">
        <div>
          <Label className="text-wool-cream font-medium text-lg">
            Sewage System <span className="text-ember-glow">*</span>
          </Label>
          <p className="text-sm text-honey/80 mt-1">
            How is wastewater managed at your home?
          </p>
        </div>
        <SelectionGrid columns={2}>
          {sewageSystems.map((system) => (
            <SelectionCard
              key={system.id}
              icon={system.icon}
              title={system.title}
              description={system.description}
              badge={system.badge}
              selected={sewageSystem === system.id}
              onClick={() => setValue('sewageSystem', system.id, { shouldValidate: true })}
            />
          ))}
        </SelectionGrid>
        {errors.sewageSystem && (
          <p className="text-sm text-brick-red">{String(errors.sewageSystem.message)}</p>
        )}
      </div>

      {/* Septic Tank Details */}
      {sewageSystem === 'septic' && (
        <div className="p-5 rounded-xl bg-slate-blue/10 border-2 border-slate-blue/30 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-winter-sky" />
            <h3 className="font-semibold text-wool-cream">Septic System Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="septicTankSize" className="text-wool-cream font-medium">
                Tank Size (gallons)
              </Label>
              <Input
                id="septicTankSize"
                type="number"
                placeholder="e.g., 1000"
                {...register('septicTankSize', { valueAsNumber: true })}
                className="bg-warm-stone/50 border-warm-stone text-wool-cream placeholder:text-honey/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="septicLastPumped" className="text-wool-cream font-medium">
                Last Pumped
              </Label>
              <Input
                id="septicLastPumped"
                type="date"
                {...register('septicLastPumped')}
                className="bg-warm-stone/50 border-warm-stone text-wool-cream"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="septicFrequency" className="text-wool-cream font-medium">
                Typical Pump-Out Frequency
              </Label>
              <select
                id="septicFrequency"
                {...register('septicFrequency')}
                className="flex h-12 w-full rounded-xl border-2 border-warm-stone bg-warm-stone/50 px-4 py-3 text-sm text-wool-cream transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-glow"
              >
                <option value="">Select frequency...</option>
                <option value="1-year" className="bg-rich-umber">Every year</option>
                <option value="2-years" className="bg-rich-umber">Every 2 years</option>
                <option value="3-years" className="bg-rich-umber">Every 3 years</option>
                <option value="custom" className="bg-rich-umber">Custom</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="septicCost" className="text-wool-cream font-medium">
                Cost per Pump-Out
              </Label>
              <Input
                id="septicCost"
                type="number"
                step="0.01"
                placeholder="e.g., 350.00"
                {...register('septicCost', { valueAsNumber: true })}
                className="bg-warm-stone/50 border-warm-stone text-wool-cream placeholder:text-honey/50"
              />
            </div>
          </div>
        </div>
      )}

      {/* Holding Tank Details */}
      {sewageSystem === 'holding-tank' && (
        <div className="p-5 rounded-xl bg-slate-blue/10 border-2 border-slate-blue/30 space-y-4">
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-winter-sky" />
            <h3 className="font-semibold text-wool-cream">Holding Tank Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="holdingTankSize" className="text-wool-cream font-medium">
                Tank Capacity (gallons)
              </Label>
              <Input
                id="holdingTankSize"
                type="number"
                placeholder="e.g., 500"
                {...register('holdingTankSize', { valueAsNumber: true })}
                className="bg-warm-stone/50 border-warm-stone text-wool-cream placeholder:text-honey/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="holdingTankFrequency" className="text-wool-cream font-medium">
                Average Pump-Out Frequency
              </Label>
              <select
                id="holdingTankFrequency"
                {...register('holdingTankFrequency')}
                className="flex h-12 w-full rounded-xl border-2 border-warm-stone bg-warm-stone/50 px-4 py-3 text-sm text-wool-cream transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-glow"
              >
                <option value="">Select frequency...</option>
                <option value="weekly" className="bg-rich-umber">Weekly</option>
                <option value="biweekly" className="bg-rich-umber">Every 2 weeks</option>
                <option value="monthly" className="bg-rich-umber">Monthly</option>
                <option value="custom" className="bg-rich-umber">Custom</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="holdingTankCost" className="text-wool-cream font-medium">
              Cost per Pump-Out
            </Label>
            <Input
              id="holdingTankCost"
              type="number"
              step="0.01"
              placeholder="e.g., 200.00"
              {...register('holdingTankCost', { valueAsNumber: true })}
              className="bg-warm-stone/50 border-warm-stone text-wool-cream placeholder:text-honey/50"
            />
          </div>
        </div>
      )}

      {/* Information Box */}
      <div className="p-4 rounded-xl bg-slate-blue/10 border border-slate-blue/30">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-winter-sky mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-wool-cream mb-1">Sewage System Maintenance</h4>
            <p className="text-sm text-honey/90">
              We'll help you track pump-out schedules and costs. Regular maintenance prevents costly backups
              and ensures your system operates efficiently in cold weather.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SewageSystemsStep;
