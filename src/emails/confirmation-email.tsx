import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Section,
  Link,
} from '@react-email/components';

interface ConfirmationEmailProps {
  confirmUrl: string;
  unsubscribeUrl: string;
}

export function ConfirmationEmail({
  confirmUrl,
  unsubscribeUrl,
}: ConfirmationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Confirm your subscription to The Ledger</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Heading style={headingStyle}>Confirm Your Subscription</Heading>
          <Text style={textStyle}>
            Thanks for subscribing to The Ledger — your go-to resource for Irish
            accounting and tax guidance. Click the button below to confirm your
            email address.
          </Text>
          <Section style={buttonSectionStyle}>
            <Button style={buttonStyle} href={confirmUrl}>
              Confirm Subscription
            </Button>
          </Section>
          <Text style={mutedTextStyle}>
            If you didn&apos;t request this, you can safely ignore this email.
          </Text>
          <Section style={footerStyle}>
            <Link href={unsubscribeUrl} style={unsubscribeLinkStyle}>
              Unsubscribe
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const bodyStyle: React.CSSProperties = {
  backgroundColor: '#FAFAF9',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: 0,
  padding: 0,
};

const containerStyle: React.CSSProperties = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '40px 20px',
};

const headingStyle: React.CSSProperties = {
  color: '#1C1917',
  fontSize: '24px',
  fontWeight: 700,
  lineHeight: '32px',
  margin: '0 0 16px',
};

const textStyle: React.CSSProperties = {
  color: '#44403C',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 24px',
};

const buttonSectionStyle: React.CSSProperties = {
  textAlign: 'center' as const,
  margin: '0 0 32px',
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#EA580C',
  borderRadius: '6px',
  color: '#FFFFFF',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 600,
  lineHeight: '100%',
  padding: '14px 28px',
  textDecoration: 'none',
  textAlign: 'center' as const,
};

const mutedTextStyle: React.CSSProperties = {
  color: '#A8A29E',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 32px',
};

const footerStyle: React.CSSProperties = {
  borderTop: '1px solid #E7E5E4',
  paddingTop: '16px',
  textAlign: 'center' as const,
};

const unsubscribeLinkStyle: React.CSSProperties = {
  color: '#A8A29E',
  fontSize: '12px',
  textDecoration: 'underline',
};
