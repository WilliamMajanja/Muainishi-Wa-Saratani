export interface InfluentialMarker {
  marker: string;
  importance: number;
}

export interface TopClassification {
  type: string;
  probability: number;
}

export interface TreatmentOption {
  optionName: string;
  description: string;
  rationale: string;
  evidenceLevel: string;
}

export interface ClassificationResult {
  classification: string;
  confidence: number;
  summary: string;
  influential_markers: InfluentialMarker[];
  top_classifications: TopClassification[];
  treatment_options: TreatmentOption[];
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

export interface GroundedInfo {
  summary: string;
  sources: GroundingChunk[];
}

export interface Demographics {
  age: string;
  sex: string;
  bmi: string;
  bloodPressure: string;
}