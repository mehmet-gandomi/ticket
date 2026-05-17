import { Routes, Route, Navigate } from 'react-router-dom';
import { TicketListPage } from './pages/TicketListPage';
import { TicketNewPage } from './pages/TicketNewPage';
import { TicketChatPage } from './pages/TicketChatPage';
import { TicketLoadingPage } from './pages/TicketLoadingPage';
import { TicketAiShowPage } from './pages/TicketAiShowPage';
import { TicketNotFoundPage } from './pages/TicketNotFoundPage';
import { AdminTicketListPage } from './pages/AdminTicketListPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';
import { Layout } from './components/Sidebar';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/tickets" replace />} />
        <Route path="/tickets" element={<TicketListPage />} />
        <Route path="/tickets/new" element={<TicketNewPage />} />
        <Route path="/tickets/loading" element={<TicketLoadingPage />} />
        <Route path="/tickets/ai-show" element={<TicketAiShowPage />} />
        <Route path="/tickets/not-found" element={<TicketNotFoundPage />} />
        <Route path="/tickets/:id" element={<TicketChatPage />} />
        <Route path="/admin/tickets" element={<AdminTicketListPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
        <Route path="*" element={<Navigate to="/tickets" replace />} />
      </Routes>
    </Layout>
  );
}
