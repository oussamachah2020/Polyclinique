import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Button, Card, Container, Form, Row, Col } from "react-bootstrap";
import { postMessage } from "../../api/contact";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../helpers/getErrorMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Contact = () => {
  const [contactData, setContactData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: () => postMessage(contactData),
    onError: (error) => toast.error(getErrorMessage(error)),
    onSuccess: () => {
      toast.success("Message envoyé avec success");
      setContactData({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contactData.firstName || !contactData.lastName)
      return toast.error("Name can't be empty");
    if (!contactData.email) return toast.error("Email can't be empty");
    if (!contactData.message) return toast.error("Message can't be empty");

    mutate();
  };
  return (
    <Container
      className="py-3 d-flex align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ maxWidth: 700 }} className="mt-4 mx-auto w-100">
        <Card.Header>
          <Card.Title>Contact</Card.Title>
        </Card.Header>
        <Form onSubmit={handleSubmit}>
          <Card.Body>
            <p>Des questions? Contactez nous</p>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Prenom</Form.Label>
                  <Form.Control
                    value={contactData.firstName}
                    onChange={(e) =>
                      setContactData((prevData) => ({
                        ...prevData,
                        firstName: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Nom</Form.Label>
                  <Form.Control
                    value={contactData.lastName}
                    onChange={(e) =>
                      setContactData((prevData) => ({
                        ...prevData,
                        lastName: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="my-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={contactData.email}
                type="email"
                onChange={(e) =>
                  setContactData((prevData) => ({
                    ...prevData,
                    email: e.target.value,
                  }))
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Message</Form.Label>
              <Form.Control
                value={contactData.message}
                as="textarea"
                rows={3}
                onChange={(e) =>
                  setContactData((prevData) => ({
                    ...prevData,
                    message: e.target.value,
                  }))
                }
              />
            </Form.Group>
          </Card.Body>
          <Card.Footer className="d-flex justify-content-end">
            <Button variant="success" type="submit" disabled={isLoading}>
              {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                "Envoyer"
              )}
            </Button>
          </Card.Footer>
        </Form>
      </Card>
    </Container>
  );
};

export default Contact;
