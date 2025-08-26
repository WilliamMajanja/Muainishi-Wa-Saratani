
import { GoogleGenAI, Type } from "@google/genai";
import type { ClassificationResult, Demographics, GroundingChunk, GroundedInfo } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const treatmentOptionSchema = {
    type: Type.OBJECT,
    properties: {
        optionName: { type: Type.STRING, description: "The name of the treatment option (e.g., 'Chemotherapy', 'Targeted Therapy: Trastuzumab', 'Immunotherapy')." },
        description: { type: Type.STRING, description: "A brief description of what the treatment entails." },
        rationale: { type: Type.STRING, description: "A detailed rationale explaining why this option is suitable based on the patient's data, cancer type, and prognosis." },
        evidenceLevel: { type: Type.STRING, description: "The level of evidence supporting this option (e.g., 'Standard of Care', 'Emerging', 'Clinical Trial Option')." }
    },
    required: ["optionName", "description", "rationale", "evidenceLevel"]
};

const classificationSchema = {
  type: Type.OBJECT,
  properties: {
    classification: { type: Type.STRING, description: "The most likely cancer type and subtype (e.g., 'Breast Cancer, HER2-Positive')." },
    confidence: { type: Type.NUMBER, description: "A confidence score from 0.0 to 1.0 for the classification." },
    summary: { type: Type.STRING, description: "A detailed summary explaining the reasoning behind the classification, citing specific markers and data points from the provided information." },
    influential_markers: {
      type: Type.ARRAY,
      description: "A list of the top 5 most influential genetic or clinical markers for this classification.",
      items: {
        type: Type.OBJECT,
        properties: {
          marker: { type: Type.STRING, description: "The name of the marker (e.g., 'GENE_X' or 'Age')." },
          importance: { type: Type.NUMBER, description: "A normalized importance score from 0 to 100." }
        },
        required: ["marker", "importance"]
      }
    },
    top_classifications: {
      type: Type.ARRAY,
      description: "A list of the top 3-5 potential classifications and their probabilities.",
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, description: "The cancer type." },
          probability: { type: Type.NUMBER, description: "The probability score from 0.0 to 1.0." }
        },
        required: ["type", "probability"]
      }
    },
    treatment_options: {
        type: Type.ARRAY,
        description: "A list of rational treatment options based on the prognosis. These are for informational purposes for healthcare professionals.",
        items: treatmentOptionSchema
    }
  },
  required: ["classification", "confidence", "summary", "influential_markers", "top_classifications", "treatment_options"]
};

export const classifyOncologicalData = async (
  clinicalNotes: string,
  medicalHistory: string,
  familyHistory: string,
  geneData: string,
  imagingReport: string,
  demographics: Demographics
): Promise<ClassificationResult> => {
  const prompt = `
    Please classify the following patient case based on the provided data. You must provide a comprehensive analysis.
    ---
    PATIENT DEMOGRAPHICS & VITALS:
    Age: ${demographics.age || 'Not provided'}
    Sex: ${demographics.sex || 'Not provided'}
    BMI: ${demographics.bmi || 'Not provided'}
    Blood Pressure: ${demographics.bloodPressure || 'Not provided'}
    ---
    PATIENT HISTORY:
    Clinical Notes:
    ${clinicalNotes || 'No clinical notes provided.'}

    Medical History:
    ${medicalHistory || 'No medical history provided.'}

    Family History:
    ${familyHistory || 'No family history provided.'}
    ---
    GENE EXPRESSION DATA (e.g., CSV format):
    ${geneData || 'No gene data provided.'}
    ---
    MEDICAL IMAGING REPORT:
    ${imagingReport || 'No imaging report provided.'}
    ---
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: "You are an AI-powered oncological classification expert. Your function is to analyze genomic, clinical, demographic, and historical data to provide a probable cancer diagnosis and prognosis. Based on your analysis, also generate a set of rational, evidence-based treatment options for consideration by a qualified healthcare professional. Adhere strictly to the provided JSON schema for your response. Your analysis should be based on established oncological markers and clinical indicators.",
      responseMimeType: "application/json",
      responseSchema: classificationSchema,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Received an empty response from the API.");
  }

  try {
    return JSON.parse(text) as ClassificationResult;
  } catch (error) {
    console.error("Failed to parse JSON response:", text);
    throw new Error("The API returned a response that was not valid JSON.");
  }
};


export const fetchGroundedInformation = async (cancerType: string): Promise<GroundedInfo> => {
    const prompt = `Provide a concise overview for a healthcare professional about the prognosis, common genetic mutations, and standard-of-care treatment options for ${cancerType}.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const summary = response.text;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources: GroundingChunk[] = groundingMetadata?.groundingChunks?.filter(
        (chunk): chunk is GroundingChunk => 'web' in chunk && chunk.web.uri !== ''
    ) ?? [];
    
    if (!summary) {
        throw new Error("Received no summary from the grounded information API.");
    }
    
    return { summary, sources };
};

export const extractDemographicsFromFile = async (
  base64Data: string,
  mimeType: string
): Promise<Demographics> => {
  const demographicsSchema = {
    type: Type.OBJECT,
    properties: {
        age: { type: Type.STRING, description: "Patient's age in years. Should be a number as a string." },
        sex: { type: Type.STRING, description: "Patient's sex (e.g., 'Male', 'Female', 'Other')." },
        bmi: { type: Type.STRING, description: "Patient's Body Mass Index (BMI). Should be a number as a string." },
        bloodPressure: { type: Type.STRING, description: "Patient's blood pressure (e.g., '120/80')." }
    },
  };

  const prompt = `
    Analyze the provided document and extract the following patient demographic and vital information:
    - Age (in years)
    - Sex
    - BMI (Body Mass Index)
    - Blood Pressure (e.g., 120/80)

    Return the extracted information in a structured JSON format. If any piece of information cannot be found, omit the key or set its value to an empty string.
  `;

  const filePart = {
    inlineData: {
      mimeType: mimeType,
      data: base64Data,
    },
  };

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: { parts: [filePart, { text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: demographicsSchema,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Received an empty response from the file parsing API.");
  }
  
  try {
    const parsed = JSON.parse(text);
    return {
        age: parsed.age || '',
        sex: parsed.sex || '',
        bmi: parsed.bmi || '',
        bloodPressure: parsed.bloodPressure || '',
    };
  } catch (error) {
    console.error("Failed to parse JSON response from file parsing:", text);
    throw new Error("The API returned invalid JSON while parsing the file.");
  }
};
