import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FileText, Calendar, Shield, AlertTriangle } from 'lucide-react';

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
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const HighlightIcon = styled.div`
  color: #f59e0b;
  margin-top: 0.125rem;
`;

export const TermsPage: React.FC = () => {
  return (
    <Container>
      <Header>
        <Title>Terms & Conditions</Title>
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
          <FileText size={20} />
          Agreement to Terms
        </SectionTitle>
        <SectionContent>
          <p>
            By accessing and using StackTrek ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement.
          </p>
          <p>
            If you do not agree to abide by the above, please do not use this service.
          </p>
        </SectionContent>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <SectionTitle>
          <Shield size={20} />
          Use License
        </SectionTitle>
        <SectionContent>
          <p>
            Permission is granted to temporarily download one copy of StackTrek materials for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>modify or copy the materials</li>
            <li>use the materials for any commercial purpose or for any public display</li>
            <li>attempt to reverse engineer any software contained on the platform</li>
            <li>remove any copyright or other proprietary notations from the materials</li>
          </ul>
          <p>
            This license shall automatically terminate if you violate any of these restrictions and may be terminated by StackTrek at any time.
          </p>
        </SectionContent>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <SectionTitle>
          <AlertTriangle size={20} />
          Disclaimer
        </SectionTitle>
        <SectionContent>
          <HighlightBox>
            <HighlightIcon>
              <AlertTriangle size={20} />
            </HighlightIcon>
            <div>
              <strong>Important:</strong> The materials on StackTrek are provided on an 'as is' basis. StackTrek makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </div>
          </HighlightBox>
          <p>
            Further, StackTrek does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
          </p>
        </SectionContent>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <SectionTitle>
          <FileText size={20} />
          User Accounts
        </SectionTitle>
        <SectionContent>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
          </p>
          <p>
            You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>
        </SectionContent>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <SectionTitle>
          <Shield size={20} />
          Prohibited Uses
        </SectionTitle>
        <SectionContent>
          <p>You may not use our platform:</p>
          <ul>
            <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
            <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
            <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
            <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
            <li>To submit false or misleading information</li>
            <li>To upload or transmit viruses or any other type of malicious code</li>
          </ul>
        </SectionContent>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <SectionTitle>
          <FileText size={20} />
          Limitations
        </SectionTitle>
        <SectionContent>
          <p>
            In no event shall StackTrek or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on StackTrek, even if StackTrek or an authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
          <p>
            Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
          </p>
        </SectionContent>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <SectionTitle>
          <FileText size={20} />
          Revisions and Errata
        </SectionTitle>
        <SectionContent>
          <p>
            The materials appearing on StackTrek could include technical, typographical, or photographic errors. StackTrek does not warrant that any of the materials on its website are accurate, complete, or current.
          </p>
          <p>
            StackTrek may make changes to the materials contained on its website at any time without notice. However, StackTrek does not make any commitment to update the materials.
          </p>
        </SectionContent>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <SectionTitle>
          <FileText size={20} />
          Contact Information
        </SectionTitle>
        <SectionContent>
          <p>
            If you have any questions about these Terms & Conditions, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> legal@stacktrek.dev<br />
            <strong>Address:</strong> StackTrek Legal Department<br />
            123 Developer Street, Code City, CC 12345
          </p>
        </SectionContent>
      </Section>
    </Container>
  );
};
