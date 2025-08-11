import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, Mail, Calendar } from 'lucide-react';

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const LastUpdated = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
`;

const Section = styled(motion.section)`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SectionContent = styled.div`
  color: #4b5563;
  line-height: 1.7;
  
  p {
    margin-bottom: 1rem;
  }
  
  ul {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
`;

const HighlightBox = styled.div`
  background: #dbeafe;
  border: 1px solid #3b82f6;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const HighlightIcon = styled.div`
  color: #3b82f6;
  margin-top: 0.125rem;
`;

export const PrivacyPage: React.FC = () => {
  return (
    <Container>
      <Header>
        <Title>Privacy Policy</Title>
        <LastUpdated>
          <Calendar size={16} />
          Last updated: December 2024
        </LastUpdated>
      </Header>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <SectionTitle>
          <Shield size={20} />
          Our Commitment to Privacy
        </SectionTitle>
        <SectionContent>
          <HighlightBox>
            <HighlightIcon>
              <Shield size={20} />
            </HighlightIcon>
            <div>
              <strong>Your privacy is important to us.</strong> This Privacy Policy explains how StackTrek collects, uses, and protects your information when you use our platform.
            </div>
          </HighlightBox>
          <p>
            We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy or our practices with regard to your personal information, please contact us.
          </p>
        </SectionContent>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <SectionTitle>
          <Database size={20} />
          Information We Collect
        </SectionTitle>
        <SectionContent>
          <p>We collect information you provide directly to us, such as when you:</p>
          <ul>
            <li>Create an account</li>
            <li>Complete tutorials and challenges</li>
            <li>Participate in leaderboards</li>
            <li>Contact us for support</li>
          </ul>
          <p>This information may include:</p>
          <ul>
            <li><strong>Account Information:</strong> Username, email address, profile picture</li>
            <li><strong>Learning Progress:</strong> Completed tutorials, XP earned, achievements unlocked</li>
            <li><strong>Usage Data:</strong> How you interact with our platform, time spent on tutorials</li>
            <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
          </ul>
        </SectionContent>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <SectionTitle>
          <Eye size={20} />
          How We Use Your Information
        </SectionTitle>
        <SectionContent>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Track your learning progress and achievements</li>
            <li>Personalize your learning experience</li>
            <li>Generate leaderboards and statistics</li>
            <li>Send you updates about new features and content</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Analyze usage patterns to improve our platform</li>
          </ul>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
          </p>
        </SectionContent>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <SectionTitle>
          <Lock size={20} />
          Data Security
        </SectionTitle>
        <SectionContent>
          <p>
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
          <p>These measures include:</p>
          <ul>
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments and updates</li>
            <li>Access controls and authentication</li>
            <li>Secure hosting infrastructure</li>
          </ul>
          <p>
            However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
          </p>
        </SectionContent>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <SectionTitle>
          <Database size={20} />
          Data Retention
        </SectionTitle>
        <SectionContent>
          <p>
            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
          </p>
          <p>
            When we no longer need your personal information, we will securely delete or anonymize it.
          </p>
        </SectionContent>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <SectionTitle>
          <Shield size={20} />
          Your Rights
        </SectionTitle>
        <SectionContent>
          <p>Depending on your location, you may have the following rights regarding your personal information:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
            <li><strong>Portability:</strong> Request transfer of your data to another service</li>
            <li><strong>Objection:</strong> Object to certain processing of your personal information</li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information provided below.
          </p>
        </SectionContent>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <SectionTitle>
          <Eye size={20} />
          Cookies and Tracking
        </SectionTitle>
        <SectionContent>
          <p>
            We use cookies and similar tracking technologies to enhance your experience on our platform. Cookies help us:
          </p>
          <ul>
            <li>Remember your preferences and settings</li>
            <li>Keep you logged in</li>
            <li>Analyze how you use our platform</li>
            <li>Improve our services</li>
          </ul>
          <p>
            You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our platform.
          </p>
        </SectionContent>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <SectionTitle>
          <Mail size={20} />
          Contact Us
        </SectionTitle>
        <SectionContent>
          <p>
            If you have any questions about this Privacy Policy or our privacy practices, please contact us:
          </p>
          <p>
            <strong>Email:</strong> privacy@stacktrek.dev<br />
            <strong>Address:</strong> StackTrek Privacy Team<br />
            123 Developer Street, Code City, CC 12345
          </p>
          <p>
            We will respond to your inquiry within 30 days.
          </p>
        </SectionContent>
      </Section>
    </Container>
  );
};
