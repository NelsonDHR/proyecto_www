import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Welcome to My Web App</h1>
      <p>This is the home page of my web app.</p>
      <Link to="/about">Learn more about us</Link>
    </div>
  );
};

export default Home;
