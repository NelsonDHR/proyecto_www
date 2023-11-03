import React from "react";
import AddEventModal from "../views/Events/AddEventModal";
import { render } from '@testing-library/react';


describe('AddEventModal', () => {
  it('should render without crashing', () => {
    render(<AddEventModal />);
  });
});

