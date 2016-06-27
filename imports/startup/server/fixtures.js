import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';

const users = [{
    email: 'admin@admin.com',
    password: 'password',
    profile: {
      name: { first: 'Admin', last: 'McAdmin' },
    },
    roles: ['admin'],
  },
  {
    email: 'joe@hdbuff.com',
    password: 'password',
    profile: {
      name: { first: 'Joe', last: 'Buff' },
    },
    roles: ['admin'],
  },
  {
    email: 'jane@hdbuff.com',
    password: 'password',
    profile: {
      name: { first: 'Jane', last: 'Buff' },
    },
    roles: ['admin'],
  },
  {
    email: 'banana@hdbuff.com',
    password: 'banana',
    profile: {
      name: { first: 'Ban', last: 'Anna' },
    },
    roles: ['admin'],
  }
];

users.forEach(({ email, password, profile, roles }) => {
  const userExists = Meteor.users.findOne({ 'emails.address': email });

  if (!userExists) {
    const userId = Accounts.createUser({ email, password, profile });
    Roles.addUsersToRoles(userId, roles);
  }
});
