import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { BookOpen, Code, Users, Zap, Heart, Github, Mail, Globe } from 'lucide-react';

const Container = styled.div`
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Section = styled(motion.section)`
  margin-bottom: 3rem;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const SectionTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SectionContent = styled.div`
  color: #4b5563;
  line-height: 1.7;
  font-size: 1rem;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const FeatureCard = styled.div`
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
`;

const FeatureIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const InfoItem = styled.div`
  padding: 1rem;
  background: #f1f5f9;
  border-radius: 0.5rem;
  text-align: center;
`;

const InfoLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
`;

const ContactIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: #6366f1;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

export const AboutPage: React.FC = () => {
  return (
    <Container>
      <Header>
        <Title>About StackTrek</Title>
        <Subtitle>
          Empowering developers to master data structures and algorithms through interactive learning and gamified experiences.
        </Subtitle>
      </Header>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <SectionTitle>
          <BookOpen size={24} />
          Our Mission
        </SectionTitle>
        <SectionContent>
          <p>
            StackTrek is designed to make learning data structures and algorithms engaging, interactive, and accessible to developers of all skill levels.
            We believe that understanding these fundamental concepts shouldn't be boring or overwhelming.
          </p>
          <p style={{ marginTop: '1rem' }}>
            Through gamification, interactive visualizations, and step-by-step tutorials, we transform complex computer science concepts
            into enjoyable learning experiences that stick with you long after you've completed them.
          </p>
        </SectionContent>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <SectionTitle>
          <Zap size={24} />
          Key Features
        </SectionTitle>
        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon>
              <Code size={20} />
            </FeatureIcon>
            <FeatureTitle>Interactive Visualizations</FeatureTitle>
            <FeatureDescription>
              See data structures come to life with animated, hands-on demonstrations that make abstract concepts concrete.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>
              <BookOpen size={20} />
            </FeatureIcon>
            <FeatureTitle>Step-by-Step Tutorials</FeatureTitle>
            <FeatureDescription>
              Follow guided learning paths with clear explanations, code examples, and practical exercises.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>
              <Users size={20} />
            </FeatureIcon>
            <FeatureTitle>Gamified Learning</FeatureTitle>
            <FeatureDescription>
              Earn XP, unlock achievements, and compete on leaderboards while mastering essential programming concepts.
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>
              <Heart size={20} />
            </FeatureIcon>
            <FeatureTitle>Beginner Friendly</FeatureTitle>
            <FeatureDescription>
              No prior knowledge required. Start from the basics and gradually build up to advanced topics.
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <SectionTitle>
          <Globe size={24} />
          Platform Information
        </SectionTitle>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>Version</InfoLabel>
            <InfoValue>1.0.0</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Last Updated</InfoLabel>
            <InfoValue>August 2025</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Built With</InfoLabel>
            <InfoValue>React + TypeScript</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>License</InfoLabel>
            <InfoValue>MIT</InfoValue>
          </InfoItem>
        </InfoGrid>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <SectionTitle>
          <Mail size={24} />
          Contact & Support
        </SectionTitle>
        <SectionContent>
          <ContactInfo>
            <ContactIcon>
              <Github size={16} />
            </ContactIcon>
            <div>
              <div style={{ fontWeight: '600', color: '#1a1a1a' }}>GitHub Repository</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>github.com/stacktrek/stacktrek</div>
            </div>
          </ContactInfo>
          <ContactInfo>
            <ContactIcon>
              <Mail size={16} />
            </ContactIcon>
            <div>
              <div style={{ fontWeight: '600', color: '#1a1a1a' }}>Support Email</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>support@stacktrek.dev</div>
            </div>
          </ContactInfo>
          <ContactInfo>
            <ContactIcon>
              <Globe size={16} />
            </ContactIcon>
            <div>
              <div style={{ fontWeight: '600', color: '#1a1a1a' }}>Website</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>www.stacktrek.dev</div>
            </div>
          </ContactInfo>
        </SectionContent>
      </Section>
    </Container>
  );
};
