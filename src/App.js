import React, { useState } from 'react';
import FormComponent from './Components/FormComponent';
import PDFGenerator from './Components/PDFGenerator';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    amount: ''
  });

  return (
    <div className="App">
      <h1>Bill Maker</h1>
      <FormComponent formData={formData} setFormData={setFormData} />
      <PDFGenerator formData={formData} />
    </div>
  );
}

export default App;

