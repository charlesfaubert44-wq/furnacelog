export type HomeType = 'modular' | 'stick-built' | 'log' | 'mobile' | 'other';
export type FoundationType = 'piles' | 'crawlspace' | 'basement' | 'slab';
export type WaterSource = 'municipal' | 'well' | 'trucked';
export type SewageSystem = 'municipal' | 'septic' | 'holding-tank';
export type ElectricalService = 'grid' | 'generator' | 'hybrid';
export type HeatFuel = 'propane' | 'oil' | 'electric' | 'wood' | 'natural-gas';
export type Territory = 'NWT' | 'Nunavut' | 'Yukon' | 'Other';

export interface Coordinates {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Address {
  street?: string;
  community: string;
  territory: Territory;
  postalCode?: string;
  coordinates?: Coordinates;
}

export interface HomeDetails {
  homeType: HomeType;
  yearBuilt?: number;
  squareFootage?: number;
  bedrooms?: number;
  bathrooms?: number;
  foundationType?: FoundationType;
  stories?: number;
}

export interface Utilities {
  waterSource?: WaterSource;
  sewageSystem?: SewageSystem;
  electricalService?: ElectricalService;
  primaryHeatFuel?: HeatFuel;
  secondaryHeatFuel?: string;
}

export interface ModularInfo {
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  csaCertification?: string;
  sections?: number;
  transportDate?: Date | string;
  setupContractor?: string;
}

export interface Home {
  _id: string;
  userId: string;
  name: string;
  address: Address;
  details: HomeDetails;
  utilities?: Utilities;
  modularInfo?: ModularInfo;
  coverPhoto?: string;
  archived: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateHomeDto {
  name: string;
  address: Address;
  details: HomeDetails;
  utilities?: Utilities;
  modularInfo?: ModularInfo;
  coverPhoto?: string;
}

export interface UpdateHomeDto extends Partial<CreateHomeDto> {}

export interface HomeResponse {
  success: boolean;
  data: Home;
}

export interface HomesResponse {
  success: boolean;
  count: number;
  data: Home[];
}
