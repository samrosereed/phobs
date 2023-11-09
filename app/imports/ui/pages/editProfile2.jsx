import React from 'react';
import swal from 'sweetalert';
import { Card, Col, Container, Row } from 'react-bootstrap';
import {
  AutoForm,
  ErrorsField,
  HiddenField,
  LongTextField,
  SubmitField,
  TextField,
} from 'uniforms-bootstrap5';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useParams } from 'react-router';
import { Stuffs } from '../../api/stuff/Profile';
import LoadingSpinner from '../components/LoadingSpinner';

const bridge = new SimpleSchema2Bridge(Stuffs.schema);

/* Renders the EditStuff page for editing a single document. */
const EditProfile2 = () => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  // console.log('EditStuff', _id);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { doc, ready } = useTracker(() => {
    // Get access to Stuff documents.
    const subscription = Meteor.subscribe(Stuffs.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the document
    const document = Stuffs.collection.findOne(_id);
    return {
      doc: document,
      ready: rdy,
    };
  }, [_id]);
    // console.log('EditStuff', doc, ready);
    // On successful submit, insert the data.
  const submit = (data) => {
    const { firstName, lastName, bio, email, password } = data;
    EditProfile2.collection.update(_id, { $set: { firstName, lastName, bio, email, password } }, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Edited Prof updated successfully', 'success')));
  };

  return ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center"><h2>Edit Profile</h2></Col>
          <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc}>
            <Card>
              <Card.Body>
                <TextField name="firstName" placeholder="Change First Name" />
                <TextField name="LastName" placeholder="Change Last Name" />
                <TextField name="email" placeholder="Change Email" />
                <TextField name="password" placeholder="Change Password" />
                <LongTextField name="bio" placeholder="Tell us about yourself" />
                <SubmitField value="Submit" />
                <ErrorsField />
                <HiddenField name="owner" />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default EditProfile2;
