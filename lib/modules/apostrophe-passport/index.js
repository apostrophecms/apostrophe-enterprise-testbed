module.exports = {
  strategies: [
    {
      // gitlab login
      // You must npm install --save this module in your project first
      module: 'passport-google-oauth20',
      options: {
        // Options for passport-google-oauth20
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      },
      emailDomain: 'apostrophecms.com',
      match: 'email',
      // Options that must be passed to the authenticate middleware
      authenticate: {
        // minimum scopes for matching logins based on email addresses.
        // profile is absolutely required, you almost certainly want email too
        scope: [ 'email' ]
      }
    }
  ]
};
