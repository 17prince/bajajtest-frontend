import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import "./App.css";

const App = () => {
  // Set your roll number as the title of the page
  document.title = "0827CI211143";

  const [jsonInput, setJsonInput] = useState(""); // JSON input from user
  const [response, setResponse] = useState(null); // API response
  const [error, setError] = useState(""); // Validation or API errors
  const [selectedOptions, setSelectedOptions] = useState([]); // Selected dropdown options

  const options = [
    { value: "alphabets", label: "Alphabets" },
    { value: "numbers", label: "Numbers" },
    {
      value: "highest_lowercase_alphabet",
      label: "Highest Lowercase Alphabet",
    },
  ];

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResponse(null);

    // Validate JSON input
    let parsedInput;
    try {
      parsedInput = JSON.parse(jsonInput);
      if (!parsedInput || !Array.isArray(parsedInput.data)) {
        throw new Error("Invalid JSON format. Ensure `data` is an array.");
      }
    } catch (err) {
      setError("Invalid JSON. Please enter a valid JSON object.");
      return;
    }

    // Call the backend API
    try {
      const res = await axios.post("https://test-87wu5asbd-princes-projects-16e88c7f.vercel.app/bfhl", parsedInput); // Replace with your deployed backend URL
      setResponse(res.data);
    } catch (err) {
      setError("Failed to fetch API. Check your backend service.");
    }
  };

  // Render selected response fields
  const renderResponse = () => {
    if (!response || selectedOptions.length === 0) return null;

    const selectedKeys = selectedOptions.map((opt) => opt.value);
    const filteredResponse = selectedKeys.reduce((acc, key) => {
      if (response[key]) acc[key] = response[key];
      return acc;
    }, {});

    return (
      <div className="response-section">
        <h3>Response:</h3>
        <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="app-container">
      <h1>JSON Processor</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="6"
          cols="50"
          placeholder='Enter JSON (e.g., { "data": ["A", "C", "z"] })'
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      {error && <p className="error">{error}</p>}

      {response && (
        <>
          <Select
            options={options}
            isMulti
            onChange={setSelectedOptions}
            className="dropdown"
            placeholder="Select fields to display..."
          />
          {renderResponse()}
        </>
      )}
    </div>
  );
};

export default App;
