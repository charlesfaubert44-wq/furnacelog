import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { SelectionListItem, SelectionList } from '../SelectionCard';
import {
  Refrigerator,
  Utensils,
  Waves,
  Wind,
  Droplet,
  Flame,
  Box,
  Home
} from 'lucide-react';

const appliances = [
  { id: 'refrigerator', icon: Refrigerator, title: 'Refrigerator(s)', description: 'Track warranty and maintenance' },
  { id: 'freezer', icon: Box, title: 'Freezer', description: 'Chest or upright' },
  { id: 'washer', icon: Waves, title: 'Washer', description: 'Washing machine' },
  { id: 'dryer', icon: Wind, title: 'Dryer', description: 'Clothes dryer' },
  { id: 'dishwasher', icon: Droplet, title: 'Dishwasher', description: 'Automatic dishwasher' },
  { id: 'range', icon: Utensils, title: 'Range/Oven', description: 'Cooking appliance' }
];

const specializedSystems = [
  { id: 'heated-garage', icon: Home, title: 'Heated Garage', description: 'Separate heating system' },
  { id: 'heated-driveway', icon: Flame, title: 'Heated Driveway/Walkways', description: 'Snow melting system' },
  { id: 'sump-pump', icon: Droplet, title: 'Sump Pump(s)', description: 'Water removal system' },
  { id: 'humidifier', icon: Wind, title: 'Humidifier/Dehumidifier', description: 'Humidity control' },
  { id: 'smart-thermostat', icon: Home, title: 'Smart Thermostat(s)', description: 'Connected climate control' }
];

const fuelStorage = [
  { id: 'propane-tank', icon: Flame, title: 'Propane Tank(s)', description: 'Above or below ground' },
  { id: 'fuel-oil-tank', icon: Droplet, title: 'Fuel Oil Tank', description: 'Heating oil storage' },
  { id: 'diesel-storage', icon: Flame, title: 'Diesel Storage', description: 'Generator or heating' },
  { id: 'wood-storage', icon: Box, title: 'Wood Storage/Shed', description: 'Firewood storage' }
];

export const AdditionalSystemsStep: React.FC = () => {
  const { watch, setValue } = useFormContext();
  const selectedAppliances = watch('appliances') || [];
  const selectedSpecializedSystems = watch('specializedSystems') || [];
  const selectedFuelStorage = watch('fuelStorage') || [];

  const toggleSelection = (field: string, id: string) => {
    const current = watch(field) || [];
    if (current.includes(id)) {
      setValue(field, current.filter((item: string) => item !== id));
    } else {
      setValue(field, [...current, id]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Appliances to Track */}
      <div className="space-y-3">
        <div>
          <Label className="text-wool-cream font-medium text-lg">
            Appliances to Track
          </Label>
          <p className="text-sm text-honey/80 mt-1">
            Select appliances you want to monitor for warranty and maintenance (optional)
          </p>
        </div>
        <SelectionList>
          {appliances.map((appliance) => (
            <SelectionListItem
              key={appliance.id}
              icon={appliance.icon}
              title={appliance.title}
              description={appliance.description}
              selected={selectedAppliances.includes(appliance.id)}
              onClick={() => toggleSelection('appliances', appliance.id)}
            />
          ))}
        </SelectionList>
      </div>

      {/* Specialized Northern Systems */}
      <div className="space-y-3">
        <div>
          <Label className="text-wool-cream font-medium text-lg">
            Specialized Systems
          </Label>
          <p className="text-sm text-honey/80 mt-1">
            Northern-specific and specialized home systems (optional)
          </p>
        </div>
        <SelectionList>
          {specializedSystems.map((system) => (
            <SelectionListItem
              key={system.id}
              icon={system.icon}
              title={system.title}
              description={system.description}
              selected={selectedSpecializedSystems.includes(system.id)}
              onClick={() => toggleSelection('specializedSystems', system.id)}
            />
          ))}
        </SelectionList>
      </div>

      {/* Fuel Storage */}
      <div className="space-y-3">
        <div>
          <Label className="text-wool-cream font-medium text-lg">
            Fuel Storage
          </Label>
          <p className="text-sm text-honey/80 mt-1">
            Track fuel levels and delivery schedules (optional)
          </p>
        </div>
        <SelectionList>
          {fuelStorage.map((storage) => (
            <SelectionListItem
              key={storage.id}
              icon={storage.icon}
              title={storage.title}
              description={storage.description}
              selected={selectedFuelStorage.includes(storage.id)}
              onClick={() => toggleSelection('fuelStorage', storage.id)}
            />
          ))}
        </SelectionList>
      </div>

      {/* Helpful Info */}
      <div className="p-4 rounded-xl bg-slate-blue/10 border border-slate-blue/30">
        <p className="text-sm text-winter-sky">
          💡 You can always add more appliances and systems later from your dashboard.
          This step helps us set up your initial tracking and maintenance reminders.
        </p>
      </div>
    </div>
  );
};

export default AdditionalSystemsStep;
