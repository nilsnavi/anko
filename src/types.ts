import { LucideIcon } from "lucide-react";

// Navigation Types
export interface NavItem {
  label: string;
  path: string;
}

// Service Types
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  details?: string[];
}

// Team Types
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  imageUrl: string;
}

// News Types
export type NewsCategory = 'News' | 'Analytics' | 'Event';

export interface NewsItem {
  id: number;
  date: string;
  title: string;
  summary: string;
  category: NewsCategory;
}

// FAQ Types
export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

// Client Types
export type ClientStatus = 'active' | 'inactive';

export interface Client {
  id: number;
  name: string;
  email: string;
  company: string;
  status: ClientStatus;
}

// Inquiry Types
export type InquiryStatus = 'pending' | 'read' | 'replied';

export interface Inquiry {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  subject: string;
  message: string;
  date: string;
  status: InquiryStatus;
}

// Auth Types
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// API Response Types
export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

// Form Types
export interface ContactFormData {
  name: string;
  phone?: string;
  email?: string;
  subject: string;
  message: string;
}

// Media Types
export interface MediaFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
