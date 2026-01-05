'use client';

import { signOut, useSession } from 'next-auth/react';
import styled from 'styled-components';
import { FiLogOut, FiUser } from 'react-icons/fi';

const Header = styled.header`
  background: #0f0f14;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 16px;
    margin-left: 56px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #f2f3f4;
`;

const UserIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #854ce6 0%, #b854e6 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 20px;
  }
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 480px) {
    display: none;
  }
`;

const UserName = styled.span`
  font-weight: 600;
  font-size: 14px;
`;

const UserEmail = styled.span`
  font-size: 12px;
  color: #b1b2b3;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 8px;
  padding: 10px 16px;
  color: #ff6b6b;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 107, 107, 0.2);
  }

  svg {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    
    span {
      display: none;
    }
  }
`;

export default function AdminHeader() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  return (
    
      
        
          <FiUser />
        </UserIcon>
        
          {session?.user?.name || 'Admin'}</UserName>
          {session?.user?.email || 'admin@example.com'}</UserEmail>
        </UserDetails>
      </UserInfo>

      <LogoutButton onClick={handleLogout}>
        <FiLogOut />
        Logout</span>
      </LogoutButton>
    </Header>
  );
}

