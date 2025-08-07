import { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Image from 'next/image';

const InventorySection = () => {
  const features = [
    {
      title: 'Inventory Tracking',
      description:
        'Stock levels update in real-time with every sale. Keep your kitchen running efficiently without unfortunate surprises.',
      icon: '/icons/inventory-tracking.png',
      altText: 'Inventory Tracking Icon',
      borderColor: '#E3F2FD',
    },
    {
      title: 'Threshold Alerts',
      description:
        'Managers are notified immediately when stock runs low. Stay ahead with proactive alerts and reorder in time.',
      icon: '/icons/threshold-alert.png',
      altText: 'Threshold Alerts Icon',
      borderColor: '#FCE4EC',
    },
    {
      title: 'Menu Sync',
      description:
        'Unavailable items are instantly removed from the menu. Your staff is only shown what’s available so they never make a mistake.',
      icon: '/icons/menu-update.png',
      altText: 'Menu Sync Icon',
      borderColor: '#E8F5E9',
    },
  ];

  return (
    <section
      id="inventory-section"
      style={{
        backgroundColor: '#ffffff',
        paddingTop: '150px',
        paddingBottom: '150px',
      }}
    >
      <Container>
        <Row className="mb-5">
          <Col className="text-center">
            <h2 className="text-uppercase fw-bold fs-1 mb-4">
              Smarter Inventory, Seamless Service
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center g-5">
          {features.map((feature, index) => {
            const [isHovered, setIsHovered] = useState(false);

            return (
              <Col key={index} md={4} sm={12} className="d-flex justify-content-center">
                <Card
                  className="text-center"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={{
                    width: '100%',
                    maxWidth: '350px',  // increased width
                    height: '480px',    // reduced height
                    padding: '60px 30px',
                    borderRadius: '28px',
                    backgroundColor: '#fff',
                    border: `2px solid ${feature.borderColor}`,
                    boxShadow: `0 6px 16px ${feature.borderColor}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                  }}
                >
                  <div
                    style={{
                      width: '140px',   // smaller icon size
                      height: '140px',
                      marginBottom: '40px',
                    }}
                  >
                    <Image
                      src={feature.icon}
                      alt={feature.altText}
                      width={140}
                      height={140}
                      className="img-fluid"
                    />
                  </div>
                  <Card.Body style={{ padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Card.Title
                      style={{
                        fontWeight: '700',
                        fontSize: '1.5rem',
                        color: '#212121',
                        marginBottom: '25px',
                      }}
                    >
                      {feature.title.toUpperCase()}
                    </Card.Title>
                    <Card.Text
                      style={{
                        fontSize: '1rem',
                        color: '#555',
                        maxWidth: '200px',
                        margin: '0 auto',
                      }}
                    >
                      {feature.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </section>
  );
};

export default InventorySection;
