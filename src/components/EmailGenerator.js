import React, { useState } from 'react';

const EmailGenerator = () => {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');
  const [reason, setReason] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState(`Generate a personalized email for a person with the following details:

LinkedIn of who I'm reaching out to:
{linkedinContent}

Company website I'm reaching out about:
{websiteContent}

Reason for reaching out: {reason}

The email should be professional, concise, and tailored to the specific reason for reaching out. Use the company website content to show familiarity with the company and its offerings. The LinkedIn profile is provided for context, but do not assume you have specific details from it. Instead, write the email as if you've quickly glanced at their LinkedIn profile.

Please structure the email with:
1. A personalized greeting
2. A brief introduction explaining why you're reaching out
3. A paragraph showing your understanding of their company based on the website content
4. A clear call to action or next steps
5. A professional closing

Please do not use any "[]" and infer those details from my prompt. Infer the company name from Company Website Content. Sign off with "Deedy, Menlo Ventures". 

Ensure the tone matches the reason for reaching out (e.g., more formal for job applications, friendly but professional for networking). `)

  const generateEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://us-central1-saas-labs-staging-rnd.cloudfunctions.net/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ linkedinUrl, companyUrl, reason, prompt }),
      });
      const data = await response.json();
      setGeneratedEmail(data.email);
    } catch (error) {
      console.error('Error:', error);
      setGeneratedEmail('Failed to generate email. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="email-generator-container">
      <div className="email-generator-card">
        <h1 className="email-generator-title">Email Generator</h1>
        <div className="email-generator-form">
          <div className="input-group">
            <input 
              type="text" 
              id="linkedin"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="input-field"
            />
            <label htmlFor="linkedin" className="input-label">LinkedIn URL</label>
          </div>
          <div className="input-group">
            <input 
              type="text" 
              id="company"
              value={companyUrl}
              onChange={(e) => setCompanyUrl(e.target.value)}
              className="input-field"
            />
            <label htmlFor="company" className="input-label">Company Website</label>
          </div>
          <div className="input-group">
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input-field"
            >
              <option value="">Select reason</option>
              <option value="hiring">Hiring to your company</option>
              <option value="funding">Funding from your company</option>
              <option value="selling">Selling your company product</option>
            </select>
            <label htmlFor="reason" className="input-label">Reason for reaching out</label>
          </div>
          <div className="input-group">
            <textarea
              id="prompt"
              value={prompt}
              rows={40}
              onChange={(e) => setPrompt(e.target.value)}
              className="input-field"
            />
            <label htmlFor="prompt" className="input-label">Prompt</label>
          </div>
          <button 
            onClick={generateEmail}
            className="generate-button"
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Email'}
          </button>
        </div>
      </div>
      {generatedEmail && (
        <div className="generated-email-container">
          <h3 className="generated-email-title">Generated Email:</h3>
          <div className="generated-email-content">
            {generatedEmail.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailGenerator;