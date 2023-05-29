//prints full details from resume
import React from 'react';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import { extractExperienceDetails } from './utils/resumeUtils';

const ResumeReader = () => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = function () {
      const zip = new PizZip(fileReader.result);
      const doc = new Docxtemplater().loadZip(zip);
      doc.render();

      const extractedText = doc.getFullText();

      // Check if the designation is "webDeveloper" in the extracted text
      const designation = "webDeveloper";
      const isWebDeveloper = extractedText.includes(designation);

      if (isWebDeveloper) {
        const details = {
          designation: designation,
          ...extractExperienceDetails(extractedText),
        };

        const jsonDetails = JSON.stringify(details, null, 2);
        const blob = new Blob([jsonDetails], { type: 'application/json' });
        saveAs(blob, 'resume_details.json');
      } else {
        console.log("Invalid designation. Not processing the file.");
      }
    };

    fileReader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <h1>Resume Reader</h1>
      <input type="file" accept=".doc,.docx" onChange={handleFileUpload} />
    </div>
  );
};

export default ResumeReader;
