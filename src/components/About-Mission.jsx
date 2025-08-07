import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';

export default function AboutMissionSection() {
  return (
    <section style={{ position: 'relative', padding: '120px 0', overflow: 'hidden' }}>
      {/* Background Image */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/images/background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />

      {/* White Overlay to lighten */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          opacity: 0.6,
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Container style={{ position: 'relative', zIndex: 2 }}>
        <Row className="align-items-center">
          {/* Text Column */}
          <Col
            lg={6}
            className="d-flex flex-column justify-content-center mb-5 mb-lg-0"
          >
            <h2
              style={{
                color: '#E91E63',
                fontWeight: 'bold',
                fontSize: '2.2rem',
                marginBottom: '20px',
              }}
            >
              Empowering Local Restaurants to Thrive
            </h2>
            <p
              style={{
                color: '#212121',
                fontSize: '1.25rem',
                lineHeight: '1.8',
              }}
            >
              At ChowHub, our mission is to empower small-medium sized restaurants
              with a free, easy-to-use platform. We aim to transform their
              operations by providing real-time insights and tools that enhance
              efficiency, boost profitability, and streamline daily tasks. We hope to help
              these local gems thrive in a competitive industry.
            </p>
          </Col>

          {/* Image Column */}
          <Col lg={6} className="d-flex justify-content-center">
            <div
              style={{
                position: 'relative',
                width: '80%',
                aspectRatio: '3 / 4',
                borderRadius: '15px',
                overflow: 'hidden',
                marginTop: '1rem', // smaller gap above image
              }}
            >
              <Image
                src="/images/about-mission.jpg"
                alt="ChowHub empowering small restaurants"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
