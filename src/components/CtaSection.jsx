import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Link from 'next/link';

const rois = [
  { number: "3.5×", text: "Increase in Staff Productivity in the First Year" },
  { number: "25%", text: "Reduction in Inventory Waste with Smart Tracking" },
  { number: "2×", text: "Faster Order Turnaround Using Real-Time Menu Sync" },
  { number: "40%", text: "More Efficient Scheduling through Data Insights" },
];

export default function CtaSection() {
  return (
    <section 
      className="py-5" 
      style={{
        backgroundImage: 'url(/images/cta-section.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dark overlay */}
      <div style={{ 
        position: 'absolute', 
        top: 0, left: 0, right: 0, bottom: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.3)', 
        zIndex: 0 
      }} />

      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card 
              className="text-center text-white" 
              style={{ 
                borderRadius: '25px', 
                padding: '40px', 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                backdropFilter: 'blur(10px)',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <h2 className="fw-bold mb-3">Unlock Real Results with ChowHub</h2>
              <p className="mb-5" style={{ color: '#eee' }}>
                Our dashboard delivers measurable improvements across your team and operations. Here’s what restaurants achieve in their first year:
              </p>

              <Row>
                {rois.map((roi, index) => (
                  <Col key={index} md={6} className="mb-4">
                    <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>{roi.number}</h1>
                    <p style={{ fontSize: '1.1rem', color: '#ddd' }}>{roi.text}</p>
                  </Col>
                ))}
              </Row>

              <div className="mt-4">
                <Link href="/create-restaurant">
                <button
                    type="button"
                    className="btn btn-success btn-lg rounded-0 text-capitalize shadow"
                >
                    Get Started for Free
                </button>
                </Link>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
