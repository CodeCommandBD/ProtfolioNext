"use client";

import React from "react";
import styled, { useTheme } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { toggleMobileMenu } from "@/lib/redux/slices/uiSlice";
import { MenuRounded } from "@mui/icons-material";
import ThemeToggle from "./ThemeToggle";

const Nav = styled.div`
  background-color: ${({ theme }) => theme.bg};
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
  color: white;
`;

const NavbarContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
`;

const NavLogo = styled.div`
  width: 80%;
  font-size: 18px;
  font-weight: 500;
  padding: 0 6px;
  color: ${({ theme }) => theme.text_primary};
  cursor: pointer;
`;

const NavItems = styled.ul`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 0 6px;
  list-style: none;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  cursor: pointer;
  transition: 0.5s ease-in-out;
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const ButtonContainer = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 16px;
  padding: 0 6px;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const ResumeButton = styled.a`
  border: 1px solid ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primary};
  justify-content: center;
  display: flex;
  align-items: center;
  border-radius: 20px;
  cursor: pointer;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  transition: 0.5s ease-in-out;
  text-decoration: none;
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.text_primary};
  }
`;

const MobileIcon = styled.div`
  color: ${({ theme }) => theme.text_primary};
  height: 100%;
  display: flex;
  align-items: center;
  display: none;
  @media screen and (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 16px;
  padding: 0 6px;
  list-style: none;
  padding: 12px 40px 24px 40px;
  background: ${({ theme }) => theme.card_light + 99};
  position: absolute;
  top: 80px;
  right: 0;
  transform: ${({ $isOpen }) =>
    $isOpen ? "translateY(0)" : "translateY(-100%)"};
  border-radius: 0 0 20px 20px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  opacity: ${({ $isOpen }) => ($isOpen ? "100%" : "0")};
  z-index: ${({ $isOpen }) => ($isOpen ? "1000" : "-1000")};
  transition: 0.5s ease-in-out;
`;

const Navbar = ({ bio }) => {
  const dispatch = useDispatch();
  const { isMobileMenuOpen } = useSelector((state) => state.ui);
  const theme = useTheme();
  const resumeUrl = bio?.resume || null;

  return (
    <Nav>
      <NavbarContainer>
        <NavLogo
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          {bio?.name?.split(" ")[0] || "PORTFOLIO"}
        </NavLogo>
        <MobileIcon onClick={() => dispatch(toggleMobileMenu())}>
          <MenuRounded style={{ color: "inherit" }} />
        </MobileIcon>

        <NavItems>
          <NavLink href="#About">About</NavLink>
          <NavLink href="#Skills">Skills</NavLink>
          <NavLink href="#Experience">Experience</NavLink>
          <NavLink href="#Project">Project</NavLink>
          <NavLink href="#Education">Education</NavLink>
        </NavItems>

        {isMobileMenuOpen && (
          <MobileMenu $isOpen={isMobileMenuOpen}>
            <NavLink onClick={() => dispatch(toggleMobileMenu())} href="#About">
              About
            </NavLink>
            <NavLink
              onClick={() => dispatch(toggleMobileMenu())}
              href="#Skills"
            >
              Skills
            </NavLink>
            <NavLink
              onClick={() => dispatch(toggleMobileMenu())}
              href="#Experience"
            >
              Experience
            </NavLink>
            <NavLink
              onClick={() => dispatch(toggleMobileMenu())}
              href="#Project"
            >
              Project
            </NavLink>
            <NavLink onClick={() => setIsOpen(!isOpen)} href="#Education">
              Education
            </NavLink>
            <div style={{ marginTop: "8px" }}>
              <ThemeToggle />
            </div>
            {resumeUrl && (
              <ResumeButton
                href={resumeUrl}
                download="Resume.pdf"
                style={{
                  background: theme.primary,
                  color: theme.text_primary,
                }}
              >
                Download Resume
              </ResumeButton>
            )}
          </MobileMenu>
        )}

        <ButtonContainer>
          <ThemeToggle />
          {resumeUrl && (
            <ResumeButton href={resumeUrl} download="Resume.pdf">
              Download Resume
            </ResumeButton>
          )}
        </ButtonContainer>
      </NavbarContainer>
    </Nav>
  );
};

export default Navbar;
