import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { ServiceItem, TeamMember, NewsItem, FAQItem, Client, Inquiry } from '../types';

interface DataContextType {
  services: ServiceItem[];
  team: TeamMember[];
  news: NewsItem[];
  faq: FAQItem[];
  clients: Client[];
  inquiries: Inquiry[];
  loading: boolean;
  updateService: (id: string, updated: Partial<ServiceItem>) => Promise<void>;
  updateTeamMember: (id: number, updated: Partial<TeamMember>) => Promise<void>;
  addTeamMember: (item: Omit<TeamMember, 'id'>) => Promise<void>;
  deleteTeamMember: (id: number) => Promise<void>;
  updateNews: (id: number, updated: Partial<NewsItem>) => Promise<void>;
  updateFAQ: (id: number, updated: Partial<FAQItem>) => Promise<void>;
  addNews: (item: Omit<NewsItem, 'id'>) => Promise<void>;
  deleteNews: (id: number) => Promise<void>;
  addFAQ: (item: Omit<FAQItem, 'id'>) => Promise<void>;
  deleteFAQ: (id: number) => Promise<void>;
  addInquiry: (item: Omit<Inquiry, 'id' | 'date' | 'status'>) => Promise<number>;
  addClient: (item: Omit<Client, 'id'>) => Promise<void>;
  updateClient: (id: number, updated: Partial<Client>) => Promise<void>;
  deleteClient: (id: number) => Promise<void>;
  loadProtectedData: (token: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_CONTENT_URL = `${API_BASE_URL}/api/content`;

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [faq, setFaq] = useState<FAQItem[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [servicesRes, teamRes, newsRes, faqRes] = await Promise.all([
          axios.get<ServiceItem[]>(`${API_CONTENT_URL}/services`),
          axios.get<TeamMember[]>(`${API_CONTENT_URL}/team`),
          axios.get<NewsItem[]>(`${API_CONTENT_URL}/news`),
          axios.get<FAQItem[]>(`${API_CONTENT_URL}/faq`)
        ]);

        setServices(servicesRes.data);
        setTeam(teamRes.data);
        setNews(newsRes.data);
        setFaq(faqRes.data);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Load protected data (requires auth)
  const loadProtectedData = async (token: string) => {
    try {
      const [clientsRes, inquiriesRes] = await Promise.all([
        axios.get<Client[]>(`${API_CONTENT_URL}/clients`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get<Inquiry[]>(`${API_CONTENT_URL}/inquiries`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setClients(clientsRes.data);
      setInquiries(inquiriesRes.data);
    } catch (error) {
      console.error('Error loading protected data:', error);
    }
  };

  const updateService = async (id: string, updated: Partial<ServiceItem>) => {
    try {
      const response = await axios.put<ServiceItem>(`${API_CONTENT_URL}/services/${id}`, updated);
      setServices(prev => prev.map(item => item.id === id ? response.data : item));
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  };

  const updateTeamMember = async (id: number, updated: Partial<TeamMember>) => {
    try {
      const response = await axios.put<TeamMember>(`${API_CONTENT_URL}/team/${id}`, updated);
      setTeam(prev => prev.map(item => item.id === id ? response.data : item));
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  };

  const addTeamMember = async (item: Omit<TeamMember, 'id'>) => {
    try {
      const response = await axios.post<TeamMember>(`${API_CONTENT_URL}/team`, item);
      setTeam(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  };

  const deleteTeamMember = async (id: number) => {
    try {
      await axios.delete(`${API_CONTENT_URL}/team/${id}`);
      setTeam(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  };

  const updateNews = async (id: number, updated: Partial<NewsItem>) => {
    try {
      const response = await axios.put<NewsItem>(`${API_CONTENT_URL}/news/${id}`, updated);
      setNews(prev => prev.map(item => item.id === id ? response.data : item));
    } catch (error) {
      console.error('Error updating news:', error);
      throw error;
    }
  };

  const addNews = async (item: Omit<NewsItem, 'id'>) => {
    try {
      const response = await axios.post<NewsItem>(`${API_CONTENT_URL}/news`, item);
      setNews(prev => [response.data, ...prev]);
    } catch (error) {
      console.error('Error adding news:', error);
      throw error;
    }
  };

  const deleteNews = async (id: number) => {
    try {
      await axios.delete(`${API_CONTENT_URL}/news/${id}`);
      setNews(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting news:', error);
      throw error;
    }
  };

  const updateFAQ = async (id: number, updated: Partial<FAQItem>) => {
    try {
      const response = await axios.put<FAQItem>(`${API_CONTENT_URL}/faq/${id}`, updated);
      setFaq(prev => prev.map(item => item.id === id ? response.data : item));
    } catch (error) {
      console.error('Error updating FAQ:', error);
      throw error;
    }
  };

  const addFAQ = async (item: Omit<FAQItem, 'id'>) => {
    try {
      const response = await axios.post<FAQItem>(`${API_CONTENT_URL}/faq`, item);
      setFaq(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error adding FAQ:', error);
      throw error;
    }
  };

  const deleteFAQ = async (id: number) => {
    try {
      await axios.delete(`${API_CONTENT_URL}/faq/${id}`);
      setFaq(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      throw error;
    }
  };

  const addInquiry = async (item: Omit<Inquiry, 'id' | 'date' | 'status'>) => {
    try {
      const newInquiry: Omit<Inquiry, 'id'> = {
        ...item,
        date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'pending'
      };

      const response = await axios.post<Inquiry>(`${API_CONTENT_URL}/inquiries`, newInquiry);
      setInquiries(prev => [response.data, ...prev]);
      return response.data.id;
    } catch (error) {
      console.error('Error adding inquiry:', error);
      throw error;
    }
  };

  const addClient = async (item: Omit<Client, 'id'>) => {
    try {
      const response = await axios.post<Client>(`${API_CONTENT_URL}/clients`, item);
      setClients(prev => [response.data, ...prev]);
    } catch (error) {
      console.error('Error adding client:', error);
      throw error;
    }
  };

  const updateClient = async (id: number, updated: Partial<Client>) => {
    try {
      const response = await axios.put<Client>(`${API_CONTENT_URL}/clients/${id}`, updated);
      setClients(prev => prev.map(item => item.id === id ? response.data : item));
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  };

  const deleteClient = async (id: number) => {
    try {
      await axios.delete(`${API_CONTENT_URL}/clients/${id}`);
      setClients(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  };

  const value = {
    services, team, news, faq, clients, inquiries,
    updateService, updateTeamMember, addTeamMember, deleteTeamMember,
    updateNews, addNews, deleteNews,
    updateFAQ, addFAQ, deleteFAQ, addInquiry,
    addClient, updateClient, deleteClient,
    loadProtectedData,
    loading
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};