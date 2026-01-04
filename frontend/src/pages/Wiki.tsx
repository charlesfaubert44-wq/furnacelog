import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Flame,
  User,
  ChevronDown,
  LogOut,
  Search,
  BookOpen,
  Thermometer,
  Droplet,
  Wind,
  Zap,
  Wrench,
  AlertTriangle,
  Calendar,
  Clock
} from 'lucide-react';

/**
 * Wiki Page Component
 * Knowledge Base for Northern Home Maintenance
 */

interface Article {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  lastUpdated: string;
  icon: React.ElementType;
}

type CategoryFilter = 'all' | 'heating' | 'water' | 'ventilation' | 'electrical' | 'maintenance';

const Wiki: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  // Mock articles data (will be replaced with API call)
  const articles: Article[] = [
    {
      id: '1',
      title: 'Propane Furnace Winter Maintenance Guide',
      category: 'heating',
      excerpt: 'Essential maintenance tasks to keep your propane furnace running efficiently through the harsh northern winter.',
      readTime: '8 min read',
      lastUpdated: '2025-12-15',
      icon: Thermometer
    },
    {
      id: '2',
      title: 'Preventing Frozen Pipes in Extreme Cold',
      category: 'water',
      excerpt: 'Learn how to protect your water system when temperatures drop below -40�C.',
      readTime: '6 min read',
      lastUpdated: '2025-11-20',
      icon: Droplet
    },
    {
      id: '3',
      title: 'HRV System Optimization for Northern Climate',
      category: 'ventilation',
      excerpt: 'Maximize your Heat Recovery Ventilator efficiency while maintaining proper air quality in sealed winter homes.',
      readTime: '10 min read',
      lastUpdated: '2025-10-05',
      icon: Wind
    },
    {
      id: '4',
      title: 'Generator Maintenance Schedule',
      category: 'electrical',
      excerpt: 'Keep your backup power system ready for grid failures during winter storms.',
      readTime: '7 min read',
      lastUpdated: '2025-09-12',
      icon: Zap
    },
    {
      id: '5',
      title: 'Wood Stove Safety and Efficiency Tips',
      category: 'heating',
      excerpt: 'Best practices for safe and efficient wood stove operation as a backup heating source.',
      readTime: '9 min read',
      lastUpdated: '2025-12-01',
      icon: Flame
    },
    {
      id: '6',
      title: 'Spring Thaw Preparation Checklist',
      category: 'maintenance',
      excerpt: 'Critical tasks to complete as winter transitions to spring in northern regions.',
      readTime: '5 min read',
      lastUpdated: '2026-01-03',
      icon: Calendar
    },
    {
      id: '7',
      title: 'Water Heater Troubleshooting Guide',
      category: 'water',
      excerpt: 'Common water heater issues in cold climates and how to diagnose and fix them.',
      readTime: '12 min read',
      lastUpdated: '2025-11-08',
      icon: Wrench
    },
    {
      id: '8',
      title: 'Emergency Heating System Failure Protocol',
      category: 'heating',
      excerpt: 'What to do when your primary heating system fails during extreme cold weather.',
      readTime: '6 min read',
      lastUpdated: '2025-10-22',
      icon: AlertTriangle
    }
  ];

  const categories = [
    { id: 'all' as CategoryFilter, label: 'All Articles', icon: BookOpen },
    { id: 'heating' as CategoryFilter, label: 'Heating Systems', icon: Thermometer },
    { id: 'water' as CategoryFilter, label: 'Water Systems', icon: Droplet },
    { id: 'ventilation' as CategoryFilter, label: 'Ventilation', icon: Wind },
    { id: 'electrical' as CategoryFilter, label: 'Electrical', icon: Zap },
    { id: 'maintenance' as CategoryFilter, label: 'General Maintenance', icon: Wrench }
  ];

  const handleLogout = async () => {
    await logout();
  };

  // Filter articles based on search and category
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryCount = (category: CategoryFilter): number => {
    if (category === 'all') return articles.length;
    return articles.filter(a => a.category === category).length;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Warm Background Gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ff4500]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#ff6a00]/12 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff8c00]/8 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative border-b border-[#d4a373]/10 bg-[#0a0a0a]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#ff4500] to-[#ff6a00] rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(255,107,53,0.3)]">
                <Flame className="w-6 h-6 text-[#f4e8d8]" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#f4e8d8] tracking-tight">
                  FurnaceLog
                </h1>
                <p className="text-xs text-[#d4a373] font-medium">Northern Home Tracker</p>
              </div>
            </button>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 ml-8">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-[#d4a373] hover:text-[#ff6a00] transition-colors duration-200"
              >
                Home
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-[#d4a373] hover:text-[#ff6a00] transition-colors duration-200"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/wiki')}
                className="px-4 py-2 text-[#ff6a00] font-semibold transition-colors duration-200"
              >
                Wiki
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="px-4 py-2 text-[#d4a373] hover:text-[#ff6a00] transition-colors duration-200"
              >
                Settings
              </button>
            </nav>

            {/* User Menu */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 px-4 py-2 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#d4a373]/20 rounded-xl hover:border-[#ff6a00]/40 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#ff4500] to-[#ff6a00] rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-[#f4e8d8]" />
                  </div>
                  <span className="text-[#f4e8d8] font-medium">{user?.profile?.firstName || 'User'}</span>
                  <ChevronDown className={`w-4 h-4 text-[#d4a373] transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#d4a373]/20 rounded-xl shadow-2xl overflow-hidden z-50">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/settings');
                      }}
                      className="w-full px-4 py-3 text-left text-[#d4a373] hover:bg-[#ff6a00]/10 hover:text-[#ff6a00] transition-colors flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-[#d45d4e] hover:bg-[#d45d4e]/10 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#ff4500] to-[#ff6a00] rounded-2xl flex items-center justify-center shadow-[0_8px_24px_rgba(255,107,53,0.4)]">
              <BookOpen className="w-8 h-8 text-[#f4e8d8]" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#f4e8d8]">Knowledge Base</h1>
              <p className="text-[#d4a373] text-lg">Expert guides for northern home maintenance</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#d4a373]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-4 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#d4a373]/20 text-[#f4e8d8] placeholder-[#d4a373]/50 rounded-xl focus:outline-none focus:border-[#ff6a00]/40 focus:shadow-[0_4px_16px_rgba(255,107,53,0.15)] transition-all duration-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#d4a373]/10 rounded-2xl p-6 shadow-2xl sticky top-6">
              <h2 className="text-lg font-bold text-[#f4e8d8] mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const count = getCategoryCount(category.id);
                  return (
                    <button
                      key={category.id}
                      onClick={() => setCategoryFilter(category.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                        categoryFilter === category.id
                          ? 'bg-gradient-to-r from-[#ff4500] to-[#ff6a00] text-[#f4e8d8] font-semibold shadow-[0_4px_16px_rgba(255,107,53,0.3)]'
                          : 'text-[#d4a373] hover:bg-[#2a2a2a]/60 hover:text-[#ff6a00]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{category.label}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        categoryFilter === category.id
                          ? 'bg-[#f4e8d8]/20'
                          : 'bg-[#2a2a2a]/60'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="lg:col-span-3">
            {filteredArticles.length > 0 ? (
              <div className="space-y-6">
                {filteredArticles.map((article) => {
                  const Icon = article.icon;
                  return (
                    <div
                      key={article.id}
                      className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#d4a373]/10 rounded-2xl p-6 shadow-2xl hover:border-[#ff6a00]/30 hover:shadow-[0_8px_32px_rgba(255,107,53,0.15)] transition-all duration-300 cursor-pointer group"
                      onClick={() => {
                        // TODO: Navigate to article detail page
                        alert(`Article "${article.title}" would open here. Article detail pages coming soon!`);
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#ff4500] to-[#ff6a00] rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_4px_16px_rgba(255,107,53,0.3)]">
                          <Icon className="w-6 h-6 text-[#f4e8d8]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-[#f4e8d8] mb-2 group-hover:text-[#ff6a00] transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-[#d4a373] mb-4 leading-relaxed">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center gap-6 text-sm text-[#d4a373]/70">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {article.readTime}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Updated {new Date(article.lastUpdated).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#d4a373]/10 rounded-2xl p-12 shadow-2xl text-center">
                <Search className="w-16 h-16 text-[#d4a373]/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#f4e8d8] mb-2">No articles found</h3>
                <p className="text-[#d4a373]">
                  {searchQuery
                    ? `No articles match "${searchQuery}". Try a different search term.`
                    : 'No articles available in this category yet.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-12 bg-gradient-to-br from-[#ff6a00]/10 to-[#ff4500]/5 border border-[#ff6a00]/20 rounded-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#ff4500] to-[#ff6a00] rounded-2xl shadow-[0_8px_24px_rgba(255,107,53,0.4)] mb-4">
            <BookOpen className="w-8 h-8 text-[#f4e8d8]" strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-bold text-[#f4e8d8] mb-3">More Articles Coming Soon</h3>
          <p className="text-[#d4a373] max-w-2xl mx-auto">
            We're continuously expanding our knowledge base with expert guides tailored for northern home maintenance.
            Check back regularly for new articles on heating systems, water management, emergency preparedness, and more.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Wiki;
