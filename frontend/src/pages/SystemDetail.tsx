/**
 * SystemDetail Page
 * Comprehensive view of a single home system with 5 tabbed sections
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO, differenceInYears } from 'date-fns';
import {
  ArrowLeft,
  Wrench,
  Calendar,
  DollarSign,
  AlertTriangle,
  Edit,
  Trash2,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MaintenanceHistoryTab } from '@/components/system/MaintenanceHistoryTab';
import { ComponentsTab } from '@/components/system/ComponentsTab';
import { DocumentsTab } from '@/components/system/DocumentsTab';
import { CostAnalysisTab } from '@/components/system/CostAnalysisTab';
import { TimelineTab } from '@/components/system/TimelineTab';

interface System {
  id: string;
  name: string;
  type: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  installDate: string;
  warrantyEndDate?: string;
  expectedLifespan: number;
  status: 'operational' | 'needs-attention' | 'failed' | 'unknown';
  location?: string;
  photos: Array<{
    id: string;
    url: string;
    caption?: string;
    uploadedAt: string;
  }>;
  specifications?: Record<string, any>;
  healthScore: number;
  lastMaintenanceDate?: string;
  nextDueDate?: string;
}

export function SystemDetail() {
  const { systemId } = useParams<{ systemId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('history');

  // Fetch system details
  const { data: system, isLoading } = useQuery<System>({
    queryKey: ['system', systemId],
    queryFn: async () => {
      const response = await api.get(`/systems/${systemId}`);
      return response.data.system;
    },
  });

  // Delete system mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/systems/${systemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systems'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('System deleted successfully');
      navigate('/dashboard');
    },
    onError: () => {
      toast.error('Failed to delete system');
    },
  });

  const handleDelete = () => {
    if (!system) return;

    if (window.confirm(`Are you sure you want to delete "${system.name}"? This action cannot be undone.`)) {
      deleteMutation.mutate();
    }
  };

  const handleQuickLog = () => {
    window.dispatchEvent(new CustomEvent('open-quick-log', {
      detail: { systemId: system?.id },
    }));
  };

  const handleScheduleService = () => {
    window.dispatchEvent(new CustomEvent('open-schedule-task', {
      detail: { systemId: system?.id },
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading system details...</p>
        </div>
      </div>
    );
  }

  if (!system) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">System Not Found</h2>
          <p className="text-gray-600 mb-4">The system you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const systemAge = differenceInYears(new Date(), parseISO(system.installDate));
  const ageRatio = systemAge / system.expectedLifespan;

  const getStatusColor = (status: System['status']) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'needs-attention':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{system.name}</h1>
                <Badge className={cn('border', getStatusColor(system.status))}>
                  {system.status.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>
              <p className="text-gray-600 capitalize">{system.type.replace('-', ' ')}</p>
              {system.manufacturer && system.model && (
                <p className="text-sm text-gray-500 mt-1">
                  {system.manufacturer} - {system.model}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleQuickLog}>
                <Wrench className="h-4 w-4 mr-2" />
                Log Maintenance
              </Button>
              <Button variant="outline" onClick={handleScheduleService}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Service
              </Button>
              <Button variant="outline" onClick={() => navigate(`/systems/${systemId}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Photo Gallery */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Photos</CardTitle>
            </CardHeader>
            <CardContent>
              {system.photos.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {system.photos.map(photo => (
                    <div key={photo.id} className="aspect-video relative group cursor-pointer">
                      <img
                        src={photo.url}
                        alt={photo.caption || 'System photo'}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">View full size</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No photos uploaded yet</p>
                  <Button variant="outline" className="mt-4">
                    Add Photos
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Install Date</p>
                <p className="font-medium">{format(parseISO(system.installDate), 'MMM d, yyyy')}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Age</p>
                <p className="font-medium">
                  {systemAge} years
                  <span className="text-sm text-gray-500 ml-2">
                    ({Math.round(ageRatio * 100)}% of expected lifespan)
                  </span>
                </p>
              </div>

              {system.warrantyEndDate && (
                <div>
                  <p className="text-sm text-gray-600">Warranty</p>
                  <p className="font-medium">
                    {new Date(system.warrantyEndDate) > new Date() ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Valid until {format(parseISO(system.warrantyEndDate), 'MMM d, yyyy')}
                      </span>
                    ) : (
                      <span className="text-red-600">
                        Expired {format(parseISO(system.warrantyEndDate), 'MMM d, yyyy')}
                      </span>
                    )}
                  </p>
                </div>
              )}

              {system.location && (
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{system.location}</p>
                </div>
              )}

              {system.serialNumber && (
                <div>
                  <p className="text-sm text-gray-600">Serial Number</p>
                  <p className="font-medium font-mono text-sm">{system.serialNumber}</p>
                </div>
              )}

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Health Score</span>
                  <span className={cn('font-semibold', getHealthColor(system.healthScore))}>
                    {system.healthScore}%
                  </span>
                </div>
                <Progress value={system.healthScore} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Cost</p>
                  <p className="text-2xl font-bold">$0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Wrench className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Service</p>
                  <p className="text-lg font-bold">
                    {system.lastMaintenanceDate
                      ? format(parseISO(system.lastMaintenanceDate), 'MMM d, yyyy')
                      : 'Never'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Next Due</p>
                  <p className="text-lg font-bold">
                    {system.nextDueDate
                      ? format(parseISO(system.nextDueDate), 'MMM d')
                      : 'Not scheduled'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-lg font-bold capitalize">
                    {system.status.replace('-', ' ')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <CardHeader className="border-b">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="history" className="flex-1">
                  Maintenance History
                </TabsTrigger>
                <TabsTrigger value="components" className="flex-1">
                  Components
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex-1">
                  Documents
                </TabsTrigger>
                <TabsTrigger value="costs" className="flex-1">
                  Cost Analysis
                </TabsTrigger>
                <TabsTrigger value="timeline" className="flex-1">
                  Timeline
                </TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent className="p-6">
              <TabsContent value="history" className="mt-0">
                <MaintenanceHistoryTab systemId={systemId!} />
              </TabsContent>

              <TabsContent value="components" className="mt-0">
                <ComponentsTab systemId={systemId!} />
              </TabsContent>

              <TabsContent value="documents" className="mt-0">
                <DocumentsTab systemId={systemId!} />
              </TabsContent>

              <TabsContent value="costs" className="mt-0">
                <CostAnalysisTab systemId={systemId!} />
              </TabsContent>

              <TabsContent value="timeline" className="mt-0">
                <TimelineTab systemId={systemId!} />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

export default SystemDetail;
