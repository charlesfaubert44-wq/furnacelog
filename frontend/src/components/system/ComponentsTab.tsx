/**
 * ComponentsTab Component
 * Displays and manages sub-components of a system
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface Component {
  id: string;
  name: string;
  partNumber?: string;
  manufacturer?: string;
  installDate?: string;
  status: 'operational' | 'needs-replacement' | 'failed';
  notes?: string;
  estimatedLifespan?: number;
}

interface ComponentsTabProps {
  systemId: string;
}

export function ComponentsTab({ systemId }: ComponentsTabProps) {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

  const { data: components, isLoading } = useQuery<Component[]>({
    queryKey: ['system-components', systemId],
    queryFn: async () => {
      const response = await api.get(`/systems/${systemId}/components`);
      return response.data.components || [];
    },
  });

  const deleteComponentMutation = useMutation({
    mutationFn: async (componentId: string) => {
      await api.delete(`/systems/${systemId}/components/${componentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-components', systemId] });
      toast.success('Component deleted');
    },
    onError: () => {
      toast.error('Failed to delete component');
    },
  });

  const handleDelete = (component: Component) => {
    if (window.confirm(`Delete component "${component.name}"?`)) {
      deleteComponentMutation.mutate(component.id);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    );
  }

  if (!components || components.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Components Tracked</h3>
        <p className="text-gray-600 mb-6">
          Add components to track individual parts and their maintenance
        </p>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Component
        </Button>
      </div>
    );
  }

  const getStatusIcon = (status: Component['status']) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'needs-replacement':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: Component['status']) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-700';
      case 'needs-replacement':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Components ({components.length})</h3>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Component
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {components.map(component => (
          <Card key={component.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(component.status)}
                  <h4 className="font-semibold text-gray-900">{component.name}</h4>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => {}}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(component)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {component.manufacturer && (
                  <div>
                    <span className="text-gray-600">Manufacturer:</span>
                    <span className="ml-2 font-medium">{component.manufacturer}</span>
                  </div>
                )}
                {component.partNumber && (
                  <div>
                    <span className="text-gray-600">Part #:</span>
                    <span className="ml-2 font-mono text-xs">{component.partNumber}</span>
                  </div>
                )}
                {component.estimatedLifespan && (
                  <div>
                    <span className="text-gray-600">Est. Lifespan:</span>
                    <span className="ml-2 font-medium">{component.estimatedLifespan} years</span>
                  </div>
                )}
                {component.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-gray-700">{component.notes}</p>
                  </div>
                )}
              </div>

              <div className="mt-3">
                <Badge className={cn('text-xs', getStatusColor(component.status))}>
                  {component.status.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
