/**
 * CostAnalysisTab Component
 * Displays cost trends and breakdowns for a system
 */

import { useQuery } from '@tanstack/react-query';
import { format, parseISO, differenceInYears } from 'date-fns';
import { DollarSign, TrendingUp, Package } from 'lucide-react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface CostAnalysisTabProps {
  systemId: string;
}

interface CostData {
  totalLifetimeCost: number;
  averageAnnualCost: number;
  last12MonthsCost: number;
  costByYear: Array<{
    year: string;
    parts: number;
    labor: number;
    total: number;
  }>;
  partsCost: Array<{
    name: string;
    count: number;
    totalCost: number;
    avgCost: number;
  }>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function CostAnalysisTab({ systemId }: CostAnalysisTabProps) {
  const { data: costData, isLoading } = useQuery<CostData>({
    queryKey: ['system-costs', systemId],
    queryFn: async () => {
      const response = await api.get(`/analytics/system-costs/${systemId}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  if (!costData) {
    return (
      <div className="text-center py-12">
        <DollarSign className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No cost data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Lifetime Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <p className="text-3xl font-bold">${costData.totalLifetimeCost.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg. Annual Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <p className="text-3xl font-bold">${costData.averageAnnualCost.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Last 12 Months
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-600" />
              <p className="text-3xl font-bold">${costData.last12MonthsCost.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Trend Chart */}
      {costData.costByYear.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Annual Cost Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costData.costByYear}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                <Legend />
                <Bar dataKey="parts" stackId="a" fill="#3b82f6" name="Parts" />
                <Bar dataKey="labor" stackId="a" fill="#f59e0b" name="Labor" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Parts Breakdown */}
      {costData.partsCost.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Most Replaced Parts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {costData.partsCost.map((part, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{part.name}</p>
                    <p className="text-sm text-gray-600">
                      Replaced {part.count} time{part.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${part.totalCost.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      ${part.avgCost.toFixed(2)} avg
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
