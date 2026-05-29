import { useState } from 'react';
import { api } from '../lib/api';
import { useResumeStore } from '../store/useResumeStore';
import type { ResumeSchema } from '../types/resume';
import { showAlert } from '../lib/alerts';

export interface ATSIssue {
  type: 'missing_keyword' | 'weak_action_verb' | 'formatting' | 'length';
  message: string;
  severity: 'high' | 'medium' | 'low';
}

export interface ATSAnalysis {
  score: number;
  readability: number;
  keywordDensity: number;
  issues: ATSIssue[];
  missingKeywords: string[];
}

export const useAIOptimizer = () => {
  const { setFullResume, resume } = useResumeStore();
  
  // State
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  
  // Target Profession
  const [targetProfession, setTargetProfession] = useState(resume.metadata.targetOccupation || 'Software Engineer');

  const handleUploadResume = async (file: File) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      // Call backend to parse resume (mocked here, implement in api later)
      const { parsed_resume } = await api.post<{parsed_resume: ResumeSchema}>('/v1/ai/parse-resume', formData);
      
      setFullResume(parsed_resume);
      
      // Auto-trigger ATS check after parse
      await handleAnalyzeATS(parsed_resume);
      
    } catch (err) {
      console.error("Failed to parse resume", err);
      showAlert.error("Parse Failure", "Failed to parse resume file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyzeATS = async (currentResume?: ResumeSchema) => {
    try {
      setIsAnalyzing(true);
      const dataToAnalyze = currentResume || resume;
      
      // Call backend to analyze ATS score against optional JD
      const analysis = await api.post<ATSAnalysis>('/v1/ai/analyze-ats', {
        resume_data: dataToAnalyze,
        job_description: jobDescription,
        target_profession: targetProfession
      });
      
      setAtsAnalysis(analysis);
    } catch (err) {
      console.error("Failed to analyze ATS", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOptimizeResume = async () => {
    try {
      setIsOptimizing(true);
      
      // Send current resume + JD + ATS results to backend for optimization
      const { optimized_resume } = await api.post<{optimized_resume: ResumeSchema}>('/v1/ai/optimize-resume', {
        resume_data: resume,
        job_description: jobDescription,
        target_profession: targetProfession,
        ats_analysis: atsAnalysis || {}
      });
      
      setFullResume(optimized_resume);
      
      // Re-run ATS check to show new score
      await handleAnalyzeATS(optimized_resume);
      
    } catch (err) {
      console.error("Failed to optimize resume", err);
      showAlert.error("Optimization Failed", "Failed to optimize resume.");
    } finally {
      setIsOptimizing(false);
    }
  };

  return {
    isUploading,
    isAnalyzing,
    isOptimizing,
    atsAnalysis,
    jobDescription,
    setJobDescription,
    targetProfession,
    setTargetProfession,
    handleUploadResume,
    handleAnalyzeATS,
    handleOptimizeResume
  };
};
