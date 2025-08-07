import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      setResponseMessage(data.message);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } else {
      setResponseMessage(data.message || 'An error occurred. Please try again later.');
    }
  } catch (error) {
    setResponseMessage('An error occurred. Please try again later.');
  }
};


  return (
    <Container
      style={{
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '2rem',
        maxWidth: '600px'
      }}
      className="my-4"
    >
      <h2 style={{ color: '#4CAF50', textAlign: 'center' }}>Get in Touch</h2>
      <p style={{ color: '#333', textAlign: 'center', fontSize: '1rem', marginBottom: '1.5rem' }}>
        Have questions? Fill out the form below to contact our team.
      </p>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName" className="mb-3">
          <Form.Label style={{ color: '#333', fontSize: '0.9rem' }}>
            Name <span style={{ color: 'red' }}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Your full name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ fontSize: '0.9rem', color: '#555' }}
          />
        </Form.Group>

        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label style={{ color: '#333', fontSize: '0.9rem' }}>
            Email <span style={{ color: 'red' }}>*</span>
          </Form.Label>
          <Form.Control
            type="email"
            placeholder="Your email address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ fontSize: '0.9rem', color: '#555' }}
          />
        </Form.Group>

        <Form.Group controlId="formPhone" className="mb-3">
          <Form.Label style={{ color: '#333', fontSize: '0.9rem' }}>
            Phone
          </Form.Label>
          <Form.Control
            type="tel"
            placeholder="Your phone number (optional)"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={{ fontSize: '0.9rem', color: '#555' }}
          />
        </Form.Group>

        <Form.Group controlId="formMessage" className="mb-3">
          <Form.Label style={{ color: '#333', fontSize: '0.9rem' }}>
            Message <span style={{ color: 'red' }}>*</span>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Write your message here"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            style={{ fontSize: '0.9rem', color: '#555' }}
          />
        </Form.Group>

        <div style={{ textAlign: 'center' }}>
          <Button
            variant="success"
            type="submit"
            className="btn-lg rounded-0 shadow text-capitalize"
            style={{
              minWidth: '140px',
              fontWeight: '600',
              padding: '0.75rem 1.5rem',
            }}
          >
            Send Message
          </Button>
        </div>
      </Form>

      {responseMessage && (
        <p
          className="mt-3 text-center"
          style={{ color: '#4CAF50', fontSize: '0.9rem', fontWeight: '600' }}
        >
          {responseMessage}
        </p>
      )}
    </Container>
  );
};

export default ContactForm;
