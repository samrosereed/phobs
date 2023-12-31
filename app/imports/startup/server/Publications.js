import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Profiles } from '../../api/profile/Profiles';
import { Events } from '../../api/debris/Event';
import { Samples } from '../../api/debris/Sample';
import { Subsamples } from '../../api/debris/Subsample';

// alanning:roles publication
// Recommended code to publish roles for each user.
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});

// User-level publication.
// If logged in, then publish documents owned by this user. Otherwise, publish nothing.
Meteor.publish(Profiles.userPublicationName, function () {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Profiles.collection.find({ owner: username });
  }
  return this.ready();
});

// User-level publication.
// If logged in, then publish documents owned by this user. Otherwise, publish nothing.
Meteor.publish(Events.userPublicationName, function () {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Events.collection.find({ owner: username });
  }
  return this.ready();
});

// PUBLICATIONS FOR ADMIN PAGES
// Admin-level publication.
// If logged in and with admin role, then publish all documents from all users. Otherwise, publish nothing.
Meteor.publish(Events.adminPublicationName, function () {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Events.collection.find();
  }
  return this.ready();
});

Meteor.publish(Events.analysis, function () {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Events.collection.find({ hasSamples: true });
  }
  return this.ready();
});

// PUBLICATIONS FOR STATUS RELATED PAGES
// check if civilian and if so, don't publish anything
Meteor.publish(Events.unclaimed, function () {
  if (this.userId) {
    return Events.collection.find({ status: 'unclaimed' });
  }
  return this.ready();
});

Meteor.publish(Events.claimed, function () {
  if (this.userId) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return Events.collection.find({ status: 'claimed' });
    }
    const username = Meteor.users.findOne(this.userId).username;
    return Events.collection.find({ owner: username, status: 'claimed' });
  }
  return this.ready();
});

Meteor.publish(Events.stored, function () {
  if (this.userId) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return Events.collection.find({ status: 'stored' });
    }
    const username = Meteor.users.findOne(this.userId).username;
    return Events.collection.find({ owner: username, status: 'stored' });
  }
  return this.ready();
});

Meteor.publish(Events.disposed, function () {
  if (this.userId) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return Events.collection.find({ status: 'disposed' });
    }
    const username = Meteor.users.findOne(this.userId).username;
    return Events.collection.find({ owner: username, status: 'disposed' });
  }
  return this.ready();
});

// -----------------------------------------------------------------------------------
//  --------------------------        SAMPLES       ---------------------------------
// -----------------------------------------------------------------------------------

Meteor.publish(Samples.analysis, function () {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Samples.collection.find();
  }
  return this.ready();
});

// -----------------------------------------------------------------------------------
//  --------------------------       SUBSAMPLES      ---------------------------------
// -----------------------------------------------------------------------------------

Meteor.publish(Subsamples.analysis, function () {
  if (this.userId && Roles.userIsInRole(this.userId, 'admin')) {
    return Subsamples.collection.find();
  }
  return this.ready();
});
