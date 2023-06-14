import React from "react";
import { Alert, Card, Container } from "react-bootstrap";
import { useUserContext } from "../../contexts/useUserContext";
import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../../api/contact";
import { getErrorMessage } from "../../helpers/getErrorMessage";
import formatDate from "../../helpers/formatDate";

const ContactMessages = () => {
  const { userToken } = useUserContext();
  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => getMessages(userToken),
    queryKey: ["messages"],
  });
  return (
    <Container className="py-3">
      {isLoading && (
        <Alert variant="info">Chargement des messages de contact...</Alert>
      )}
      {isError && <Alert variant="error">{getErrorMessage(error)}</Alert>}
      {data && data.length > 0
        ? data.map((contact) => (
            <Card key={contact._id} className="my-3">
              <Card.Header>
                Envoyé le: {formatDate(contact.createdAt)}
              </Card.Header>
              <Card.Body>
                <h3>
                  {contact.firstName} {contact.lastName}
                </h3>
                <p>Email: {contact.email}</p>
                <p>
                  <b>Message: </b>
                  <br />
                  {contact.message}
                </p>
              </Card.Body>
            </Card>
          ))
        : !isLoading && <Alert>There are 0 contact messages currently</Alert>}
    </Container>
  );
};

export default ContactMessages;
