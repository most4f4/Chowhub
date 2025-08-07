import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';

export default function FeatureSection({
  title,
  description,
  bullets,
  image,
  alt,
  reverse = false,
  color = '#000000', // expects pink, green or blue from usage
}) {
  return (
    <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
      <Container>
        <Row className={`align-items-center ${reverse ? 'flex-row-reverse' : ''}`}>
          {/* Text Column */}
          <Col
            lg={6}
            className="mb-4 mb-lg-0"
            style={{
              paddingRight: reverse ? '2rem' : '4rem',
              paddingLeft: reverse ? '4rem' : '2rem',
            }}
          >
            <h2 className="text-uppercase fw-bold fs-1 mb-4" style={{ color }}>
              {title}
            </h2>
            <p className="text-muted fs-5 mb-4">{description}</p>
            <ul className="ps-3 text-muted fs-6" style={{ listStyleType: 'disc' }}>
              {bullets.map((b, i) => (
                <li key={i} className="mb-2">
                  {b}
                </li>
              ))}
            </ul>
          </Col>

          {/* Image Column */}
          <Col
            lg={6}
            className="d-flex justify-content-center align-items-center"
            style={{ padding: '1rem' }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '600px',
                border: `1px solid ${color}`,
                borderRadius: '4px',
                overflow: 'hidden',
                boxShadow: `0 8px 20px ${color}75`,
                transition: 'box-shadow 0.3s ease',
              }}
            >
              <Image
                src={image}
                alt={alt}
                width={600}
                height={400}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
