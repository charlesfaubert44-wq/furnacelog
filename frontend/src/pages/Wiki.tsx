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
  Clock,
  Plus,
  ExternalLink,
  Youtube,
  Link as LinkIcon,
  Home,
  Settings as SettingsIcon
} from 'lucide-react';
import { AddArticleModal, type ArticleInput } from '@/components/modals/AddArticleModal';
import { Logo } from '@/components/furnacelog/Logo';
import { cn } from '@/lib/utils';
import { useScrollPosition } from '@/hooks/useScrollAnimation';

/**
 * Wiki Page Component
 * Knowledge Base for Northern Home Maintenance
 */

interface ExternalLink {
  title: string;
  url: string;
}

interface Article {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  lastUpdated: string;
  icon: React.ElementType;
  videoUrl?: string; // YouTube video URL
  externalLinks?: ExternalLink[]; // External reference links
  author?: string;
  authorType?: 'admin' | 'user';
}

type CategoryFilter = 'all' | 'heating' | 'water' | 'ventilation' | 'electrical' | 'maintenance';

const Wiki: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [isAddArticleModalOpen, setIsAddArticleModalOpen] = useState(false);
  const { isScrolled } = useScrollPosition();

  // Mock articles data (will be replaced with API call)
  const articles: Article[] = [
    {
      id: '1',
      title: 'Propane Furnace Winter Maintenance Guide',
      category: 'heating',
      excerpt: 'Essential maintenance tasks to keep your propane furnace running efficiently through the harsh northern winter.',
      readTime: '8 min read',
      lastUpdated: '2025-12-15',
      icon: Thermometer,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      externalLinks: [
        { title: 'Propane Safety Guidelines', url: 'https://example.com/propane-safety' },
        { title: 'Furnace Manufacturer Manual', url: 'https://example.com/manual' }
      ],
      author: 'FurnaceLog Team',
      authorType: 'admin'
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

  const handleSaveArticle = (article: ArticleInput) => {
    // TODO: Connect to backend API to save the article
    console.log('Saving article:', article);
    // For now, we'll just log it - the modal already shows a success message
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
    <div className="min-h-screen bg-warm-white relative overflow-hidden">
      {/* Subtle warm background texture */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-warm-white via-cream to-warm-white opacity-60" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(212, 165, 116, 0.15) 0%, transparent 50%)`
        }} />
      </div>

      {/* Navigation */}
      <nav className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        isScrolled
          ? "border-soft-amber/20 bg-warm-white/95 backdrop-blur-md shadow-sm"
          : "border-soft-amber/10 bg-warm-white/80 backdrop-blur-sm"
      )}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/')} className="transition-opacity hover:opacity-80">
                <Logo size="sm" />
              </button>

              {/* Main Navigation Menu */}
              <nav className="hidden md:flex items-center gap-1 ml-8">
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 text-sm text-warm-gray hover:text-charcoal font-medium transition-colors rounded-lg hover:bg-cream"
                >
                  Homepage
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 text-sm text-warm-gray hover:text-charcoal font-medium transition-colors rounded-lg hover:bg-cream"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/wiki')}
                  className="px-4 py-2 text-sm text-charcoal font-semibold transition-colors rounded-lg bg-cream"
                >
                  Knowledge Base
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="px-4 py-2 text-sm text-warm-gray hover:text-charcoal font-medium transition-colors rounded-lg hover:bg-cream"
                >
                  About
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="px-4 py-2 text-sm text-warm-gray hover:text-charcoal font-medium transition-colors rounded-lg hover:bg-cream"
                >
                  Contact Us
                </button>
              </nav>
            </div>

            {/* User Menu */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-warm-gray hover:text-charcoal font-medium transition-colors rounded-lg hover:bg-cream"
                >
                  <User className="w-4 h-4" />
                  <span>{user?.profile?.firstName || user?.email || 'User'}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-soft-amber/20 rounded-xl shadow-lg py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/dashboard');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-warm-gray hover:bg-cream hover:text-charcoal transition-colors"
                    >
                      <Home className="w-4 h-4" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/settings');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-warm-gray hover:bg-cream hover:text-charcoal transition-colors"
                    >
                      <SettingsIcon className="w-4 h-4" />
                      Settings
                    </button>
                    <div className="border-t border-soft-amber/10 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-warm-gray hover:bg-cream hover:text-charcoal transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
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
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-burnt-sienna to-warm-orange rounded-2xl flex items-center justify-center shadow-md">
                <BookOpen className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-charcoal">Knowledge Base</h1>
                <p className="text-warm-gray text-lg">Expert guides for northern home maintenance</p>
              </div>
            </div>
            {user && (
              <button
                onClick={() => setIsAddArticleModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-burnt-sienna to-warm-orange hover:from-warm-orange hover:to-burnt-sienna text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Add Article
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-soft-amber/20 text-charcoal placeholder-warm-gray/50 rounded-xl focus:outline-none focus:border-warm-orange/40 focus:shadow-md transition-all duration-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-soft-amber/20 rounded-2xl p-6 shadow-md sticky top-24">
              <h2 className="text-lg font-bold text-charcoal mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const count = getCategoryCount(category.id);
                  return (
                    <button
                      key={category.id}
                      onClick={() => setCategoryFilter(category.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300",
                        categoryFilter === category.id
                          ? 'bg-gradient-to-r from-burnt-sienna to-warm-orange text-white font-semibold shadow-md'
                          : 'text-warm-gray hover:bg-cream hover:text-charcoal'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{category.label}</span>
                      </div>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full font-semibold",
                        categoryFilter === category.id
                          ? 'bg-white/20'
                          : 'bg-soft-amber/20'
                      )}>
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
                      className="bg-white border border-soft-amber/20 rounded-2xl p-6 shadow-md hover:border-warm-orange/40 hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-burnt-sienna to-warm-orange rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-charcoal mb-2 group-hover:text-warm-orange transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-warm-gray mb-4 leading-relaxed">
                            {article.excerpt}
                          </p>

                          {/* YouTube Video */}
                          {article.videoUrl && (
                            <div className="mb-4">
                              <div className="aspect-video rounded-xl overflow-hidden border border-soft-amber/20">
                                <iframe
                                  width="100%"
                                  height="100%"
                                  src={article.videoUrl.replace('watch?v=', 'embed/')}
                                  title={article.title}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  className="w-full h-full"
                                />
                              </div>
                              <div className="flex items-center gap-2 mt-2 text-sm text-warm-gray/70">
                                <Youtube className="w-4 h-4" />
                                <span>Video guide included</span>
                              </div>
                            </div>
                          )}

                          {/* External Links */}
                          {article.externalLinks && article.externalLinks.length > 0 && (
                            <div className="mb-4 bg-cream/50 rounded-xl p-4 border border-soft-amber/20">
                              <div className="flex items-center gap-2 text-sm font-semibold text-charcoal mb-3">
                                <LinkIcon className="w-4 h-4" />
                                External References
                              </div>
                              <div className="space-y-2">
                                {article.externalLinks.map((link, index) => (
                                  <a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-2 text-sm text-warm-gray hover:text-warm-orange transition-colors group/link"
                                  >
                                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                    <span className="group-hover/link:underline">{link.title}</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-6 text-sm text-warm-gray/70">
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
                            {article.author && (
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {article.author}
                                {article.authorType === 'admin' && (
                                  <span className="px-2 py-0.5 bg-warm-orange/20 text-warm-orange text-xs rounded-full border border-warm-orange/30 font-semibold">
                                    Admin
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-soft-amber/20 rounded-2xl p-12 shadow-md text-center">
                <Search className="w-16 h-16 text-soft-amber/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-charcoal mb-2">No articles found</h3>
                <p className="text-warm-gray">
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
        <div className="mt-12 bg-gradient-to-br from-warm-orange/10 to-soft-amber/5 border-2 border-warm-orange/20 rounded-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-burnt-sienna to-warm-orange rounded-2xl shadow-md mb-4">
            <BookOpen className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-bold text-charcoal mb-3">More Articles Coming Soon</h3>
          <p className="text-warm-gray max-w-2xl mx-auto">
            We're continuously expanding our knowledge base with expert guides tailored for northern home maintenance.
            Check back regularly for new articles on heating systems, water management, emergency preparedness, and more.
          </p>
        </div>
      </div>

      {/* Add Article Modal */}
      <AddArticleModal
        isOpen={isAddArticleModalOpen}
        onClose={() => setIsAddArticleModalOpen(false)}
        onSave={handleSaveArticle}
      />
    </div>
  );
};

export default Wiki;
