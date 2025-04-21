import React, { useState } from 'react';
import axios from 'axios';
import {
  SummarizerContainer,
  SummarizerTitle,
  InputTextArea,
  SummarizeButton,
  SummaryOutputContainer,
  SummaryOutputTitle,
  SummaryText,
} from './AISummarizer.styles'; // Assuming you save the styled components in a separate file

function AISummarizer() {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState(null);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setError(null);
    setSummary('');
    try {
      const response = await axios.post('http://localhost:5000/api/ai/summarize-text', { text: inputText });
      setSummary(response.data.summary);
    } catch (err) {
      console.error('Error summarizing text:', err);
      setError(err.message || 'Failed to summarize text.');
      setSummary('');
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <SummarizerContainer>
      <SummarizerTitle>Cosmic Condenser: Summarize Your Text</SummarizerTitle>

      <InputTextArea
        placeholder="Paste the text you want to summarize here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <SummarizeButton onClick={handleSummarize} disabled={isSummarizing}>
        {isSummarizing ? 'Summarizing...' : 'Summarize'}
      </SummarizeButton>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      {summary && (
        <SummaryOutputContainer>
          <SummaryOutputTitle>Summary</SummaryOutputTitle>
          <SummaryText>{summary}</SummaryText>
        </SummaryOutputContainer>
      )}
    </SummarizerContainer>
  );
}

export default AISummarizer;