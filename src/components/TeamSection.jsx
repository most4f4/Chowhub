// components/TeamSection.jsx
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Image from 'next/image';

const teamMembers = [
  {
    name: 'Furkan Bas',
    role: 'Full Stack Developer',
    image: '/images/furkan.jpeg',
    color: '#E91E63',
    bio: `Aspiring software developer and QA whiz, Furkan brings your ideas to life on both front and back ends. Whether it's crafting slick React interfaces or building rock solid APIs, he loves turning challenges into polished, user friendly features.`,
  },
  {
    name: 'Saad Ghori',
    role: 'Full Stack Developer',
    image: '/images/saad.jpeg',
    color: '#4CAF50',
    bio: `Former finance professional turned developer, Saad blends structured problem-solving with solid coding skills. He focuses on building efficient user interfaces and scalable backend systems with a keen eye for detail.`,
  },
  {
    name: 'Lily Huang',
    role: 'Full Stack Developer',
    image: '/images/lily.jpeg',
    color: '#2196F3',
    bio: `With a background in UI design and a love for clean code, Lily bridges frontend creativity with backend precision. She’s skilled in Python, React, and building seamless, responsive user experiences.`,
  },
  {
    name: 'Mostafa Shahrabadi',
    role: 'Full Stack Developer',
    image: '/images/mostafa.jpeg',
    color: '#9C27B0',
    bio: `Experienced in DevOps and software performance, Mostafa streamlines deployment and optimizes full stack workflows. His past projects span mobile, web, and API development with a strong focus on team agility.`,
  },
];

export default function TeamSection() {
  return (
    <section style={{ backgroundColor: '#f8f9fa', padding: '80px 0' }}>
      <Container>
        <h2
          className="text-center fw-bold mb-5"
          style={{ fontSize: '2.5rem' }}
        >
          Meet the Team
        </h2>
        <Row>
          {teamMembers.map((m) => (
            <Col key={m.name} md={6} lg={3} className="mb-4">
              <Card
                className="h-100 border-0 shadow-sm"
                style={{
                  borderTop: `4px solid ${m.color}`,
                  overflow: 'hidden',
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '0', paddingTop: '100%' }}>
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title
                    style={{ color: m.color, fontSize: '1.25rem' }}
                  >
                    {m.name}
                  </Card.Title>
                  <Card.Subtitle className="mb-3 text-secondary">
                    {m.role}
                  </Card.Subtitle>
                  <Card.Text className="flex-grow-1" style={{ fontSize: '0.9rem' }}>
                    {m.bio}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
