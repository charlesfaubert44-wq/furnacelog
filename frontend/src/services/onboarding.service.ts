/**
 * Onboarding Service
 * Handles onboarding wizard completion
 */

import api from './api';

export interface OnboardingData {
  home: {
    name: string;
    homeType: 'modular' | 'stick-built' | 'log' | 'mobile' | 'other';
    community: string;
    territory: 'NWT' | 'Nunavut' | 'Yukon' | 'Other';
    yearBuilt?: number;
    bedrooms?: number;
    bathrooms?: number;
  };
  systems: {
    heating?: any;
    water?: any;
    sewage?: any;
    electrical?: any;
    additional?: any;
  };
  preferences?: {
    reminderMethods?: string[];
    reminderTiming?: string;
    autoGenerateChecklists?: boolean;
    diyLevel?: string;
    interestedInProviders?: boolean;
    providerTypes?: string[];
  };
}

export interface OnboardingResponse {
  success: boolean;
  data: {
    home: {
      id: string;
      name: string;
      homeType: string;
      community: string;
      territory: string;
    };
    systems: Array<{
      id: string;
      category: string;
      type: string;
      name: string;
    }>;
    tasksGenerated: number;
    checklistGenerated: boolean;
  };
  message: string;
}

/**
 * Complete onboarding wizard
 */
export async function completeOnboarding(data: OnboardingData): Promise<OnboardingResponse> {
  try {
    const response = await api.post<OnboardingResponse>('/onboarding/complete', data);
    return response.data;
  } catch (error: any) {
    console.error('Error completing onboarding:', error);
    throw error.response?.data || error;
  }
}

export default {
  completeOnboarding
};
