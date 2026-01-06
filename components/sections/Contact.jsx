"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPen,
  FaPaperPlane,
  FaCheckCircle,
} from "react-icons/fa";
import { MdSubject } from "react-icons/md";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  align-items: center;
  @media screen and (max-width: 960px) {
    padding: 0px;
  }
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1100px;
  gap: 12px;
  @media screen and (max-width: 960px) {
    flex-direction: column;
  }
`;

const Title = styled.div`
  font-size: 52px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  color: ${({ theme }) => theme.text_primary};
  @media screen and (max-width: 960px) {
    margin-top: 12px;
    font-size: 32px;
  }
`;

const Desc = styled.div`
  font-size: 18px;
  text-align: center;
  max-width: 600px;
  color: ${({ theme }) => theme.text_secondary};
  @media screen and (max-width: 960px) {
    font-size: 16px;
  }
`;

const ContactForm = styled.form`
  width: 95%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  background-color: rgba(17, 25, 40, 0.83);
  border: 1px solid rgba(255, 255, 255, 0.125);
  padding: 32px;
  border-radius: 12px;
  box-shadow: rgba(23, 92, 230, 0.1) 0px 4px 24px;
  margin-top: 28px;
  gap: 16px;
  backdrop-filter: blur(10px);
`;

const ContactTitle = styled.div`
  font-size: 28px;
  margin-bottom: 6px;
  font-weight: 600;
  color: ${({ theme }) => theme.white};
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 14px;
  left: 14px;
  color: ${({ theme }) => theme.white + 80};
  z-index: 1;
`;

const ContactInput = styled.input`
  width: 100%;
  background-color: transparent;
  border: 1px solid
    ${({ theme, error }) => (error ? "#ff6b6b" : theme.text_secondary + 50)};
  outline: none;
  font-size: 16px;
  color: ${({ theme }) => theme.white};
  border-radius: 12px;
  padding: 12px 16px 12px 42px;
  transition: all 0.3s ease;

  &:focus {
    border: 1px solid
      ${({ theme, error }) => (error ? "#ff6b6b" : theme.primary)};
    box-shadow: 0 0 0 2px
      ${({ theme, error }) =>
        error ? "rgba(255, 107, 107, 0.2)" : theme.primary + "33"};
  }
  &::placeholder {
    color: ${({ theme }) => theme.text_secondary + 80};
  }
`;

const ContactInputMessage = styled.textarea`
  width: 100%;
  background-color: transparent;
  border: 1px solid
    ${({ theme, error }) => (error ? "#ff6b6b" : theme.text_secondary + 50)};
  outline: none;
  font-size: 16px;
  color: ${({ theme }) => theme.white};
  border-radius: 12px;
  padding: 12px 16px 12px 42px;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 120px;

  &:focus {
    border: 1px solid
      ${({ theme, error }) => (error ? "#ff6b6b" : theme.primary)};
    box-shadow: 0 0 0 2px
      ${({ theme, error }) =>
        error ? "rgba(255, 107, 107, 0.2)" : theme.primary + "33"};
  }
  &::placeholder {
    color: ${({ theme }) => theme.text_secondary + 80};
  }
`;

const ContactButton = styled(motion.button)`
  width: 100%;
  text-decoration: none;
  text-align: center;
  background: linear-gradient(
    225deg,
    hsla(271, 100%, 50%, 1) 0%,
    hsla(294, 100%, 50%, 1) 100%
  );
  padding: 14px 16px;
  margin-top: 8px;
  border-radius: 12px;
  border: none;
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled(motion.span)`
  color: #ff6b6b;
  font-size: 12px;
  margin-top: -12px;
  margin-left: 4px;
  display: block;
`;

const SuccessMessage = styled(motion.div)`
  color: #51cf66;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(81, 207, 102, 0.1);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #51cf66;
`;

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        reset();
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container id="Contact">
      <Wrapper>
        <Title>Contact</Title>
        <Desc style={{ marginBottom: "40px" }}>
          Feel free to reach out to me for any questions or opportunities!
        </Desc>
        <ContactForm onSubmit={handleSubmit(onSubmit)}>
          <ContactTitle>Email Me 🚀</ContactTitle>

          <InputWrapper>
            <IconWrapper>
              <FaUser />
            </IconWrapper>
            <ContactInput
              placeholder="Your Name"
              error={errors.name}
              {...register("name")}
            />
          </InputWrapper>
          <AnimatePresence>
            {errors.name && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {errors.name.message}
              </ErrorMessage>
            )}
          </AnimatePresence>

          <InputWrapper>
            <IconWrapper>
              <FaEnvelope />
            </IconWrapper>
            <ContactInput
              placeholder="Your Email"
              type="email"
              error={errors.email}
              {...register("email")}
            />
          </InputWrapper>
          <AnimatePresence>
            {errors.email && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {errors.email.message}
              </ErrorMessage>
            )}
          </AnimatePresence>

          <InputWrapper>
            <IconWrapper>
              <MdSubject size={20} />
            </IconWrapper>
            <ContactInput
              placeholder="Subject"
              error={errors.subject}
              {...register("subject")}
            />
          </InputWrapper>
          <AnimatePresence>
            {errors.subject && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {errors.subject.message}
              </ErrorMessage>
            )}
          </AnimatePresence>

          <InputWrapper>
            <IconWrapper style={{ top: "14px" }}>
              <FaPen />
            </IconWrapper>
            <ContactInputMessage
              placeholder="Message"
              rows={4}
              error={errors.message}
              {...register("message")}
            />
          </InputWrapper>
          <AnimatePresence>
            {errors.message && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {errors.message.message}
              </ErrorMessage>
            )}
          </AnimatePresence>

          <ContactButton
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              "Sending..."
            ) : (
              <>
                Send Message <FaPaperPlane />
              </>
            )}
          </ContactButton>

          <AnimatePresence>
            {submitSuccess && (
              <SuccessMessage
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <FaCheckCircle /> Message sent successfully!
              </SuccessMessage>
            )}
          </AnimatePresence>
        </ContactForm>
      </Wrapper>
    </Container>
  );
};

export default Contact;
