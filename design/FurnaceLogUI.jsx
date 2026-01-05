import React, { useState } from 'react';

// ============================================
// FURNACELOG UI COMPONENT LIBRARY
// ============================================

// Color constants
const colors = {
  primary: '#C94A06',
  primaryHover: '#E55807',
  primaryDark: '#9a3412',
  background: '#000000',
  cardBg: '#0a0a0a',
  cardBorder: '#1a1a1a',
  text: '#ffffff',
  textMuted: '#6b7280',
  textSecondary: '#9ca3af',
  success: '#22c55e',
  warning: '#eab308',
  danger: '#ef4444',
  info: '#3b82f6',
};

// ============================================
// BUTTONS
// ============================================

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  fullWidth = false,
  icon,
  onClick,
  ...props 
}) => {
  const baseStyles = "font-semibold rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2";
  
  const variants = {
    primary: `bg-[#C94A06] hover:bg-[#E55807] text-white shadow-lg shadow-orange-900/20 hover:shadow-orange-900/40 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    secondary: `bg-transparent border-2 border-[#C94A06] text-[#C94A06] hover:bg-[#C94A06] hover:text-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    ghost: `bg-transparent text-gray-400 hover:text-white hover:bg-white/5 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    danger: `bg-red-600 hover:bg-red-500 text-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

// ============================================
// CARDS
// ============================================

export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6 ${hover ? 'hover:border-[#C94A06]/30 transition-colors duration-300' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between mb-4">
    <div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

// ============================================
// STAT CARD
// ============================================

export const StatCard = ({ label, value, unit, icon, trend, trendUp }) => (
  <Card hover>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white">{value}</span>
          {unit && <span className="text-gray-500 text-sm">{unit}</span>}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-sm ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
            <span>{trendUp ? '↑' : '↓'}</span>
            <span>{trend}</span>
          </div>
        )}
      </div>
      {icon && (
        <div className="p-3 bg-[#C94A06]/10 rounded-lg text-[#C94A06]">
          {icon}
        </div>
      )}
    </div>
  </Card>
);

// ============================================
// INPUT FIELDS
// ============================================

export const Input = ({ 
  label, 
  placeholder, 
  type = 'text', 
  error, 
  icon,
  ...props 
}) => (
  <div className="w-full">
    {label && <label className="block text-sm text-gray-400 mb-2">{label}</label>}
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          {icon}
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full bg-[#0a0a0a] border ${error ? 'border-red-500' : 'border-[#1a1a1a]'} rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#C94A06] transition-colors ${icon ? 'pl-10' : ''}`}
        {...props}
      />
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export const Select = ({ label, options, placeholder, ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm text-gray-400 mb-2">{label}</label>}
    <select
      className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C94A06] transition-colors appearance-none cursor-pointer"
      {...props}
    >
      {placeholder && <option value="" className="text-gray-600">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export const Textarea = ({ label, placeholder, rows = 4, error, ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm text-gray-400 mb-2">{label}</label>}
    <textarea
      rows={rows}
      placeholder={placeholder}
      className={`w-full bg-[#0a0a0a] border ${error ? 'border-red-500' : 'border-[#1a1a1a]'} rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#C94A06] transition-colors resize-none`}
      {...props}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// ============================================
// TOGGLE / SWITCH
// ============================================

export const Toggle = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <div className="relative">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div className={`w-12 h-6 rounded-full transition-colors ${checked ? 'bg-[#C94A06]' : 'bg-[#1a1a1a]'}`}>
        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : ''}`} />
      </div>
    </div>
    {label && <span className="text-gray-300">{label}</span>}
  </label>
);

// ============================================
// BADGES
// ============================================

export const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const variants = {
    default: 'bg-[#1a1a1a] text-gray-300',
    primary: 'bg-[#C94A06]/20 text-[#E55807]',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    danger: 'bg-red-500/20 text-red-400',
    info: 'bg-blue-500/20 text-blue-400',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

// ============================================
// PROGRESS BAR
// ============================================

export const ProgressBar = ({ value, max = 100, label, showValue = true, color = 'primary' }) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colors = {
    primary: 'bg-[#C94A06]',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  };

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between mb-2">
          {label && <span className="text-sm text-gray-400">{label}</span>}
          {showValue && <span className="text-sm text-gray-400">{value}/{max}</span>}
        </div>
      )}
      <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
        <div
          className={`h-full ${colors[color]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// ============================================
// ALERT / NOTIFICATION
// ============================================

export const Alert = ({ children, variant = 'info', title, onClose }) => {
  const variants = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    success: 'bg-green-500/10 border-green-500/30 text-green-400',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    danger: 'bg-red-500/10 border-red-500/30 text-red-400',
    primary: 'bg-[#C94A06]/10 border-[#C94A06]/30 text-[#E55807]',
  };

  const icons = {
    info: 'ℹ️',
    success: '✓',
    warning: '⚠',
    danger: '✕',
    primary: '🔥',
  };

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${variants[variant]}`}>
      <span className="text-lg">{icons[variant]}</span>
      <div className="flex-1">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <p className="text-sm opacity-90">{children}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity">
          ✕
        </button>
      )}
    </div>
  );
};

// ============================================
// NAVIGATION HEADER
// ============================================

export const Header = ({ logo, navItems = [], actions }) => (
  <header className="bg-black/80 backdrop-blur-sm border-b border-[#1a1a1a] px-6 py-4 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-8">
        {logo}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item, i) => (
            <a
              key={i}
              href={item.href}
              className={`text-sm font-medium transition-colors ${item.active ? 'text-[#C94A06]' : 'text-gray-400 hover:text-white'}`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      {actions && <div className="flex items-center gap-4">{actions}</div>}
    </div>
  </header>
);

// ============================================
// SIDEBAR NAV ITEM
// ============================================

export const SidebarItem = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-[#C94A06]/10 text-[#E55807] border-l-2 border-[#C94A06]' 
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    {icon && <span className="text-lg">{icon}</span>}
    <span className="flex-1 text-left font-medium">{label}</span>
    {badge && <Badge variant="primary" size="sm">{badge}</Badge>}
  </button>
);

// ============================================
// TABLE
// ============================================

export const Table = ({ columns, data }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-[#1a1a1a]">
          {columns.map((col, i) => (
            <th key={i} className="px-4 py-3 text-left text-sm font-medium text-gray-500">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className="border-b border-[#1a1a1a]/50 hover:bg-white/[0.02] transition-colors">
            {columns.map((col, colIndex) => (
              <td key={colIndex} className="px-4 py-4 text-sm text-gray-300">
                {col.render ? col.render(row) : row[col.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ============================================
// MODAL
// ============================================

export const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[#1a1a1a]">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-[#1a1a1a]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// TABS
// ============================================

export const Tabs = ({ tabs, activeTab, onChange }) => (
  <div className="flex border-b border-[#1a1a1a]">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`px-6 py-3 text-sm font-medium transition-colors relative ${
          activeTab === tab.id
            ? 'text-[#C94A06]'
            : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        {tab.label}
        {activeTab === tab.id && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C94A06]" />
        )}
      </button>
    ))}
  </div>
);

// ============================================
// AVATAR
// ============================================

export const Avatar = ({ src, alt, size = 'md', fallback }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-xl',
  };

  return (
    <div className={`${sizes[size]} rounded-full bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden flex items-center justify-center text-gray-400 font-medium`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        fallback || alt?.charAt(0).toUpperCase()
      )}
    </div>
  );
};

// ============================================
// TOOLTIP
// ============================================

export const Tooltip = ({ children, text }) => (
  <div className="relative group inline-block">
    {children}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#1a1a1a] text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a1a]" />
    </div>
  </div>
);

// ============================================
// SKELETON LOADER
// ============================================

export const Skeleton = ({ width, height, rounded = 'md' }) => {
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <div
      className={`bg-[#1a1a1a] animate-pulse ${roundedStyles[rounded]}`}
      style={{ width, height }}
    />
  );
};

// ============================================
// EMPTY STATE
// ============================================

export const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    {icon && <div className="text-5xl mb-4 opacity-30">{icon}</div>}
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    {description && <p className="text-gray-500 mb-6 max-w-sm">{description}</p>}
    {action}
  </div>
);

// ============================================
// DIVIDER
// ============================================

export const Divider = ({ label }) => (
  <div className="flex items-center gap-4 my-6">
    <div className="flex-1 h-px bg-[#1a1a1a]" />
    {label && <span className="text-sm text-gray-500">{label}</span>}
    <div className="flex-1 h-px bg-[#1a1a1a]" />
  </div>
);

// ============================================
// DEMO / PREVIEW COMPONENT
// ============================================

const FurnaceLogUIDemo = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [toggleChecked, setToggleChecked] = useState(true);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-[#C94A06]">FurnaceLog UI Components</h2>
          
          {/* Buttons */}
          <Card className="mb-6">
            <CardHeader title="Buttons" subtitle="Various button styles and sizes" />
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </Card>

          {/* Inputs */}
          <Card className="mb-6">
            <CardHeader title="Form Elements" subtitle="Inputs, selects, and toggles" />
            <div className="grid md:grid-cols-2 gap-6">
              <Input label="Email Address" placeholder="you@example.com" />
              <Input label="Password" type="password" placeholder="••••••••" />
              <Select 
                label="Furnace Type" 
                placeholder="Select type..."
                options={[
                  { value: 'gas', label: 'Gas Furnace' },
                  { value: 'oil', label: 'Oil Furnace' },
                  { value: 'electric', label: 'Electric Furnace' },
                ]}
              />
              <div className="flex items-end">
                <Toggle checked={toggleChecked} onChange={() => setToggleChecked(!toggleChecked)} label="Enable notifications" />
              </div>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <StatCard 
              label="Indoor Temperature" 
              value="21" 
              unit="°C" 
              icon="🌡️"
              trend="+2°C"
              trendUp
            />
            <StatCard 
              label="Filter Life" 
              value="45" 
              unit="days"
              icon="🔧"
              trend="-15 days"
            />
            <StatCard 
              label="Energy Usage" 
              value="124" 
              unit="kWh"
              icon="⚡"
            />
          </div>

          {/* Badges */}
          <Card className="mb-6">
            <CardHeader title="Badges" subtitle="Status indicators and labels" />
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </Card>

          {/* Progress */}
          <Card className="mb-6">
            <CardHeader title="Progress Bars" subtitle="Visual progress indicators" />
            <div className="space-y-6">
              <ProgressBar value={75} label="Filter Life" color="primary" />
              <ProgressBar value={45} label="Fuel Level" color="warning" />
              <ProgressBar value={90} label="System Health" color="success" />
            </div>
          </Card>

          {/* Alerts */}
          <Card className="mb-6">
            <CardHeader title="Alerts" subtitle="Notification messages" />
            <div className="space-y-4">
              <Alert variant="primary" title="Maintenance Due">
                Your furnace filter is due for replacement in 5 days.
              </Alert>
              <Alert variant="success" title="System Updated">
                Firmware has been successfully updated to v2.4.1
              </Alert>
              <Alert variant="warning" title="Low Fuel">
                Fuel level is below 25%. Consider scheduling a refill.
              </Alert>
            </div>
          </Card>

          {/* Tabs */}
          <Card className="mb-6">
            <CardHeader title="Tabs" subtitle="Tabbed navigation" />
            <Tabs 
              tabs={[
                { id: 'overview', label: 'Overview' },
                { id: 'schedule', label: 'Schedule' },
                { id: 'history', label: 'History' },
                { id: 'settings', label: 'Settings' },
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
            <div className="py-6 text-gray-400">
              Content for "{activeTab}" tab goes here.
            </div>
          </Card>

          {/* Modal Trigger */}
          <Card>
            <CardHeader title="Modal" subtitle="Dialog windows" />
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          </Card>

          {/* Modal */}
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Schedule Maintenance"
            footer={
              <>
                <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button variant="primary">Confirm</Button>
              </>
            }
          >
            <div className="space-y-4">
              <Input label="Date" type="date" />
              <Textarea label="Notes" placeholder="Any special instructions..." />
            </div>
          </Modal>

        </section>
      </div>
    </div>
  );
};

export default FurnaceLogUIDemo;
