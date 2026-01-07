/**
 * Cost Aggregation Service
 * Aggregates cost data from maintenance logs for dashboard widgets
 */

import MaintenanceLog from '../models/MaintenanceLog.js';
import System from '../models/System.js';
import mongoose from 'mongoose';

/**
 * Get user's cost data aggregated by various dimensions
 */
export async function getUserCostData(userId, homeId) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  // Get all logs for this year
  const logs = await MaintenanceLog.find({
    homeId: new mongoose.Types.ObjectId(homeId),
    'execution.date': { $gte: startOfYear }
  })
    .populate('systemId', 'category')
    .lean();

  // Calculate this month
  const thisMonth = logs
    .filter(log => log.execution.date >= startOfMonth)
    .reduce((sum, log) => sum + (log.costs?.total || 0), 0);

  // Calculate last month
  const lastMonth = logs
    .filter(log => log.execution.date >= startOfLastMonth && log.execution.date < startOfMonth)
    .reduce((sum, log) => sum + (log.costs?.total || 0), 0);

  // Calculate this year
  const thisYear = logs.reduce((sum, log) => sum + (log.costs?.total || 0), 0);

  // Group by category
  const categoryMap = new Map();
  logs.forEach(log => {
    const category = log.systemId?.category || 'Other';
    const current = categoryMap.get(category) || 0;
    categoryMap.set(category, current + (log.costs?.total || 0));
  });

  // Convert to array with percentages
  const totalSpent = Array.from(categoryMap.values()).reduce((a, b) => a + b, 0);
  const byCategory = Array.from(categoryMap.entries()).map(([category, amount]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    amount: Math.round(amount * 100) / 100,
    percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 100 * 10) / 10 : 0
  })).sort((a, b) => b.amount - a.amount);

  // DIY vs Professional
  const diy = logs
    .filter(log => log.execution.performedBy === 'self')
    .reduce((sum, log) => sum + (log.costs?.total || 0), 0);

  const professional = logs
    .filter(log => log.execution.performedBy === 'provider')
    .reduce((sum, log) => sum + (log.costs?.total || 0), 0);

  // Monthly data for last 12 months
  const monthlyData = [];
  for (let i = 11; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const monthLogs = logs.filter(log =>
      log.execution.date >= monthStart && log.execution.date < monthEnd
    );
    const monthAmount = monthLogs.reduce((sum, log) => sum + (log.costs?.total || 0), 0);
    monthlyData.push({
      month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
      amount: Math.round(monthAmount * 100) / 100
    });
  }

  return {
    thisMonth: Math.round(thisMonth * 100) / 100,
    lastMonth: Math.round(lastMonth * 100) / 100,
    thisYear: Math.round(thisYear * 100) / 100,
    byCategory,
    byType: {
      diy: Math.round(diy * 100) / 100,
      professional: Math.round(professional * 100) / 100
    },
    monthlyData
  };
}

export default {
  getUserCostData
};
