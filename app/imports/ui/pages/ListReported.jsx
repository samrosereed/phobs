import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { Events } from '../../api/debris/Event';
import LoadingSpinner from '../components/LoadingSpinner';
import ReportedItem from '../components/ReportItem';

const ListReported = () => {
  const { ready, events } = useTracker(() => {
    const subscription = Meteor.subscribe(Events.unclaimed);
    const rdy = subscription.ready();
    const reportedItems = Events.collection.find().fetch();

    return {
      events: reportedItems,
      ready: rdy,
    };
  }, []);

  return (ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col md={12} lg={10}>
          <Col className="text-center">
            <h2>Reported & Unclaimed Debris</h2>
            <p>This debris has been reported by individuals from the public and organizations within this program.</p>
          </Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="text-center">Island</th>
                <th className="text-center">City</th>
                <th className="text-center">Type</th>
                <th className="text-center">Located</th>
                <th className="text-center">Describe</th>
                <th className="text-center">Details</th>
                <th className="text-center">Claim</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => <ReportedItem key={event._id} event={event} />)}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />);
};

export default ListReported;
