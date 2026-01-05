"use client";

import React from "react";
import styled from "styled-components";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaInstagram,
} from "react-icons/fa";

const FooterContainer = styled.div`
  width: 100%;
  padding: 2rem 0;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1;
`;

const FooterWrapper = styled.footer`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: center;
  padding: 1rem;
  color: ${({ theme }) => theme.text_primary};
`;

const Logo = styled.div`
  font-weight: 600;
  font-size: 20px;
  color: ${({ theme }) => theme.primary};
`;

const Nav = styled.nav`
  width: 100%;
  max-width: 800px;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: row;
  gap: 2rem;
  justify-content: center;
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    text-align: center;
    font-size: 12px;
  }
`;

const NavLink = styled.a`
  color: ${({ theme }) => theme.text_primary};
  text-decoration: none;
  font-size: 1.2rem;
  transition: color 0.2s ease-in-out;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const SocialMediaIcons = styled.div`
  display: flex;
  margin-top: 1rem;
`;

const SocialMediaIcon = styled.a`
  display: inline-block;
  margin: 0 1rem;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text_primary};
  transition: color 0.2s ease-in-out;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const Copyright = styled.p`
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text_secondary};
  text-align: center;
`;

const Footer = ({ bio }) => {
  return (
    <FooterContainer>
      <FooterWrapper>
        <Logo>{bio?.name?.split(" ")[0] || "Portfolio"}</Logo>
        <Nav>
          <NavLink href="#About">About</NavLink>
          <NavLink href="#Skills">Skills</NavLink>
          <NavLink href="#Experience">Experience</NavLink>
          <NavLink href="#Project">Projects</NavLink>
          <NavLink href="#Education">Education</NavLink>
        </Nav>
        <SocialMediaIcons>
          {bio?.facebook && (
            <SocialMediaIcon href={bio.facebook} target="_blank">
              <FaFacebook />
            </SocialMediaIcon>
          )}
          {bio?.twitter && (
            <SocialMediaIcon href={bio.twitter} target="_blank">
              <FaTwitter />
            </SocialMediaIcon>
          )}
          {bio?.linkedin && (
            <SocialMediaIcon href={bio.linkedin} target="_blank">
              <FaLinkedin />
            </SocialMediaIcon>
          )}
          {bio?.insta && (
            <SocialMediaIcon href={bio.insta} target="_blank">
              <FaInstagram />
            </SocialMediaIcon>
          )}
          {bio?.github && (
            <SocialMediaIcon href={bio.github} target="_blank">
              <FaGithub />
            </SocialMediaIcon>
          )}
        </SocialMediaIcons>
        <Copyright>
          &copy; {new Date().getFullYear()} {bio?.name || "Portfolio"}. All
          rights reserved.
        </Copyright>
      </FooterWrapper>
    </FooterContainer>
  );
};

export default Footer;
