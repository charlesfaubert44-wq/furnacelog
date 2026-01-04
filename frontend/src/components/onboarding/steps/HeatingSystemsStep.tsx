import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectionCard, SelectionGrid, SelectionListItem, SelectionList } from '../SelectionCard';
import { Badge } from '@/components/ui/badge';
import {
  Flame,
  Thermometer,
  Wind,
  Zap,
  TreePine,
  Boxes,
  Radio,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const primaryHeatingSystems = [
  {
    id: 'oil-furnace',
    icon: Flame,
    title: 'Oil Furnace',
    description: 'Forced air heating with fuel oil',
    badge: 'Common'
  },
  {
    id: 'propane-furnace',
    icon: Flame,
    title: 'Propane Furnace',
    description: 'Forced air with propane fuel',
    badge: 'Common'
  },
  {
    id: 'natural-gas',
    icon: Flame,
    title: 'Natural Gas',
    description: 'Gas-powered forced air'
  },
  {
    id: 'electric-furnace',
    icon: Zap,
    title: 'Electric Furnace',
    description: 'Electric forced air heating'
  },
  {
    id: 'boiler',
    icon: Thermometer,
    title: 'Boiler System',
    description: 'Hydronic/radiant heating'
  },
  {
    id: 'wood-stove',
    icon: TreePine,
    title: 'Wood Stove',
    description: 'Primary wood heating'
  },
  {
    id: 'pellet-stove',
    icon: Boxes,
    title: 'Pellet Stove',
    description: 'Automated pellet heating'
  },
  {
    id: 'heat-pump',
    icon: Radio,
    title: 'Heat Pump',
    description: 'Air or ground source heat pump'
  }
];

const secondaryHeatingOptions = [
  { id: 'wood-stove-secondary', icon: TreePine, title: 'Wood Stove', description: 'Backup heating' },
  { id: 'pellet-stove-secondary', icon: Boxes, title: 'Pellet Stove', description: 'Backup heating' },
  { id: 'electric-heaters', icon: Zap, title: 'Electric Space Heaters', description: 'Portable or fixed' },
  { id: 'propane-heaters', icon: Flame, title: 'Propane Heaters', description: 'Backup propane' }
];

export const HeatingSystemsStep: React.FC = () => {
  const { register, watch, setValue } = useFormContext();
  const primaryHeating = watch('primaryHeating');
  const secondaryHeating = watch('secondaryHeating') || [];
  const hasHRV = watch('hasHRV');
  const hasHeatTrace = watch('hasHeatTrace');
  const heatTraceLocations = watch('heatTraceLocations') || [];

  const toggleSecondaryHeating = (id: string) => {
    const current = secondaryHeating || [];
    if (current.includes(id)) {
      setValue('secondaryHeating', current.filter((item: string) => item !== id));
    } else {
      setValue('secondaryHeating', [...current, id]);
    }
  };

  const toggleHeatTraceLocation = (location: string) => {
    const current = heatTraceLocations || [];
    if (current.includes(location)) {
      setValue('heatTraceLocations', current.filter((item: string) => item !== location));
    } else {
      setValue('heatTraceLocations', [...current, location]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Primary Heating System */}
      <div className="space-y-3">
        <div>
          <Label className="text-wool-cream font-medium text-lg">
            Primary Heating System <span className="text-ember-glow">*</span>
          </Label>
          <p className="text-sm text-honey/80 mt-1">
            Select your main source of heat for your home
          </p>
        </div>
        <SelectionGrid columns={2}>
          {primaryHeatingSystems.map((system) => (
            <SelectionCard
              key={system.id}
              icon={system.icon}
              title={system.title}
              description={system.description}
              badge={system.badge}
              selected={primaryHeating === system.id}
              onClick={() => setValue('primaryHeating', system.id)}
            />
          ))}
        </SelectionGrid>
      </div>

      {/* Heating System Age */}
      {primaryHeating && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="heatingAge" className="text-wool-cream font-medium">
              System Age (years)
            </Label>
            <Input
              id="heatingAge"
              type="number"
              placeholder="e.g., 5"
              {...register('heatingAge', { valueAsNumber: true })}
              className="bg-warm-stone/50 border-warm-stone text-wool-cream placeholder:text-honey/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heatingBrand" className="text-wool-cream font-medium">
              Brand/Manufacturer
            </Label>
            <Input
              id="heatingBrand"
              placeholder="e.g., Lennox, Carrier"
              {...register('heatingBrand')}
              className="bg-warm-stone/50 border-warm-stone text-wool-cream placeholder:text-honey/50"
            />
          </div>
        </div>
      )}

      {/* Secondary/Backup Heating */}
      <div className="space-y-3">
        <div>
          <Label className="text-wool-cream font-medium text-lg">
            Secondary/Backup Heating
          </Label>
          <p className="text-sm text-honey/80 mt-1">
            Select all backup heating sources (optional)
          </p>
        </div>
        <SelectionList>
          {secondaryHeatingOptions.map((system) => (
            <SelectionListItem
              key={system.id}
              icon={system.icon}
              title={system.title}
              description={system.description}
              selected={secondaryHeating.includes(system.id)}
              onClick={() => toggleSecondaryHeating(system.id)}
            />
          ))}
        </SelectionList>
      </div>

      {/* Heat Recovery Ventilator (HRV) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 rounded-xl bg-warm-stone/30 border-2 border-warm-stone hover:border-honey transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-hearth shadow-glow-sm flex items-center justify-center flex-shrink-0">
              <Wind className="w-5 h-5 text-wool-cream" />
            </div>
            <div>
              <h3 className="font-semibold text-wool-cream">Heat Recovery Ventilator (HRV)</h3>
              <p className="text-sm text-honey">Essential for northern homes to manage humidity</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setValue('hasHRV', !hasHRV)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ember-glow focus:ring-offset-2 focus:ring-offset-rich-umber",
              hasHRV ? "bg-forest-green" : "bg-warm-stone/50"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-wool-cream transition-transform",
                hasHRV ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>

        {hasHRV && (
          <div className="pl-4 ml-9 border-l-2 border-honey/30 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hrvBrand" className="text-wool-cream font-medium">
                  HRV Brand
                </Label>
                <Input
                  id="hrvBrand"
                  placeholder="e.g., Venmar, Lifebreath"
                  {...register('hrvBrand')}
                  className="bg-warm-stone/50 border-warm-stone text-wool-cream placeholder:text-honey/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hrvAge" className="text-wool-cream font-medium">
                  HRV Age (years)
                </Label>
                <Input
                  id="hrvAge"
                  type="number"
                  placeholder="e.g., 3"
                  {...register('hrvAge', { valueAsNumber: true })}
                  className="bg-warm-stone/50 border-warm-stone text-wool-cream placeholder:text-honey/50"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Heat Trace/Heat Cables */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 rounded-xl bg-warm-stone/30 border-2 border-warm-stone hover:border-honey transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-hearth shadow-glow-sm flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-wool-cream" />
            </div>
            <div>
              <h3 className="font-semibold text-wool-cream">Heat Trace / Heat Cables</h3>
              <p className="text-sm text-honey">Prevents freezing in extreme cold</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setValue('hasHeatTrace', !hasHeatTrace)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ember-glow focus:ring-offset-2 focus:ring-offset-rich-umber",
              hasHeatTrace ? "bg-forest-green" : "bg-warm-stone/50"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-wool-cream transition-transform",
                hasHeatTrace ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>

        {hasHeatTrace && (
          <div className="pl-4 ml-9 border-l-2 border-honey/30 space-y-2">
            <Label className="text-wool-cream font-medium">Locations</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {['water-lines', 'sewage-lines', 'roof-gutters', 'entryways'].map((location) => (
                <button
                  key={location}
                  type="button"
                  onClick={() => toggleHeatTraceLocation(location)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all text-left border-2",
                    heatTraceLocations.includes(location)
                      ? "bg-forest-green/20 border-forest-green/40 text-northern-lights"
                      : "bg-warm-stone/30 border-warm-stone text-honey hover:border-honey/50"
                  )}
                >
                  {location.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Northern Heating Alert */}
      <div className="p-4 rounded-xl bg-sunset-amber/10 border border-sunset-amber/30">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-sunset-amber mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-wool-cream mb-1">Northern Climate Maintenance</h4>
            <p className="text-sm text-honey/90">
              Northern homes require more frequent heating system maintenance. We'll automatically adjust
              maintenance schedules for your {primaryHeating ? primaryHeatingSystems.find(s => s.id === primaryHeating)?.title.toLowerCase() : 'heating system'} based on your location.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatingSystemsStep;
