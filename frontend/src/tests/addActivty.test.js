import React from "react";
import AddActivityModal from "../views/Activities/AddActivityModal";
import { render } from '@testing-library/react';


describe('AddActivityModal', () => {
  it('should render without crashing', () => {
    render(<AddActivityModal />);
  });
});

