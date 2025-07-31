import { setPersonalDetail, setMultipleDetails, addToArray } from '../store/slices/personalDetailsSlice';

const storagePatterns = [

  {
    regex: /(?:my name is|i am|i'm|call me)\s+([a-zA-Z\s]+?)(?:\s*[.!?]|$)/i,
    field: 'name',
    extract: (match) => match[1].trim()
  },

  {
    regex: /(?:i am|i'm|my age is)\s+(\d+)(?:\s+years?\s+old)?/i,
    field: 'age',
    extract: (match) => match[1]
  },
 
  {
    regex: /(?:i live in|i am from|my location is|i'm from)\s+([a-zA-Z\s,]+)/i,
    field: 'location',
    extract: (match) => match[1].trim()
  },
  
  {
    regex: /(?:i work as|i am a|i'm a|my job is|i work in)\s+([a-zA-Z\s]+)/i,
    field: 'occupation',
    extract: (match) => match[1].trim()
  },

  {
    regex: /(?:my email is|email is)\s+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
    field: 'email',
    extract: (match) => match[1]
  },

  {
    regex: /(?:my phone is|phone number is|my number is)\s+([\d\s\-\+\(\)]+)/i,
    field: 'phone',
    extract: (match) => match[1].trim()
  },

  {
    regex: /(?:my hobbies are|i like|i enjoy|my hobby is)\s+([a-zA-Z\s,]+)/i,
    field: 'hobbies',
    extract: (match) => match[1].split(',').map(item => item.trim()).filter(item => item.length > 0),
    isArray: true
  }
];

const queryPatterns = [

  {
    regex: /(?:what is my name|what's my name|who am i|my name\?)/i,
    field: 'name',
    response: (value) => value ? `Your name is ${value}.` : "I don't have your name stored. You can tell me by saying 'My name is [your name]'."
  },

  {
    regex: /(?:what is my age|how old am i|my age\?)/i,
    field: 'age',
    response: (value) => value ? `You are ${value} years old.` : "I don't have your age stored. You can tell me by saying 'I am [age] years old'."
  },

  {
    regex: /(?:where do i live|what is my location|where am i from|my location\?)/i,
    field: 'location',
    response: (value) => value ? `You live in ${value}.` : "I don't have your location stored. You can tell me by saying 'I live in [location]'."
  },
 
  {
    regex: /(?:what is my job|what do i do|my occupation|my job\?)/i,
    field: 'occupation',
    response: (value) => value ? `You work as a ${value}.` : "I don't have your occupation stored. You can tell me by saying 'I work as [occupation]'."
  },
 
  {
    regex: /(?:what is my email|my email\?)/i,
    field: 'email',
    response: (value) => value ? `Your email is ${value}.` : "I don't have your email stored. You can tell me by saying 'My email is [email]'."
  },

  {
    regex: /(?:what is my phone|my phone number|my number\?)/i,
    field: 'phone',
    response: (value) => value ? `Your phone number is ${value}.` : "I don't have your phone number stored. You can tell me by saying 'My phone is [number]'."
  },
 
  {
    regex: /(?:what are my hobbies|my hobbies|what do i like\?)/i,
    field: 'hobbies',
    response: (value) => {
      if (Array.isArray(value) && value.length > 0) {
        return `Your hobbies are: ${value.join(', ')}.`;
      }
      return "I don't have your hobbies stored. You can tell me by saying 'My hobbies are [hobbies]'."
    }
  },

  {
    regex: /(?:what do you know about me|my details|my information|tell me about myself)/i,
    field: 'all',
    response: (personalDetails) => {
      const details = [];
      if (personalDetails.name) details.push(`Name: ${personalDetails.name}`);
      if (personalDetails.age) details.push(`Age: ${personalDetails.age}`);
      if (personalDetails.location) details.push(`Location: ${personalDetails.location}`);
      if (personalDetails.occupation) details.push(`Occupation: ${personalDetails.occupation}`);
      if (personalDetails.email) details.push(`Email: ${personalDetails.email}`);
      if (personalDetails.phone) details.push(`Phone: ${personalDetails.phone}`);
      if (personalDetails.hobbies && personalDetails.hobbies.length > 0) {
        details.push(`Hobbies: ${personalDetails.hobbies.join(', ')}`);
      }
      

      if (personalDetails.customDetails) {
        Object.keys(personalDetails.customDetails).forEach(key => {
          details.push(`${key}: ${personalDetails.customDetails[key]}`);
        });//add custom detial
      }
      
      if (details.length === 0) {
        return "I don't have any personal information about you stored yet. You can share details like your name, age, location, etc.";
      }
      
      return `Here's what I know about you:\n\n${details.join('\n')}`;
    }
  }
];

export const processMessage = (message, personalDetails, dispatch) => {
  const lowerMessage = message.toLowerCase().trim();
  
  console.log('Processing message:', message);
  console.log('Current personal details:', personalDetails);
  

  for (const pattern of storagePatterns) {
    const match = message.match(pattern.regex);
    if (match) {
      console.log('Storage match found:', pattern.field, match);
      const extractedValue = pattern.extract(match);
      
      if (pattern.isArray) {

        extractedValue.forEach(item => {
          dispatch(addToArray({ field: pattern.field, value: item }));
        });
        return {
          isPersonalStorage: true,
          response: `Got it! I've saved your ${pattern.field}: ${extractedValue.join(', ')}.`
        };
      } else {
 
        console.log('Dispatching setPersonalDetail:', { field: pattern.field, value: extractedValue });
        dispatch(setPersonalDetail({ field: pattern.field, value: extractedValue }));
        return {
          isPersonalStorage: true,
          response: `Got it! I've saved that your ${pattern.field} is ${extractedValue}.`
        };
      }
    }
  }

  for (const pattern of queryPatterns) {
    if (pattern.regex.test(lowerMessage)) {
      console.log('Query match found:', pattern.field);
      if (pattern.field === 'all') {
        return {
          isPersonalQuery: true,
          response: pattern.response(personalDetails)
        };
      } else {
        const value = personalDetails[pattern.field];
        console.log('Retrieved value:', value);
        return {
          isPersonalQuery: true,
          response: pattern.response(value)
        };
      }
    }
  }

  return null;
};