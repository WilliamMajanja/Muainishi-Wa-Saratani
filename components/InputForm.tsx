import React, { useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface InputFormProps {
  clinicalNotes: string;
  setClinicalNotes: (notes: string) => void;
  medicalHistory: string;
  setMedicalHistory: (history: string) => void;
  familyHistory: string;
  setFamilyHistory: (history: string) => void;
  geneDataFile: File | null;
  setGeneDataFile: (file: File | null) => void;
  imagingReportFile: File | null;
  setImagingReportFile: (file: File | null) => void;
  age: string; setAge: (value: string) => void;
  sex: string; setSex: (value: string) => void;
  bmi: string; setBmi: (value: string) => void;
  bloodPressure: string; setBloodPressure: (value: string) => void;
  onClassify: () => void;
  isLoading: boolean;
}

const inputStyles = "w-full bg-base-100 border border-base-300 rounded-md p-2 text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-150 ease-in-out disabled:opacity-50";
const labelStyles = "block text-sm font-medium text-text-secondary mb-1";
const textareaStyles = "w-full bg-base-100 border border-base-300 rounded-md p-3 text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-150 ease-in-out disabled:opacity-50";

export const InputForm: React.FC<InputFormProps> = ({
  clinicalNotes, setClinicalNotes,
  medicalHistory, setMedicalHistory,
  familyHistory, setFamilyHistory,
  geneDataFile, setGeneDataFile,
  imagingReportFile, setImagingReportFile,
  age, setAge,
  sex, setSex,
  bmi, setBmi,
  bloodPressure, setBloodPressure,
  onClassify, isLoading,
}) => {
  const geneFileInputRef = useRef<HTMLInputElement>(null);
  const imagingFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
    if (event.target.files && event.target.files[0]) {
      setter(event.target.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };
  
  const handleDrop = (event: React.DragEvent<HTMLLabelElement>, setter: (file: File | null) => void) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
        setter(event.dataTransfer.files[0]);
    }
  };

  const FileUploader = ({ id, file, onFileChange, onDrop, inputRef, title, description, disabled, acceptedFormats }: any) => (
    <div>
      <label className={labelStyles}>{title}</label>
      <label 
        htmlFor={id} 
        className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-base-300 border-dashed rounded-lg cursor-pointer bg-base-100 hover:bg-base-300/50 transition-colors"
        onDragOver={handleDragOver}
        onDrop={onDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
          <UploadIcon className="w-8 h-8 mb-3 text-gray-400" />
          <p className="mb-2 text-sm text-text-secondary">
            <span className="font-semibold text-brand-secondary">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-text-secondary">{description}</p>
          {file && <p className="text-xs text-brand-secondary mt-2 px-2 truncate max-w-full">{file.name}</p>}
        </div>
        <input id={id} type="file" ref={inputRef} className="hidden" onChange={onFileChange} accept={acceptedFormats} disabled={disabled} />
      </label>
    </div>
  );

  return (
    <div className="space-y-6">
       <div>
          <h3 className="text-lg font-semibold text-text-primary mb-3">Patient Demographics & Vitals</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="age" className={labelStyles}>Age</label>
              <input id="age" type="number" className={inputStyles} value={age} onChange={(e) => setAge(e.target.value)} disabled={isLoading} />
            </div>
            <div>
              <label htmlFor="sex" className={labelStyles}>Sex</label>
              <select id="sex" className={inputStyles} value={sex} onChange={(e) => setSex(e.target.value)} disabled={isLoading}>
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
             <div>
              <label htmlFor="bmi" className={labelStyles}>BMI</label>
              <input id="bmi" type="number" step="0.1" className={inputStyles} value={bmi} onChange={(e) => setBmi(e.target.value)} disabled={isLoading} placeholder="e.g., 24.5"/>
            </div>
            <div>
              <label htmlFor="bp" className={labelStyles}>Blood Pressure</label>
              <input id="bp" type="text" className={inputStyles} value={bloodPressure} onChange={(e) => setBloodPressure(e.target.value)} disabled={isLoading} placeholder="e.g., 120/80" />
            </div>
          </div>
        </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Patient History</h3>
        <div className="space-y-4">
           <div>
            <label htmlFor="clinical-notes" className={labelStyles}>
              Clinical Notes
            </label>
            <textarea
              id="clinical-notes"
              rows={6}
              className={textareaStyles}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="e.g., 55-year-old female, non-smoker, presenting with a persistent cough..."
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="medical-history" className={labelStyles}>
                Past Medical History
            </label>
            <textarea
                id="medical-history"
                rows={4}
                className={textareaStyles}
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                placeholder="e.g., History of hypertension, diagnosed 5 years ago. No prior malignancies."
                disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="family-history" className={labelStyles}>
                Family History
            </label>
            <textarea
                id="family-history"
                rows={4}
                className={textareaStyles}
                value={familyHistory}
                onChange={(e) => setFamilyHistory(e.target.value)}
                placeholder="e.g., Mother diagnosed with breast cancer at age 60. Father has history of heart disease."
                disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Genomic & Imaging Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FileUploader 
              id="gene-file-upload"
              file={geneDataFile}
              onFileChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, setGeneDataFile)}
              onDrop={(e: React.DragEvent<HTMLLabelElement>) => handleDrop(e, setGeneDataFile)}
              inputRef={geneFileInputRef}
              title="Gene Expression Data"
              description=".CSV, .TSV, or .TXT"
              acceptedFormats=".csv,.tsv,.txt"
              disabled={isLoading}
            />
             <FileUploader 
              id="imaging-file-upload"
              file={imagingReportFile}
              onFileChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, setImagingReportFile)}
              onDrop={(e: React.DragEvent<HTMLLabelElement>) => handleDrop(e, setImagingReportFile)}
              inputRef={imagingFileInputRef}
              title="Imaging Report File"
              description="e.g. Radiology report .TXT"
              acceptedFormats=".txt,.pdf,.doc,.docx"
              disabled={isLoading}
            />
          </div>
      </div>

      <button
        onClick={onClassify}
        disabled={isLoading || (!clinicalNotes && !medicalHistory && !familyHistory && !geneDataFile && !imagingReportFile)}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-primary disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isLoading ? 'Analyzing...' : 'Run Classification'}
      </button>
    </div>
  );
};