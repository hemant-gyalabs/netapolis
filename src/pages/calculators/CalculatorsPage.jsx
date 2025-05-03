import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import CalculatorsIntegration from '../../components/calculators/CalculatorsIntegration';

/**
 * Calculators Page
 * 
 * This page serves as a container for the calculators integration
 * within the dashboard application.
 */
const CalculatorsPage = () => {
  return (
    <Routes>
      <Route path="/" element={<CalculatorsIntegration />} />
    </Routes>
  );
};

export default CalculatorsPage;