//check the conditon and prints only the expreince
import React from 'react';
import * as Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
                                                      

                                                   
const App = () => {
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const fileReader = new FileReader();
  
      fileReader.onload = async (e) => {
      const arrayBuffer = e.target.result;
  
      const zip = new PizZip(arrayBuffer);
      const doc = new Docxtemplater().loadZip(zip);
  
      const extractedText = doc.getFullText();
      const details = extractExperienceDetails(extractedText);
  
      const jsonDetails = JSON.stringify(details, null, 2);
      const blob = new Blob([jsonDetails], { type: 'application/json' });
      saveAs(blob, 'resume_details.json');
    };
  
    fileReader.readAsArrayBuffer(file);
  };
  
  const extractExperienceDetails = (extractedText) => {
    const experiencePattern = /\d+\s*(year|yr|years|yrs)/gi;
    const matches = extractedText.match(experiencePattern);

    const experienceDetails = {
      experienceYears: 0,
      has3YearsExperience: false,
    };

    if (matches) {
      for (const match of matches) {
        const years = parseInt(match, 10);
        if (!isNaN(years)) {
          experienceDetails.experienceYears += years;
        }
      }

      if (experienceDetails.experienceYears >= 3) {
        experienceDetails.has3YearsExperience = true;
      }
    }

    return experienceDetails;
  };

  return (
    <div>
      <h1>Resume Reader</h1>
      <input type="file" accept=".doc,.docx" onChange={handleFileUpload} />
    </div>
  );
};

export default App;
