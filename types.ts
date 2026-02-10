import { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  details?: string[];
}

export interface TeamMember {
  id: number; // Added ID for management
  name: string;
  role: string;
  imageUrl: string;
}

export interface NewsItem {
  id: number;
  date: string;
  title: string;
  summary: string;
  category: 'News' | 'Analytics' | 'Event';
}

export interface FAQItem {
  id: number; // Added ID for management
  question: string;
  answer: string;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  company: string;
  status: 'active' | 'inactive';
}

export interface Inquiry {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  subject: string;
  message: string;
  date: string;
  status: 'pending' | 'read' | 'replied';
}