import Head from 'next/head';
import Top from '../components/Top';
import ContactForm from '@/components/ContactForm';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';

export default function Contact() {
  return (
    <>
      <Top />
      <Head>
        <title>Contact - ChowHub</title>
        <meta name="description" content="Contact ChowHub for questions or support" />
      </Head>

      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          position: 'relative',
          backgroundColor: '#fff',
          paddingTop: '80px',
        }}
      >
        <Container className="py-5 px-4" style={{ position: 'relative', zIndex: 2 }}>
          <h1
            style={{
              color: '#4CAF50',
              fontWeight: '700',
              fontSize: '1.5rem',
              marginBottom: '1rem',
            }}
          >
            Contact Us
          </h1>

          <p style={{ color: '#333', fontSize: '1.1rem', marginBottom: '2rem' }}>
            Thank you for your interest in ChowHub. Fields marked with <span style={{ color: 'red' }}>*</span> are required.
          </p>

          <Row className="align-items-stretch g-0" style={{ minHeight: '60vh' }}>
            <Col md={7} style={{ display: 'flex', minHeight: '60vh' }}>
              <ContactForm />
            </Col>
            <Col
              md={5}
              style={{
                minHeight: '60vh',
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <Image
                src="/images/contact.jpg"
                alt="Contact Image"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Lightened overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                }}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}