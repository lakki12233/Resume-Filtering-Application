export const extractExperienceDetails = (text) => {
    const experiencePattern = /\d+\s*(year|yr|years|yrs)/gi;
    const matches = text.match(experiencePattern);
  
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
  