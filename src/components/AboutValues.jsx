import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Image from 'next/image';

const values = [
  {
    title: 'Empowerment',
    description: 'We provide free tools to help small restaurants grow and succeed.',
    icon: '/icons/empowerment.png', // Placeholder; replace with actual icon
    color: '#E91E63',
  },
  {
    title: 'Innovation',
    description: 'We deliver cutting-edge solutions tailored for small eateries.',
    icon: '/icons/innovation.png', // Placeholder; replace with actual icon
    color: '#2196F3',
  },
  {
    title: 'Community',
    description: 'We aim to support local businesses to strengthen our neighborhoods.',
    icon: '/icons/community.png', // Placeholder; replace with actual icon
    color: '#4CAF50',
  },
  {
    title: 'Simplicity',
    description: 'We offer an intuitive platform for effortless management.',
    icon: '/icons/simplicity.png', // Placeholder; replace with actual icon
    color: '#9C27B0',
  },
];

export default function AboutValuesSection() {
  return (
    <section style={{ backgroundColor: '#ffffff', padding: '100px 0' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <h2 style={{ color: '#212121', fontWeight: 'bold', fontSize: '2.5rem', textAlign: 'center', marginBottom: '50px' }}>
              Our Core Values
            </h2>
            <Row className="g-4">
              {values.map((value, index) => (
                <Col key={index} md={6} lg={3}>
                  <Card
                    style={{
                      borderRadius: '15px',
                      padding: '30px',
                      textAlign: 'center',
                      backgroundColor: value.color,
                      color: '#ffffff',
                      height: '100%',
                      transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 20px' }}>
                      <Image
                        src={value.icon}
                        alt={`${value.title} icon`}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                    <Card.Title style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '15px' }}>
                      {value.title}
                    </Card.Title>
                    <Card.Text style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                      {value.description}
                    </Card.Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
}