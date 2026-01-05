import React, { useState } from 'react';
import {
  X,
  Save,
  Thermometer,
  Droplet,
  Wind,
  Zap,
  Wrench,
  BookOpen,
  AlertCircle,
  Youtube,
  Plus,
  Trash2,
  Link as LinkIcon
} from 'lucide-react';

/**
 * Add Article Modal Component
 * Allows users to contribute articles to the Wiki
 */

interface AddArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (article: ArticleInput) => void;
}

interface ExternalLinkInput {
  title: string;
  url: string;
}

export interface ArticleInput {
  title: string;
  category: string;
  excerpt: string;
  videoUrl?: string;
  externalLinks?: ExternalLinkInput[];
}

const categories = [
  { id: 'heating', label: 'Heating Systems', icon: Thermometer },
  { id: 'water', label: 'Water Systems', icon: Droplet },
  { id: 'ventilation', label: 'Ventilation', icon: Wind },
  { id: 'electrical', label: 'Electrical', icon: Zap },
  { id: 'maintenance', label: 'General Maintenance', icon: Wrench }
];

export const AddArticleModal: React.FC<AddArticleModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ArticleInput>({
    title: '',
    category: '',
    excerpt: '',
    videoUrl: '',
    externalLinks: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [newLink, setNewLink] = useState<ExternalLinkInput>({ title: '', url: '' });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Article title is required';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Article excerpt is required';
    }
    if (formData.videoUrl && !formData.videoUrl.includes('youtube.com')) {
      newErrors.videoUrl = 'Please enter a valid YouTube URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddLink = () => {
    if (newLink.title.trim() && newLink.url.trim()) {
      setFormData({
        ...formData,
        externalLinks: [...(formData.externalLinks || []), newLink]
      });
      setNewLink({ title: '', url: '' });
    }
  };

  const handleRemoveLink = (index: number) => {
    setFormData({
      ...formData,
      externalLinks: formData.externalLinks?.filter((_, i) => i !== index)
    });
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // TODO: Connect to backend API to save the article
      if (onSave) {
        onSave(formData);
      }

      // Reset form
      setFormData({
        title: '',
        category: '',
        excerpt: '',
        videoUrl: '',
        externalLinks: []
      });
      setErrors({});

      alert('Article submitted successfully! It will be reviewed before publishing.');
      onClose();
    } catch (error) {
      console.error('Failed to save article:', error);
      alert('Failed to save article. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      category: '',
      excerpt: '',
      videoUrl: '',
      externalLinks: []
    });
    setErrors({});
    setNewLink({ title: '', url: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#d4a373]/20 rounded-2xl p-8 max-w-3xl w-full shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#ff4500] to-[#ff6a00] rounded-xl flex items-center justify-center shadow-[0_4px_16px_rgba(255,107,53,0.3)]">
                <BookOpen className="w-6 h-6 text-[#f4e8d8]" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#f4e8d8] mb-1">Add Article</h2>
                <p className="text-[#d4a373]">Share your knowledge with the community</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-[#d4a373] hover:text-[#f4e8d8] transition-colors p-2 hover:bg-[#2a2a2a]/50 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Article Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[#f4e8d8] mb-2">
                Article Title *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  setErrors({ ...errors, title: '' });
                }}
                placeholder="e.g., Propane Furnace Winter Maintenance Guide"
                className={`w-full px-4 py-3 bg-[#2a2a2a]/60 border-b-2 ${
                  errors.title ? 'border-[#d45d4e]' : 'border-[#d4a373]/30'
                } text-[#f4e8d8] placeholder-[#d4a373]/50 rounded-t-xl focus:outline-none focus:border-[#ff4500] focus:shadow-[0_4px_12px_rgba(255,107,53,0.15)] transition-all duration-300`}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-[#d45d4e] flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-[#f4e8d8] mb-3">
                Category *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, category: category.id });
                        setErrors({ ...errors, category: '' });
                      }}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                        formData.category === category.id
                          ? 'border-[#ff6a00] bg-[#ff6a00]/10 text-[#f4e8d8]'
                          : 'border-[#d4a373]/20 bg-[#2a2a2a]/40 text-[#d4a373] hover:border-[#ff6a00]/40'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{category.label}</span>
                    </button>
                  );
                })}
              </div>
              {errors.category && (
                <p className="mt-2 text-sm text-[#d45d4e] flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-[#f4e8d8] mb-2">
                Article Excerpt *
              </label>
              <textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => {
                  setFormData({ ...formData, excerpt: e.target.value });
                  setErrors({ ...errors, excerpt: '' });
                }}
                placeholder="Brief summary of the article (150-200 characters)"
                rows={3}
                className={`w-full px-4 py-3 bg-[#2a2a2a]/60 border-b-2 ${
                  errors.excerpt ? 'border-[#d45d4e]' : 'border-[#d4a373]/30'
                } text-[#f4e8d8] placeholder-[#d4a373]/50 rounded-t-xl focus:outline-none focus:border-[#ff4500] focus:shadow-[0_4px_12px_rgba(255,107,53,0.15)] transition-all duration-300 resize-none`}
              />
              {errors.excerpt && (
                <p className="mt-2 text-sm text-[#d45d4e] flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.excerpt}
                </p>
              )}
            </div>

            {/* YouTube Video URL */}
            <div>
              <label htmlFor="videoUrl" className="block text-sm font-medium text-[#f4e8d8] mb-2">
                YouTube Video URL (Optional)
              </label>
              <div className="relative">
                <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#d4a373]" />
                <input
                  id="videoUrl"
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, videoUrl: e.target.value });
                    setErrors({ ...errors, videoUrl: '' });
                  }}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={`w-full pl-12 pr-4 py-3 bg-[#2a2a2a]/60 border-b-2 ${
                    errors.videoUrl ? 'border-[#d45d4e]' : 'border-[#d4a373]/30'
                  } text-[#f4e8d8] placeholder-[#d4a373]/50 rounded-t-xl focus:outline-none focus:border-[#ff4500] focus:shadow-[0_4px_12px_rgba(255,107,53,0.15)] transition-all duration-300`}
                />
              </div>
              {errors.videoUrl && (
                <p className="mt-2 text-sm text-[#d45d4e] flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.videoUrl}
                </p>
              )}
            </div>

            {/* External Links */}
            <div>
              <label className="block text-sm font-medium text-[#f4e8d8] mb-3">
                External References (Optional)
              </label>

              {/* Existing Links */}
              {formData.externalLinks && formData.externalLinks.length > 0 && (
                <div className="mb-4 space-y-2">
                  {formData.externalLinks.map((link, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-[#2a2a2a]/40 rounded-xl border border-[#d4a373]/10"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <LinkIcon className="w-4 h-4 text-[#d4a373]" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#f4e8d8]">{link.title}</p>
                          <p className="text-xs text-[#d4a373] truncate">{link.url}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(index)}
                        className="p-2 text-[#d45d4e] hover:bg-[#d45d4e]/20 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Link */}
              <div className="bg-[#2a2a2a]/40 rounded-xl p-4 border border-[#d4a373]/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                    placeholder="Link title"
                    className="w-full px-4 py-2 bg-[#1a1a1a]/60 border border-[#d4a373]/20 text-[#f4e8d8] placeholder-[#d4a373]/50 rounded-lg focus:outline-none focus:border-[#ff4500] transition-all"
                  />
                  <input
                    type="url"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 bg-[#1a1a1a]/60 border border-[#d4a373]/20 text-[#f4e8d8] placeholder-[#d4a373]/50 rounded-lg focus:outline-none focus:border-[#ff4500] transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddLink}
                  disabled={!newLink.title.trim() || !newLink.url.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-[#d4a373]/20 hover:bg-[#d4a373]/30 disabled:opacity-50 disabled:cursor-not-allowed text-[#d4a373] rounded-lg transition-all text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Link
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#d4a373]/10">
              <button
                onClick={handleClose}
                className="px-6 py-3 text-[#d4a373] hover:text-[#f4e8d8] hover:bg-[#2a2a2a]/50 rounded-xl transition-all duration-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff4500] to-[#ff6a00] hover:shadow-[0_8px_32px_rgba(255,107,53,0.5)] disabled:opacity-50 disabled:cursor-not-allowed text-[#f4e8d8] font-bold rounded-xl transition-all duration-300 shadow-[0_4px_16px_rgba(255,107,53,0.35)]"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Submitting...' : 'Submit Article'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddArticleModal;
