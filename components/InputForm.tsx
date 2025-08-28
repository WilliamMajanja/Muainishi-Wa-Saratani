
import React, { useRef, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { Loader } from './Loader';

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
  demographicsFile: File | null;
  setDemographicsFile: (file: File | null) => void;
  age: string; setAge: (value: string) => void;
  sex: string; setSex: (value: string) => void;
  bmi: string; setBmi: (value: string) => void;
  bloodPressure: string; setBloodPressure: (value: string) => void;
  onClassify: () => void;
  isLoading: boolean;
  isParsingDemographics: boolean;
  demographicsReadProgress: number | null;
  demographicsLoaded: boolean;
}

const inputStyles = "w-full bg-base-100 border border-base-300 rounded-md p-2 text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-150 ease-in-out disabled:opacity-50 disabled:bg-base-300/30";
const labelStyles = "block text-sm font-medium text-text-secondary mb-1";
const textareaStyles = "w-full bg-base-100 border border-base-300 rounded-md p-3 text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-150 ease-in-out disabled:opacity-50";

export const InputForm: React.FC<InputFormProps> = ({
  clinicalNotes, setClinicalNotes,
  medicalHistory, setMedicalHistory,
  familyHistory, setFamilyHistory,
  geneDataFile, setGeneDataFile,
  imagingReportFile, setImagingReportFile,
  demographicsFile, setDemographicsFile,
  age, setAge,
  sex, setSex,
  bmi, setBmi,
  bloodPressure, setBloodPressure,
  onClassify, isLoading,
  isParsingDemographics,
  demographicsReadProgress,
  demographicsLoaded,
}) => {
  const geneFileInputRef = useRef<HTMLInputElement>(null);
  const imagingFileInputRef = useRef<HTMLInputElement>(null);
  const demographicsFileInputRef = useRef<HTMLInputElement>(null);

  const handleClearFile = (setter: (file: File | null) => void, inputRef: React.RefObject<HTMLInputElement>) => {
    setter(null);
    if (inputRef.current) {
        inputRef.current.value = '';
    }
  };

  const FileUploader = ({ 
    id, 
    file, 
    setter, 
    onClear, 
    inputRef, 
    title, 
    description, 
    disabled, 
    acceptedFormats, 
    isProcessing,
    progress 
  }: any) => {
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleClearClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setError(null);
      onClear();
    };

    const validateFile = (fileToValidate: File): boolean => {
      if (!acceptedFormats) return true;
      const acceptedExtensions = acceptedFormats.split(',').map((t: string) => t.trim().toLowerCase());
      const fileExtension = ('.' + fileToValidate.name.split('.').pop()?.toLowerCase()) || '';
      
      if (acceptedExtensions.includes(fileExtension)) {
          return true;
      }
  
      setError(`Invalid file type. Accepted: ${acceptedFormats.replace(/\./g, ' ').toUpperCase()}`);
      return false;
    };

    const handleFileSelected = (selectedFile: File | undefined) => {
        if (!selectedFile) return;
        if (validateFile(selectedFile)) {
            setError(null);
            setter(selectedFile);
        } else {
            setter(null);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelected(event.target.files?.[0]);
    };

    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      if (!disabled) setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setIsDragging(false);
    }
  
    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      setIsDragging(false);
      if (!disabled) {
        handleFileSelected(event.dataTransfer.files?.[0]);
      }
    };
  
    const borderColor = error ? 'border-red-500' : isDragging ? 'border-brand-primary' : 'border-base-300';
  
    return (
      <div>
        <label className={labelStyles}>{title}</label>
        <div className="relative">
          <label
            htmlFor={id}
            className={`relative flex flex-col items-center justify-center w-full h-32 border-2 ${borderColor} border-dashed rounded-lg ${disabled ? 'cursor-not-allowed bg-base-300/30' : 'cursor-pointer bg-base-100 hover:bg-base-300/50'} transition-all`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
          >
            <div className="flex flex-col items-center justify-center text-center px-4 w-full">
              {file && !isProcessing ? (
                <>
                  <div className="bg-base-300 border border-base-300 rounded-lg py-2 px-4 w-full max-w-xs mx-auto flex items-center justify-between shadow-md">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-secondary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <div className="text-left overflow-hidden">
                        <p className="text-sm font-bold text-brand-secondary truncate" title={file.name}>{file.name}</p>
                        <p className="text-xs text-text-secondary">{Math.round(file.size / 1024)} KB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearClick}
                      className="p-1 rounded-full text-text-secondary hover:bg-base-100 hover:text-red-400 transition-colors flex-shrink-0 ml-2"
                      aria-label="Remove file"
                      disabled={disabled}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-text-secondary mt-3">Drag and drop to replace file.</p>
                </>
              ) : !isProcessing ? (
                <>
                  <UploadIcon className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-text-secondary">
                    <span className="font-semibold text-brand-secondary">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-text-secondary">{description}</p>
                </>
              ) : null}
            </div>
            <input id={id} type="file" ref={inputRef} className="hidden" onChange={handleFileChange} accept={acceptedFormats} disabled={disabled || isProcessing} />
          </label>
          {isProcessing && (
            <div className="absolute inset-0 bg-base-100/80 flex flex-col items-center justify-center rounded-lg p-4">
              {progress != null && progress < 100 ? (
                <>
                  <p className="text-text-secondary text-sm mb-2">Reading file...</p>
                  <div className="w-full bg-base-300 rounded-full h-2.5">
                    <div className="bg-brand-secondary h-2.5 rounded-full transition-all duration-150" style={{ width: `${progress}%` }}></div>
                  </div>
                  <p className="text-text-secondary text-xs mt-1">{Math.round(progress)}%</p>
                </>
              ) : (
                <>
                  <Loader />
                  <p className="text-text-secondary mt-2 text-sm">{progress === 100 ? 'Finalizing...' : 'Parsing file...'}</p>
                </>
              )}
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
      </div>
    );
  };

  return (
    <div className="space-y-6">
       <div>
          <h3 className="text-lg font-semibold text-text-primary mb-3">Patient Demographics & Vitals</h3>
           <p className="text-sm text-text-secondary mb-4">
              Upload a JSON, PDF, DOCX, CSV or XLSX file from your hospital system, or enter the data manually below. The AI will automatically extract the relevant information.
           </p>
           <div className="mb-6">
            <FileUploader
                id="demographics-file-upload"
                file={demographicsFile}
                setter={setDemographicsFile}
                onClear={() => handleClearFile(setDemographicsFile, demographicsFileInputRef)}
                inputRef={demographicsFileInputRef}
                title="Upload Demographics File"
                description="JSON, PDF, DOCX, CSV, XLSX"
                acceptedFormats=".json,.pdf,.docx,.csv,.xlsx"
                disabled={isLoading || isParsingDemographics}
                isProcessing={isParsingDemographics}
                progress={demographicsReadProgress}
             />
           </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="age" className={labelStyles}>Age</label>
              <input id="age" type="number" className={inputStyles} value={age} onChange={(e) => setAge(e.target.value)} disabled={isLoading || isParsingDemographics || demographicsLoaded} />
            </div>
            <div>
              <label htmlFor="sex" className={labelStyles}>Sex</label>
              <select id="sex" className={inputStyles} value={sex} onChange={(e) => setSex(e.target.value)} disabled={isLoading || isParsingDemographics || demographicsLoaded}>
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
             <div>
              <label htmlFor="bmi" className={labelStyles}>BMI</label>
              <input id="bmi" type="number" step="0.1" className={inputStyles} value={bmi} onChange={(e) => setBmi(e.target.value)} disabled={isLoading || isParsingDemographics || demographicsLoaded} placeholder="e.g., 24.5"/>
            </div>
            <div>
              <label htmlFor="bp" className={labelStyles}>Blood Pressure</label>
              <input id="bp" type="text" className={inputStyles} value={bloodPressure} onChange={(e) => setBloodPressure(e.target.value)} disabled={isLoading || isParsingDemographics || demographicsLoaded} placeholder="e.g., 120/80" />
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
              setter={setGeneDataFile}
              onClear={() => handleClearFile(setGeneDataFile, geneFileInputRef)}
              inputRef={geneFileInputRef}
              title="Gene Expression Data"
              description=".CSV, .TSV, or .TXT"
              acceptedFormats=".csv,.tsv,.txt"
              disabled={isLoading || isParsingDemographics}
            />
             <FileUploader 
              id="imaging-file-upload"
              file={imagingReportFile}
              setter={setImagingReportFile}
              onClear={() => handleClearFile(setImagingReportFile, imagingFileInputRef)}
              inputRef={imagingFileInputRef}
              title="Imaging Report File"
              description="e.g. Radiology report .TXT"
              acceptedFormats=".txt,.pdf,.doc,.docx"
              disabled={isLoading || isParsingDemographics}
            />
          </div>
      </div>

      <button
        onClick={onClassify}
        disabled={isLoading || isParsingDemographics || (!clinicalNotes && !medicalHistory && !familyHistory && !geneDataFile && !imagingReportFile)}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-200 focus:ring-brand-primary disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isLoading || isParsingDemographics ? 'Analyzing...' : 'Run Classification'}
      </button>
    </div>
  );
};
