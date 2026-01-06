"use client";

import { SessionProvider } from "next-auth/react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import styled from "styled-components";

const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #0a0a0f;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export default function AdminLayout({ children }) {
  return (
    <SessionProvider>
      <AdminContainer>
        <AdminSidebar />
        <MainContent>
          <AdminHeader />
          <ContentArea>{children}</ContentArea>
        </MainContent>
      </AdminContainer>
    </SessionProvider>
  );
}
