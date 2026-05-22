import { api } from './client';

export interface Ticket {
  id: string;
  userId: number;
  userName: string | null;
  title: string;
  status: 'pending' | 'answered' | 'closed';
  adminState: string;
  priority: 'low' | 'medium' | 'high';
  categoryId: number | null;
  categoryTitle: string | null;
  aiStatus: 'none' | 'done' | 'failed';
  aiSuggestion: string | null;
  aiResolved: boolean;
  preview: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  ticketId: string;
  authorType: 'user' | 'support';
  authorName: string;
  body: string;
  createdAt: string;
}

export interface TicketListResponse {
  items: Ticket[];
  total: number;
  page: number;
  total_pages: number;
}

export interface TicketDetailResponse {
  ticket: Ticket;
  messages: Message[];
}

export const ticketsApi = {
  list(page = 1, perPage = 20): Promise<TicketListResponse> {
    return api.get(`/tickets?page=${page}&per_page=${perPage}`);
  },

  create(payload: { title: string; body: string; priority: string; category_id?: number | null }): Promise<Ticket> {
    return api.post('/tickets', payload);
  },

  detail(id: string): Promise<TicketDetailResponse> {
    return api.get(`/tickets/${id}`);
  },

  sendMessage(id: string, body: string): Promise<{ messages: Message[] }> {
    return api.post(`/tickets/${id}/messages`, { body });
  },

  aiResolve(id: string): Promise<Ticket> {
    return api.post(`/tickets/${id}/ai-resolve`, {});
  },
};
