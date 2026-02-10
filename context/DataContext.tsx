import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SERVICES, TEAM, NEWS, FAQ_DATA, MOCK_CLIENTS, MOCK_INQUIRIES } from '../constants';
import { ServiceItem, TeamMember, NewsItem, FAQItem, Client, Inquiry } from '../types';

interface DataContextType {
  services: ServiceItem[];
  team: TeamMember[];
  news: NewsItem[];
  faq: FAQItem[];
  clients: Client[];
  inquiries: Inquiry[];
  updateService: (id: string, updated: Partial<ServiceItem>) => void;
  updateTeamMember: (id: number, updated: Partial<TeamMember>) => void;
  addTeamMember: (item: Omit<TeamMember, 'id'>) => void;
  deleteTeamMember: (id: number) => void;
  updateNews: (id: number, updated: Partial<NewsItem>) => void;
  updateFAQ: (id: number, updated: Partial<FAQItem>) => void;
  addNews: (item: Omit<NewsItem, 'id'>) => void;
  deleteNews: (id: number) => void;
  addFAQ: (item: Omit<FAQItem, 'id'>) => void;
  deleteFAQ: (id: number) => void;
  addInquiry: (item: Omit<Inquiry, 'id' | 'date' | 'status'>) => number;
  addClient: (item: Omit<Client, 'id'>) => void;
  updateClient: (id: number, updated: Partial<Client>) => void;
  deleteClient: (id: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<ServiceItem[]>(SERVICES);
  const [team, setTeam] = useState<TeamMember[]>(TEAM);
  const [news, setNews] = useState<NewsItem[]>(NEWS);
  const [faq, setFaq] = useState<FAQItem[]>(FAQ_DATA);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [inquiries, setInquiries] = useState<Inquiry[]>(MOCK_INQUIRIES);

  const updateService = (id: string, updated: Partial<ServiceItem>) => {
    setServices(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
  };

  const updateTeamMember = (id: number, updated: Partial<TeamMember>) => {
    setTeam(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
  };

  const addTeamMember = (item: Omit<TeamMember, 'id'>) => {
    // Generate a simple ID
    const newId = team.length > 0 ? Math.max(...team.map(t => t.id)) + 1 : 1;
    setTeam(prev => [...prev, { ...item, id: newId }]);
  };

  const deleteTeamMember = (id: number) => {
    setTeam(prev => prev.filter(item => item.id !== id));
  };

  const updateNews = (id: number, updated: Partial<NewsItem>) => {
    setNews(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
  };

  const addNews = (item: Omit<NewsItem, 'id'>) => {
    const newId = news.length > 0 ? Math.max(...news.map(n => n.id)) + 1 : 1;
    setNews(prev => [{ ...item, id: newId }, ...prev]);
  };

  const deleteNews = (id: number) => {
    setNews(prev => prev.filter(item => item.id !== id));
  };

  const updateFAQ = (id: number, updated: Partial<FAQItem>) => {
    setFaq(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
  };

  const addFAQ = (item: Omit<FAQItem, 'id'>) => {
    const newId = faq.length > 0 ? Math.max(...faq.map(f => f.id)) + 1 : 1;
    setFaq(prev => [...prev, { ...item, id: newId }]);
  };

  const deleteFAQ = (id: number) => {
    setFaq(prev => prev.filter(item => item.id !== id));
  };

  const addInquiry = (item: Omit<Inquiry, 'id' | 'date' | 'status'>) => {
    // Generate accounting-style ID starting from 1001
    const maxId = inquiries.length > 0 ? Math.max(...inquiries.map(i => i.id)) : 1000;
    const newId = maxId + 1;
    
    const newInquiry: Inquiry = {
      ...item,
      id: newId,
      date: new Date().toLocaleDateString('ru-RU', {day: 'numeric', month: 'short', year: 'numeric'}),
      status: 'pending'
    };

    setInquiries(prev => [newInquiry, ...prev]);
    return newId;
  };

  const addClient = (item: Omit<Client, 'id'>) => {
    const newId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1;
    setClients(prev => [{ ...item, id: newId }, ...prev]);
  };

  const updateClient = (id: number, updated: Partial<Client>) => {
    setClients(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
  };

  const deleteClient = (id: number) => {
    setClients(prev => prev.filter(item => item.id !== id));
  };

  return (
    <DataContext.Provider value={{ 
      services, team, news, faq, clients, inquiries,
      updateService, updateTeamMember, addTeamMember, deleteTeamMember,
      updateNews, addNews, deleteNews,
      updateFAQ, addFAQ, deleteFAQ, addInquiry,
      addClient, updateClient, deleteClient
    }}>
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