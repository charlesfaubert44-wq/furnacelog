import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectionCard, SelectionGrid } from '../SelectionCard';
import {
  Home,
  TreePine,
  Warehouse,
  Building2,
  HelpCircle
} from 'lucide-react';

const homeTypes = [
  {
    id: 'modular',
    icon: Building2,
    title: 'Modular Home',
    description: 'Factory-built sections assembled on-site'
  },
  {
    id: 'stick-built',
    icon: Home,
    title: 'Stick-Built',
    description: 'Traditional on-site construction'
  },
  {
    id: 'log',
    icon: TreePine,
    title: 'Log Home',
    description: 'Solid log or timber frame construction'
  },
  {
    id: 'mobile',
    icon: Warehouse,
    title: 'Mobile Home',
    description: 'Manufactured home on chassis'
  },
  {
    id: 'other',
    icon: HelpCircle,
    title: 'Other',
    description: 'Different construction type'
  }
];

const territories = [
  { value: 'NWT', label: 'Northwest Territories' },
  { value: 'Nunavut', label: 'Nunavut' },
  { value: 'Yukon', label: 'Yukon' },
  { value: 'Other', label: 'Other' }
];

export const HomeBasicsStep: React.FC = () => {
  const { register, watch, setValue } = useFormContext();
  const selectedHomeType = watch('homeType');

  return (
    <div className="space-y-6">
      {/* Home Name */}
      <div className="space-y-2">
        <Label htmlFor="homeName" className="text-wool-cream font-medium">
          Home Name <span className="text-ember-glow">*</span>
        </Label>
        <Input
          id="homeName"
          placeholder="e.g., Main House, Cabin on the Lake"
          {...register('homeName')}
          className="bg-warm-stone/50 border-warm-stone text-wool-cream placeholder:text-honey/50"
        />
        <p className="text-xs text-honey/70">
          Give your home a nickname to help identify it if you manage multiple properties
        </p>
      </div>

      {/* Home Type Selection */}
      <div className="space-y-3">
        <Label className="text-wool-cream font-medium">
          Home Type <span className="text-ember-glow">*</span>
        </Label>
        <SelectionGrid columns={2}>
          {homeTypes.map((type) => (
            <SelectionCard
              key={type.id}
              icon={type.icon}
              title={type.title}
              description={type.description}
              selected={selectedHomeType === type.id}
              onClick={() => setValue('homeType', type.id)}
            />
          ))}
        </SelectionGrid>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="community" className="text-wool-cream font-medium">
            Community/Town <span className="text-ember-glow">*</span>
          </Label>
          <Input
            id="community"
            placeholder="e.g., Yellowknife, Iqaluit"
            {...register('community')}
            className="bg-warm-stone/50 border-warm-stone text-wool-cream placeholder:text-honey/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="territory" className="text-wool-cream font-medium">
            Territory <span className="text-ember-glow">*</span>
          </Label>
          <select
            id="territory"
            {...register('territory')}
            className="flex h-12 w-full rounded-xl border-2 border-warm-stone bg-warm-stone/50 px-4 py-3 text-sm text-wool-cream transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-glow focus-visible:ring-offset-2 focus-visible:ring-offset-rich-umber disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select territory...</option>
            {territories.map((t) => (
              <option key={t.value} value={t.value} className="bg-rich-umber text-wool-cream">
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="yearBuilt" className="text-wool-cream font-medium">
            Year Built
          </Label>
          <Input
            id="yearBuilt"
            type="number"
            placeholder="e.g., 2015"
            {...register('yearBuilt', { valueAsNumber: true })}
            className="bg-warm-stone/50 border-warm-stone text-wool-cream placeholder:text-honey/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bedrooms" className="text-wool-cream font-medium">
            Bedrooms
          </Label>
          <Input
            id="bedrooms"
            type="number"
            placeholder="e.g., 3"
            {...register('bedrooms', { valueAsNumber: true })}
            className="bg-warm-stone/50 border-warm-stone text-wool-cream placeholder:text-honey/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bathrooms" className="text-wool-cream font-medium">
            Bathrooms
          </Label>
          <Input
            id="bathrooms"
            type="number"
            step="0.5"
            placeholder="e.g., 2"
            {...register('bathrooms', { valueAsNumber: true })}
            className="bg-warm-stone/50 border-warm-stone text-wool-cream placeholder:text-honey/50"
          />
        </div>
      </div>

      {/* Helpful tip */}
      <div className="p-4 rounded-xl bg-slate-blue/10 border border-slate-blue/30">
        <p className="text-sm text-winter-sky flex items-start gap-2">
          <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            This information helps us recommend maintenance tasks specific to your home type and location.
            Northern homes have unique needs compared to southern properties.
          </span>
        </p>
      </div>
    </div>
  );
};

export default HomeBasicsStep;
