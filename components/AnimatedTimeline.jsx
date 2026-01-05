"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import styled from "styled-components";
import { FaRocket } from "react-icons/fa";

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  max-width: 100%;
  margin: 40px auto;
  padding: 20px 0;

  &::before {
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);

    @media (max-width: 768px) {
      left: 20px;
    }
  }
`;

const ProgressBar = styled(motion.div)`
  position: absolute;
  left: 50%;
  margin-left: -1px;
  width: 2px;
  height: 100%;
  background: ${({ theme }) => theme.primary};
  transform-origin: top center;
  z-index: 10;

  @media (max-width: 768px) {
    left: 20px;
    margin-left: 0;
  }
`;

const RocketContainer = styled(motion.div)`
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;

  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    left: 20px;
  }
`;

const TimelineItem = styled(motion.div)`
  display: flex;
  justify-content: ${({ index }) =>
    index % 2 === 0 ? "flex-end" : "flex-start"};
  padding: 0 40px;
  margin-bottom: 60px;
  position: relative;
  width: 50%;
  align-self: ${({ index }) => (index % 2 === 0 ? "flex-start" : "flex-end")};

  @media (max-width: 768px) {
    width: 100%;
    align-self: flex-start;
    justify-content: flex-start;
    padding-left: 60px;
    padding-right: 0;
  }
`;

const Dot = styled(motion.div)`
  position: absolute;
  top: 0;
  left: ${({ index }) => (index % 2 === 0 ? "auto" : "-9px")};
  right: ${({ index }) => (index % 2 === 0 ? "-9px" : "auto")};
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${({ theme }) => theme.primary};
  border: 4px solid #171721;
  box-shadow: 0 0 10px ${({ theme }) => theme.primary};
  z-index: 10;
  cursor: pointer;

  @media (max-width: 768px) {
    left: 11px;
    right: auto;
  }
`;

const Content = styled(motion.div)`
  background: rgba(17, 25, 40, 0.83);
  border: 1px solid rgba(255, 255, 255, 0.125);
  box-shadow: rgba(23, 92, 230, 0.15) 0px 4px 24px;
  border-radius: 12px;
  padding: 24px;
  max-width: 100%;
  width: 100%;
  position: relative;

  &:hover {
    border: 1px solid ${({ theme }) => theme.primary};
    transform: translateY(-5px);
    transition: all 0.3s ease;
  }

  &::after {
    content: "";
    position: absolute;
    top: 6px;
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;

    ${({ index }) =>
      index % 2 === 0
        ? `
      right: -10px;
      border-left: 10px solid rgba(17, 25, 40, 0.83);
    `
        : `
      left: -10px;
      border-right: 10px solid rgba(17, 25, 40, 0.83);
    `}

    @media (max-width: 768px) {
      left: -10px;
      border-right: 10px solid rgba(17, 25, 40, 0.83);
      border-left: none;
      right: auto;
    }
  }
`;

const AnimatedTimeline = ({ items, children }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const rocketTop = useTransform(scaleY, [0, 1], ["0%", "100%"]);

  return (
    <TimelineContainer ref={ref}>
      <ProgressBar style={{ scaleY }} />
      <RocketContainer style={{ top: rocketTop }}>
        <FaRocket size={24} style={{ transform: "rotate(135deg)" }} />
      </RocketContainer>
      {items.map((item, index) => (
        <TimelineItem
          key={index}
          index={index}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: false, amount: 0.2 }}
        >
          <Dot
            index={index}
            whileHover={{ scale: 1.5 }}
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(133, 76, 230, 0.7)",
                "0 0 0 10px rgba(133, 76, 230, 0)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
          <Content index={index}>
            {React.cloneElement(children(item), { isTimeline: true })}
          </Content>
        </TimelineItem>
      ))}
    </TimelineContainer>
  );
};

export default AnimatedTimeline;
