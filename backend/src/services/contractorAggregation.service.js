/**
 * Contractor Aggregation Service
 * Aggregates contractor data from maintenance logs
 */

import MaintenanceLog from '../models/MaintenanceLog.js';
import ServiceProvider from '../models/ServiceProvider.js';
import mongoose from 'mongoose';

/**
 * Get user's recent contractors with aggregated stats
 */
export async function getUserRecentContractors(userId, homeId, limit = 10) {
  // Get all logs with providers for this home
  const logs = await MaintenanceLog.find({
    homeId: mongoose.Types.ObjectId(homeId),
    'execution.performedBy': 'provider',
    'execution.providerId': { $exists: true, $ne: null }
  })
    .populate('execution.providerId')
    .sort({ 'execution.date': -1 })
    .lean();

  if (!logs || logs.length === 0) {
    return [];
  }

  // Group by provider
  const providerMap = new Map();

  logs.forEach(log => {
    const provider = log.execution?.providerId;
    if (!provider || !provider._id) return;

    const providerId = provider._id.toString();

    if (!providerMap.has(providerId)) {
      providerMap.set(providerId, {
        id: providerId,
        businessName: provider.businessName || 'Unknown',
        contactName: provider.contactName,
        phone: provider.phone,
        email: provider.email,
        specialties: provider.specialties || [],
        timesHired: 0,
        totalCost: 0,
        ratings: [],
        lastUsed: log.execution.date,
        wouldHireAgain: null
      });
    }

    const providerData = providerMap.get(providerId);
    providerData.timesHired++;
    providerData.totalCost += log.costs?.total || 0;

    if (log.providerRating?.overall) {
      providerData.ratings.push(log.providerRating.overall);
    }

    if (log.providerRating?.wouldHireAgain !== undefined && log.providerRating.wouldHireAgain !== null) {
      providerData.wouldHireAgain = log.providerRating.wouldHireAgain;
    }

    if (log.execution.date > providerData.lastUsed) {
      providerData.lastUsed = log.execution.date;
    }
  });

  // Calculate averages and format
  const contractors = Array.from(providerMap.values()).map(p => ({
    id: p.id,
    businessName: p.businessName,
    contactName: p.contactName,
    phone: p.phone,
    email: p.email,
    specialties: p.specialties,
    timesHired: p.timesHired,
    averageCost: p.timesHired > 0 ? Math.round((p.totalCost / p.timesHired) * 100) / 100 : 0,
    rating: p.ratings.length > 0
      ? Math.round((p.ratings.reduce((a, b) => a + b, 0) / p.ratings.length) * 10) / 10
      : 0,
    lastUsed: p.lastUsed,
    wouldHireAgain: p.wouldHireAgain
  }));

  // Sort by last used (most recent first)
  contractors.sort((a, b) => new Date(b.lastUsed) - new Date(a.lastUsed));

  return contractors.slice(0, limit);
}

/**
 * Get contractor by ID with user-specific stats
 */
export async function getContractorWithUserStats(userId, homeId, contractorId) {
  const contractor = await ServiceProvider.findById(contractorId).lean();
  if (!contractor) {
    return null;
  }

  // Get user's history with this contractor
  const logs = await MaintenanceLog.find({
    homeId: mongoose.Types.ObjectId(homeId),
    'execution.providerId': mongoose.Types.ObjectId(contractorId)
  })
    .populate('systemId', 'name category')
    .sort({ 'execution.date': -1 })
    .lean();

  const timesHired = logs.length;
  const totalSpent = logs.reduce((sum, log) => sum + (log.costs?.total || 0), 0);
  const averageCost = timesHired > 0 ? totalSpent / timesHired : 0;

  const ratings = logs
    .filter(log => log.providerRating?.overall)
    .map(log => log.providerRating.overall);
  const userRating = ratings.length > 0
    ? ratings.reduce((a, b) => a + b, 0) / ratings.length
    : 0;

  const lastJob = logs.length > 0 ? {
    date: logs[0].execution.date,
    task: logs[0].taskPerformed?.customDescription || 'Maintenance',
    cost: logs[0].costs?.total || 0,
    system: logs[0].systemId?.name
  } : null;

  const wouldHireAgain = logs.find(log => log.providerRating?.wouldHireAgain !== undefined)?.providerRating?.wouldHireAgain;

  return {
    ...contractor,
    userStats: {
      timesHired,
      totalSpent: Math.round(totalSpent * 100) / 100,
      averageCost: Math.round(averageCost * 100) / 100,
      userRating: Math.round(userRating * 10) / 10,
      lastJob,
      wouldHireAgain,
      jobs: logs.map(log => ({
        id: log._id,
        date: log.execution.date,
        task: log.taskPerformed?.customDescription || 'Maintenance',
        system: log.systemId?.name,
        cost: log.costs?.total || 0,
        rating: log.providerRating?.overall
      }))
    }
  };
}

export default {
  getUserRecentContractors,
  getContractorWithUserStats
};
