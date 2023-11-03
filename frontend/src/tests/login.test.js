import React from "react";
import LogIn from "../views/Auth/LogIn";
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

describe('Login', () => {
  it('should render without crashing', () => {
    render(
      <MemoryRouter>
        <LogIn />
      </MemoryRouter>
    );
  });
});
