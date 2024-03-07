import React from 'react';
import * as Docxtemplater from 'docxtemplater'; //library is specifically designed for working with DOCX templates. It allows you to load a DOCX file into the Docxtemplater object, which then provides methods and utilities to manipulate and fill the template with dynamic data.
import PizZip from 'pizzip'; // library is used to handle the zip compression  format used by DOCX files. It provides the capability to create, modify, and extract zip files
import { saveAs } from 'file-saver'; //

const extractExperienceDetails = (text) => {
  const details = {
    name: '',
    experience: '',
    skills: [],
  };

  const namePattern = /NAME:\s*([\w\s]+)/i;
  const experiencePattern = /Experience:\s*(\d+)\s*(year|yr|years|yrs)/i;
  const skillsPattern = /\b(C\+\+|JAVA)\b/gi;


  const nameMatch = text.match(namePattern);
  const experienceMatch = text.match(experiencePattern);
  const skillsMatch = text.match(skillsPattern);

  if (nameMatch && nameMatch[1]) {
    details.name = nameMatch[1].trim();
  }

  if (experienceMatch && experienceMatch[1]) {
    details.experience = experienceMatch[1].trim();
  }

  if (skillsMatch && skillsMatch[1]) {
    details.skills = skillsMatch[1].split(',').map(skill => skill.trim());
  }

  return details;
};


const App = () => {
  const handleFileUpload = async (event) => {   ////This code declares an asynchronous function named handleFileUpload that takes an event parameter. This function handles the file upload event triggered by the user.
    const file = event.target.files[0];       // //This line retrieves the uploaded file from the event object. event.target.files represents an array-like object that holds the selected files. In this case, we assume that only one file is being uploaded, so we access the first file using the index [0] and assign it to the file variable
    const fileReader = new FileReader();

    fileReader.onload = async (e) => {
      const arrayBuffer = e.target.result;

      const zip = new PizZip(arrayBuffer); // //passing the arrayBuffer as a parameter. The arrayBuffer represents the binary data of the DOCX file that was previously read using 
      const doc = new Docxtemplater().loadZip(zip); //  //object and loads the created zip object into it using the loadZip method. Docxtemplater is a library that provides functionalities to manipulate and modify DOCX templates.

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
            const blob = new Blob([jsonDetails], { type: 'application/json' }); //// This code creates a new Blob object that represents the JSON data. The Blob constructor takes an array as the first argument, where we pass the jsonDetails string wrapped in an array. The second argument is an options object that specifies the MIME type of the data. In this case, it is set to 'application/json' to indicate that the data is in JSON format. The resulting Blob object is assigned to the blob variable.
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
