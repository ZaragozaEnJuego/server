
const config = {
  server:{
    port: '3000',
    secret: process.env.SERVER_SECRET
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/google/callback'
  },
  jwt: {
    secret: process.env.JWT_SECRET
  },
  db: {
    uri: process.env.DB_URI
  }
};

export default config;