
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { classifyOncologicalData, fetchGroundedInformation, extractDemographicsFromFile } from './services/geminiService';
import type { ClassificationResult, GroundedInfo } from './types';
import { Loader } from './components/Loader';

const App: React.FC = () => {
  const [clinicalNotes, setClinicalNotes] = useState<string>('');
  const [medicalHistory, setMedicalHistory] = useState<string>('');
  const [familyHistory, setFamilyHistory] = useState<string>('');
  const [geneDataFile, setGeneDataFile] = useState<File | null>(null);
  const [imagingReportFile, setImagingReportFile] = useState<File | null>(null);
  const [demographicsFile, setDemographicsFile] = useState<File | null>(null);
  const [age, setAge] = useState<string>('');
  const [sex, setSex] = useState<string>('');
  const [bmi, setBmi] = useState<string>('');
  const [bloodPressure, setBloodPressure] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isParsingDemographics, setIsParsingDemographics] = useState<boolean>(false);
  const [demographicsReadProgress, setDemographicsReadProgress] = useState<number | null>(null);
  const [demographicsLoaded, setDemographicsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [classificationResult, setClassificationResult] = useState<ClassificationResult | null>(null);
  const [groundedInfo, setGroundedInfo] = useState<GroundedInfo | null>(null);
  const [isFetchingInfo, setIsFetchingInfo] = useState<boolean>(false);

  useEffect(() => {
    if (!demographicsFile) {
      setAge('');
      setSex('');
      setBmi('');
      setBloodPressure('');
      setDemographicsLoaded(false);
      setDemographicsReadProgress(null);
      return;
    }

    const fileToDataUrl = (file: File, onProgress: (percent: number) => void): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            
            reader.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percent = (event.loaded / event.total) * 100;
                    onProgress(percent);
                }
            };

            reader.onload = () => {
                onProgress(100);
                resolve(reader.result as string);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const processFile = async () => {
        setIsParsingDemographics(true);
        setDemographicsReadProgress(0);
        setDemographicsLoaded(false);
        setError(null);
        try {
            if (demographicsFile.type === 'application/json') {
                const text = await demographicsFile.text();
                const data = JSON.parse(text);
                if (data.age !== undefined) setAge(String(data.age));
                if (data.sex) setSex(data.sex);
                if (data.bmi !== undefined) setBmi(String(data.bmi));
                if (data.bloodPressure) setBloodPressure(data.bloodPressure);
                setDemographicsReadProgress(100);
            } else {
                const dataUrl = await fileToDataUrl(demographicsFile, setDemographicsReadProgress);
                const base64Data = dataUrl.split(',')[1];
                const extractedData = await extractDemographicsFromFile(base64Data, demographicsFile.type);
                
                if (extractedData.age) setAge(String(extractedData.age));
                if (extractedData.sex) setSex(extractedData.sex);
                if (extractedData.bmi) setBmi(String(extractedData.bmi));
                if (extractedData.bloodPressure) setBloodPressure(extractedData.bloodPressure);
            }
            setDemographicsLoaded(true);
        } catch (err) {
            console.error("Error processing demographics file:", err);
            setError(`Failed to process demographics file. Please check the file content and try again.`);
            setDemographicsFile(null); // This will trigger the effect to clear state
        } finally {
            setIsParsingDemographics(false);
            setTimeout(() => setDemographicsReadProgress(null), 1000);
        }
    };
    
    processFile();
  }, [demographicsFile]);

  const handleClassify = useCallback(async () => {
    if (!clinicalNotes && !geneDataFile && !imagingReportFile && !medicalHistory && !familyHistory) {
      setError('Please provide patient history or a data file (gene data, imaging report).');
      return;
    }

    setIsLoading(true);
    setError(null);
    setClassificationResult(null);
    setGroundedInfo(null);

    try {
      let geneData = '';
      if (geneDataFile) {
        geneData = await geneDataFile.text();
      }
      let imagingReport = '';
      if (imagingReportFile) {
        imagingReport = await imagingReportFile.text();
      }
      const demographics = { age, sex, bmi, bloodPressure };
      
      const result = await classifyOncologicalData(clinicalNotes, medicalHistory, familyHistory, geneData, imagingReport, demographics);
      setClassificationResult(result);

    } catch (e) {
      console.error(e);
      setError('Failed to get classification. The model may be unable to process the request. Please check your input and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [clinicalNotes, medicalHistory, familyHistory, geneDataFile, imagingReportFile, age, sex, bmi, bloodPressure]);

  const handleFetchInfo = useCallback(async () => {
    if (!classificationResult) return;

    setIsFetchingInfo(true);
    setGroundedInfo(null);
    setError(null);
    
    try {
      const info = await fetchGroundedInformation(classificationResult.classification);
      setGroundedInfo(info);
    } catch (e) {
      console.error(e);
      setError('Failed to fetch detailed information. Please try again later.');
    } finally {
      setIsFetchingInfo(false);
    }
  }, [classificationResult]);


  return (
    <div className="min-h-screen bg-base-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-base-200 p-6 rounded-lg shadow-lg border border-base-300">
            <h2 className="text-2xl font-bold mb-4 text-brand-secondary">Submit New Case for Analysis</h2>
            <p className="text-text-secondary mb-6">Provide patient data, clinical notes, and/or upload relevant files for AI-powered classification.</p>
            <InputForm
              clinicalNotes={clinicalNotes}
              setClinicalNotes={setClinicalNotes}
              medicalHistory={medicalHistory}
              setMedicalHistory={setMedicalHistory}
              familyHistory={familyHistory}
              setFamilyHistory={setFamilyHistory}
              geneDataFile={geneDataFile}
              setGeneDataFile={setGeneDataFile}
              imagingReportFile={imagingReportFile}
              setImagingReportFile={setImagingReportFile}
              demographicsFile={demographicsFile}
              setDemographicsFile={setDemographicsFile}
              age={age} setAge={setAge}
              sex={sex} setSex={setSex}
              bmi={bmi} setBmi={setBmi}
              bloodPressure={bloodPressure} setBloodPressure={setBloodPressure}
              onClassify={handleClassify}
              isLoading={isLoading}
              isParsingDemographics={isParsingDemographics}
              demographicsReadProgress={demographicsReadProgress}
              demographicsLoaded={demographicsLoaded}
            />
          </div>

          {error && (
            <div className="mt-8 bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {isLoading && !isParsingDemographics && (
            <div className="mt-8 flex flex-col items-center justify-center text-center">
              <Loader />
              <p className="text-lg text-text-secondary mt-4">Analyzing data... This may take a moment.</p>
            </div>
          )}

          {classificationResult && !isLoading && (
            <div className="mt-8">
              <ResultsDisplay 
                result={classificationResult}
                groundedInfo={groundedInfo}
                onFetchInfo={handleFetchInfo}
                isFetchingInfo={isFetchingInfo}
              />
            </div>
          )}
        </div>
      </main>
       <footer className="text-center p-4 text-text-secondary text-sm">
          <p>Muainishi Wa Saratani &copy; 2024. For research and informational purposes only.</p>
      </footer>
    </div>
  );
};

export default App;
