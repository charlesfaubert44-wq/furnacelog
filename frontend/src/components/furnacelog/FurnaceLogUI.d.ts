import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string; label: string }>;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export interface ToggleProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

export interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'danger' | 'primary';
  title?: string;
  onClose?: () => void;
}

export interface HeaderProps {
  logo?: React.ReactNode;
  navItems?: Array<{ href: string; label: string; active?: boolean }>;
  actions?: React.ReactNode;
}

export interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: string | number;
}

export interface TableProps {
  columns: Array<{
    header: string;
    accessor?: string;
    render?: (row: any) => React.ReactNode;
  }>;
  data: any[];
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export interface TabsProps {
  tabs: Array<{ id: string; label: string }>;
  activeTab: string;
  onChange: (id: string) => void;
}

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
}

export interface TooltipProps {
  children: React.ReactNode;
  text: string;
}

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export interface DividerProps {
  label?: string;
}

export const Button: React.FC<ButtonProps>;
export const Card: React.FC<CardProps>;
export const CardHeader: React.FC<CardHeaderProps>;
export const StatCard: React.FC<StatCardProps>;
export const Input: React.FC<InputProps>;
export const Select: React.FC<SelectProps>;
export const Textarea: React.FC<TextareaProps>;
export const Toggle: React.FC<ToggleProps>;
export const Badge: React.FC<BadgeProps>;
export const ProgressBar: React.FC<ProgressBarProps>;
export const Alert: React.FC<AlertProps>;
export const Header: React.FC<HeaderProps>;
export const SidebarItem: React.FC<SidebarItemProps>;
export const Table: React.FC<TableProps>;
export const Modal: React.FC<ModalProps>;
export const Tabs: React.FC<TabsProps>;
export const Avatar: React.FC<AvatarProps>;
export const Tooltip: React.FC<TooltipProps>;
export const Skeleton: React.FC<SkeletonProps>;
export const EmptyState: React.FC<EmptyStateProps>;
export const Divider: React.FC<DividerProps>;

declare const FurnaceLogUIDemo: React.FC;
export default FurnaceLogUIDemo;
