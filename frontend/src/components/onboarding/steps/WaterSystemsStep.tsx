import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectionCard, SelectionGrid } from '../SelectionCard';
import {
  Droplet,
  TrendingUp,
  FlaskRound,
  Thermometer,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

const waterSources = [
  {
    id: 'municipal',
    icon: Droplet,
    title: 'Municipal Water',
    description: 'Piped city/community water supply'
  },
  {
    id: 'well',
    icon: TrendingUp,
    title: 'Private Well',
    description: 'Ground water from well pump'
  },
  {
    id: 'trucked',
    icon: Droplet,
    title: 'Trucked Water',
    description: 'Delivered to holding tank',
    badge: 'Northern Common'
  },
  {
    id: 'combination',
    icon: Droplet,
    title: 'Combination',
    description: 'Well + trucked backup'
  }
];

const hotWaterSystems = [
  {
    id: 'tank',
    icon: Thermometer,
    title: 'Hot Water Tank',
    description: 'Traditional storage tank'
  },
  {
    id: 'tankless',
    icon: FlaskRound,
    title: 'Tankless/On-Demand',
    description: 'Instant hot water heater'
  },
  {
    id: 'boiler-integrated',
    icon: Thermometer,
    title: 'Boiler-Integrated',
    description: 'Combined with heating system'
  }
];

export const WaterSystemsStep: React.FC = () => {
  const { register, watch, setValue } = useFormContext();
  const waterSource = watch('waterSource');
  const hotWaterSystem = watch('hotWaterSystem');
  const hasTreatment = watch('hasTreatment');

  return (
    <div className="space-y-8">
      {/* Water Source */}
      <div className="space-y-3">
        <div>
          <Label className="text-wool-cream font-medium text-lg">
            Water Source <span className="text-ember-glow">*</span>
          </Label>
          <p className="text-sm text-honey/80 mt-1">
            How does water get to your home?
          </p>
        </div>
        <SelectionGrid columns={2}>
          {waterSources.map((source) => (
            <SelectionCard
              key={source.id}
              icon={source.icon}
              title={source.title}
              description={source.description}
              badge={source.badge}
              selected={waterSource === source.id}
              onClick={() => setValue('waterSource', source.id)}
            />
          ))}
        </SelectionGrid>
      </div>

      {/* Trucked Water Details */}
      {(waterSource === 'trucked' || waterSource === 'combination') && (
        <div className="p-5 rounded-xl bg-slate-blue/10 border-2 border-slate-blue/30 space-y-4">
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-winter-sky" />
            <h3 className="font-semibold text-wool-cream">Trucked Water Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tankCapacity" className="text-wool-cream font-medium">
                Tank Capacity (gallons)
              </Label>
              <Input
                id="tankCapacity"
                type="number"
                placeholder="e.g., 500"
                {...register('tankCapacity', { valueAsNumber: true })}
                className="bg-warm-stone/50 border-warm-stone text-wool-cream placeholder:text-honey/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="refillFrequency" className="text-wool-cream font-medium">
                Typical Refill Frequency
              </Label>
              <select
                id="refillFrequency"
                {...register('refillFrequency')}
                className="flex h-12 w-full rounded-xl border-2 border-warm-stone bg-warm-stone/50 px-4 py-3 text-sm text-wool-cream transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-glow focus-visible:ring-offset-2 focus-visible:ring-offset-rich-umber"
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
            <Label htmlFor="refillCost" className="text-wool-cream font-medium">
              Average Cost per Fill (optional)
            </Label>
            <Input
              id="refillCost"
              type="number"
              step="0.01"
              placeholder="e.g., 150.00"
              {...register('refillCost', { valueAsNumber: true })}
              className="bg-warm-stone/50 border-warm-stone text-wool-cream placeholder:text-honey/50"
            />
            <p className="text-xs text-honey/70">
              Helps with budgeting and cost tracking
            </p>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-warm-stone/30">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-winter-sky" />
              <span className="text-sm text-wool-cream">Enable low-level reminders</span>
            </div>
            <button
              type="button"
              onClick={() => setValue('enableWaterReminders', !watch('enableWaterReminders'))}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ember-glow",
                watch('enableWaterReminders') ? "bg-forest-green" : "bg-warm-stone/50"
              )}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-wool-cream transition-transform",
                  watch('enableWaterReminders') ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>
        </div>
      )}

      {/* Well Details */}
      {(waterSource === 'well' || waterSource === 'combination') && (
        <div className="p-5 rounded-xl bg-slate-blue/10 border-2 border-slate-blue/30 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-winter-sky" />
            <h3 className="font-semibold text-wool-cream">Well System Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pumpType" className="text-wool-cream font-medium">
                Pump Type
              </Label>
              <select
                id="pumpType"
                {...register('pumpType')}
                className="flex h-12 w-full rounded-xl border-2 border-warm-stone bg-warm-stone/50 px-4 py-3 text-sm text-wool-cream transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-glow"
              >
                <option value="">Select type...</option>
                <option value="submersible" className="bg-rich-umber">Submersible</option>
                <option value="jet" className="bg-rich-umber">Jet Pump</option>
                <option value="other" className="bg-rich-umber">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="wellDepth" className="text-wool-cream font-medium">
                Well Depth (feet)
              </Label>
              <Input
                id="wellDepth"
                type="number"
                placeholder="e.g., 150"
                {...register('wellDepth', { valueAsNumber: true })}
                className="bg-warm-stone/50 border-warm-stone text-wool-cream placeholder:text-honey/50"
              />
            </div>
          </div>
        </div>
      )}

      {/* Hot Water System */}
      <div className="space-y-3">
        <div>
          <Label className="text-wool-cream font-medium text-lg">
            Hot Water System <span className="text-ember-glow">*</span>
          </Label>
          <p className="text-sm text-honey/80 mt-1">
            This affects which maintenance tasks you'll see
          </p>
        </div>
        <SelectionGrid columns={3}>
          {hotWaterSystems.map((system) => (
            <SelectionCard
              key={system.id}
              icon={system.icon}
              title={system.title}
              description={system.description}
              selected={hotWaterSystem === system.id}
              onClick={() => setValue('hotWaterSystem', system.id)}
            />
          ))}
        </SelectionGrid>
      </div>

      {/* Hot Water Tank Details */}
      {hotWaterSystem === 'tank' && (
        <div className="p-5 rounded-xl bg-warm-stone/20 border-2 border-warm-stone space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tankSize" className="text-wool-cream font-medium">
                Tank Size (gallons)
              </Label>
              <Input
                id="tankSize"
                type="number"
                placeholder="e.g., 40"
                {...register('tankSize', { valueAsNumber: true })}
                className="bg-warm-stone/50 border-warm-stone text-wool-cream placeholder:text-honey/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tankFuel" className="text-wool-cream font-medium">
                Fuel Type
              </Label>
              <select
                id="tankFuel"
                {...register('tankFuel')}
                className="flex h-12 w-full rounded-xl border-2 border-warm-stone bg-warm-stone/50 px-4 py-3 text-sm text-wool-cream transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-glow"
              >
                <option value="">Select...</option>
                <option value="electric" className="bg-rich-umber">Electric</option>
                <option value="gas" className="bg-rich-umber">Natural Gas</option>
                <option value="propane" className="bg-rich-umber">Propane</option>
                <option value="oil" className="bg-rich-umber">Oil</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tankAge" className="text-wool-cream font-medium">
                Age (years)
              </Label>
              <Input
                id="tankAge"
                type="number"
                placeholder="e.g., 8"
                {...register('tankAge', { valueAsNumber: true })}
                className="bg-warm-stone/50 border-warm-stone text-wool-cream placeholder:text-honey/50"
              />
            </div>
          </div>
        </div>
      )}

      {/* Water Treatment */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 rounded-xl bg-warm-stone/30 border-2 border-warm-stone hover:border-honey transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-hearth shadow-glow-sm flex items-center justify-center flex-shrink-0">
              <FlaskRound className="w-5 h-5 text-wool-cream" />
            </div>
            <div>
              <h3 className="font-semibold text-wool-cream">Water Treatment Systems</h3>
              <p className="text-sm text-honey">Filters, softeners, UV sterilizers, etc.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setValue('hasTreatment', !hasTreatment)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ember-glow focus:ring-offset-2 focus:ring-offset-rich-umber",
              hasTreatment ? "bg-forest-green" : "bg-warm-stone/50"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-wool-cream transition-transform",
                hasTreatment ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>

        {hasTreatment && (
          <div className="pl-4 ml-9 border-l-2 border-honey/30 space-y-2">
            <Label className="text-wool-cream font-medium">Treatment Systems</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {['water-softener', 'uv-sterilizer', 'reverse-osmosis', 'whole-house-filter', 'sediment-filter'].map((system) => {
                const treatmentSystems = watch('treatmentSystems') || [];
                const isSelected = treatmentSystems.includes(system);
                return (
                  <button
                    key={system}
                    type="button"
                    onClick={() => {
                      const current = treatmentSystems || [];
                      if (current.includes(system)) {
                        setValue('treatmentSystems', current.filter((item: string) => item !== system));
                      } else {
                        setValue('treatmentSystems', [...current, system]);
                      }
                    }}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all text-left border-2",
                      isSelected
                        ? "bg-forest-green/20 border-forest-green/40 text-northern-lights"
                        : "bg-warm-stone/30 border-warm-stone text-honey hover:border-honey/50"
                    )}
                  >
                    {system.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaterSystemsStep;
