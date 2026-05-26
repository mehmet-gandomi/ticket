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
  firstMessageId?: string;
}

export interface Attachment {
  id: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface Message {
  id: string;
  ticketId: string;
  authorType: 'user' | 'support' | 'system';
  authorName: string;
  body: string;
  createdAt: string;
  attachments: Attachment[];
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
  attachments: Attachment[];
}

export interface Category {
  id: string;
  title: string;
  description: string;
  count: number;
}

export const ticketsApi = {
  categories(): Promise<Category[]> {
    return api.get('/categories');
  },

  list(page = 1, perPage = 20, status = ''): Promise<TicketListResponse> {
    const q = new URLSearchParams({ page: String(page), per_page: String(perPage) });
    if (status) q.set('status', status);
    return api.get(`/tickets?${q}`);
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

  routeToSupport(id: string): Promise<{ messages: Message[] }> {
    return api.post(`/tickets/${id}/route-to-support`, {});
  },

  uploadAttachment(ticketId: string, file: File, messageId?: string): Promise<Attachment> {
    const form = new FormData();
    form.append('file', file);
    if (messageId) form.append('message_id', messageId);
    return api.upload(`/tickets/${ticketId}/attachments`, form);
  },
};
