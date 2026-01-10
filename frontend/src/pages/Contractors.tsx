/**
 * Contractors Page
 * Directory and management of home service contractors
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Plus, Star, Phone, Mail, MapPin, Calendar, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Contractor {
  id: string;
  name: string;
  company?: string;
  photo?: string;
  email: string;
  phone: string;
  specialties: string[];
  averageRating: number;
  completedProjects: number;
  averageResponseTime: number; // hours
  activeProjects: number;
  location?: string;
}

export function Contractors() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState(
    searchParams.get('specialty') || 'all'
  );

  const { data: contractors, isLoading } = useQuery<Contractor[]>({
    queryKey: ['contractors', specialtyFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (specialtyFilter !== 'all') params.append('specialty', specialtyFilter);
      if (searchQuery) params.append('q', searchQuery);

      const response = await api.get(`/contractors?${params.toString()}`);
      return response.data.contractors || [];
    },
  });

  // Sort contractors by priority
  const sortedContractors = contractors?.sort((a, b) => {
    // Priority 1: Active projects
    if (a.activeProjects > 0 && b.activeProjects === 0) return -1;
    if (a.activeProjects === 0 && b.activeProjects > 0) return 1;

    // Priority 2: Rating
    if (a.averageRating !== b.averageRating) {
      return b.averageRating - a.averageRating;
    }

    // Priority 3: Response time
    return a.averageResponseTime - b.averageResponseTime;
  }) || [];

  const handleScheduleAppointment = (contractor: Contractor) => {
    window.dispatchEvent(new CustomEvent('open-schedule-appointment', {
      detail: { contractorId: contractor.id },
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contractors</h1>
          <p className="text-gray-600">Manage your trusted home service professionals</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search contractors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Specialties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              <SelectItem value="plumber">Plumber</SelectItem>
              <SelectItem value="electrician">Electrician</SelectItem>
              <SelectItem value="hvac">HVAC Technician</SelectItem>
              <SelectItem value="general">General Contractor</SelectItem>
              <SelectItem value="carpenter">Carpenter</SelectItem>
            </SelectContent>
          </Select>

          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Contractor
          </Button>
        </div>

        {/* Contractors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedContractors.map(contractor => (
            <Card
              key={contractor.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/contractors/${contractor.id}`)}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={contractor.photo} />
                    <AvatarFallback>
                      {contractor.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{contractor.name}</CardTitle>
                    {contractor.company && (
                      <p className="text-sm text-gray-600">{contractor.company}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{contractor.averageRating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {contractor.specialties.map(specialty => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Contact info */}
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `tel:${contractor.phone}`;
                    }}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {contractor.phone}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `mailto:${contractor.email}`;
                    }}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {contractor.email}
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                  <div>
                    <p className="text-xs text-gray-600">Projects</p>
                    <p className="text-lg font-semibold">{contractor.completedProjects}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Avg Response</p>
                    <p className="text-lg font-semibold">{contractor.averageResponseTime}h</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3">
                  <Button
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleScheduleAppointment(contractor);
                    }}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedContractors.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No contractors found</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Contractor
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Contractors;
