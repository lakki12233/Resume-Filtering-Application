import React from 'react';
import * as Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';

const extractExperienceDetails = (text) => {
  const details = {
    name: '',
    experience: '',
    skills: [],
  };

  const namePattern = /NAME:\s*([\w\s]+)/i;
  const experiencePattern = /Experience:\s*([\w\s])/i;
  const skillsPattern = /\b(C\+\+|JAVA)\b/gi;

  const nameMatch = text.match(namePattern);
  const experienceMatch = text.match(experiencePattern);
  const skillsMatches = text.match(skillsPattern);

  if (nameMatch && nameMatch[1]) {
    details.name = nameMatch[1].trim();
  }

  if (experienceMatch && experienceMatch[1]) {
    details.experience = experienceMatch[1].trim();
  }

  if (skillsMatches) {
    details.skills = skillsMatches.map(skill => skill.trim());
  }

  return details;
};

const App = () => {
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = async (e) => {
      const arrayBuffer = e.target.result;

      const zip = new PizZip(arrayBuffer);
      const doc = new Docxtemplater().loadZip(zip);

      const extractedText = doc.getFullText();

      const experiencePattern = /\d+\s*(year|yr|years|yrs)/gi;
      const matches = extractedText.match(experiencePattern);

      if (matches) {
        let totalExperienceYears = 0;
        for (const match of matches) {
          const years = parseInt(match, 10);
          if (!isNaN(years)) {
            totalExperienceYears += years;
          }
        }

        if (totalExperienceYears > 3) {
          const details = extractExperienceDetails(extractedText);

          if (details.skills.includes('C++') && details.skills.includes('JAVA')) {
            const jsonDetails = JSON.stringify(details, null, 2);
            const blob = new Blob([jsonDetails], { type: 'application/json' });
            saveAs(blob, 'resume_details.json');
            console.log('Total Experience Years:', totalExperienceYears);
            console.log('Details saved in resume_details.json');
            return; // Exit the function if the condition is satisfied
          }
        }
      }

      console.log('Experience is less than 3 years or required skills are not present.');
      console.log('Full Document:', extractedText);
    };

    fileReader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
};

export default App;
