'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import {
  FiHome,
  FiUser,
  FiAward,
  FiBriefcase,
  FiBook,
  FiFolder,
  FiMenu,
  FiX,
} from 'react-icons/fi';

const SidebarContainer = styled.aside<{ $isOpen: boolean }>`
  width: 260px;
  background: #0f0f14;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
    transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
  }
`;

const Logo = styled.div`
  padding: 24px;
  font-size: 24px;
  font-weight: 700;
  color: #854ce6;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Nav = styled.nav`
  flex: 1;
  padding: 16px 0;
`;

const NavItem = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  color: ${({ $active }) => ($active ? '#854ce6' : '#b1b2b3')};
  background: ${({ $active }) => ($active ? 'rgba(133, 76, 230, 0.1)' : 'transparent')};
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid ${({ $active }) => ($active ? '#854ce6' : 'transparent')};

  &:hover {
    background: rgba(133, 76, 230, 0.05);
    color: #854ce6;
  }

  svg {
    font-size: 20px;
  }
`;

const MobileToggle = styled.button`
  display: none;
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 1001;
  background: #854ce6;
  border: none;
  border-radius: 8px;
  padding: 12px;
  color: white;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }

  svg {
    font-size: 24px;
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`;

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: FiHome },
  { href: '/admin/bio', label: 'Bio / Profile', icon: FiUser },
  { href: '/admin/skills', label: 'Skills', icon: FiAward },
  { href: '/admin/experience', label: 'Experience', icon: FiBriefcase },
  { href: '/admin/education', label: 'Education', icon: FiBook },
  { href: '/admin/projects', label: 'Projects', icon: FiFolder },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <MobileToggle onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FiX /> : <FiMenu />}
      </MobileToggle>

      <Overlay $isOpen={isOpen} onClick={() => setIsOpen(false)} />

      <SidebarContainer $isOpen={isOpen}>
        <Logo>Portfolio Admin</Logo>
        <Nav>
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              $active={pathname === item.href}
              onClick={() => setIsOpen(false)}
            >
              <item.icon />
              {item.label}
            </NavItem>
          ))}
        </Nav>
      </SidebarContainer>
    </>
  );
}
