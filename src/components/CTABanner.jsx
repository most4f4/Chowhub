import { Container, Button } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';

const CTABanner = () => {
  return (
    <div className="position-relative" style={{ height: '275px' }}>
      {/* Background Image */}
      <Image
        src="/images/background.jpg"
        alt="Team working together"
        fill
        priority
        style={{
          objectFit: 'cover',
          zIndex: 0,
        }}
      />

      {/* Light Overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', zIndex: 1 }}
      />

      {/* Content */}
      <Container
        className="position-relative h-100 d-flex align-items-center"
        style={{ zIndex: 2 }}
      >
        <div className="text-dark" style={{ maxWidth: '600px' }}>
          <h2 className="display-6 mb-4 fw-bold">Want to get in touch with us?</h2>
          <Link href="/contact" passHref>
            <Button 
                variant="success" 
                size="lg" 
                className="rounded-0 text-capitalize shadow"
            >
                Contact The Team
            </Button>
            </Link>
        </div>
      </Container>
    </div>
  );
};

export default CTABanner;
