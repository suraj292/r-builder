import { useState } from 'react';
import { api } from '../lib/api';
import { useResumeStore } from '../store/useResumeStore';
import { useEditorStore } from '../store/useEditorStore';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
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
  const { isUploading, isAnalyzing, isOptimizing, atsAnalysis, setAIState } = useEditorStore();
  const { canUseFeature, openUpgradeModal } = useSubscriptionStore();
  
  // Local state for JD and Profession (fine to keep local as they are only used in Sidebar)
  const [jobDescription, setJobDescription] = useState('');
  const [targetProfession, setTargetProfession] = useState(resume.metadata.targetOccupation || 'Software Developer');

  const handleUploadResume = async (file: File) => {
    try {
      setAIState({ isUploading: true });
      const formData = new FormData();
      formData.append('file', file);
      
      const { parsed_resume } = await api.post<{parsed_resume: ResumeSchema}>('/v1/ai/parse-resume', formData);
      
      setFullResume(parsed_resume);
      await handleAnalyzeATS(parsed_resume);
      
    } catch (err) {
      console.error("Failed to parse resume", err);
      showAlert.error("Parse Failure", "Failed to parse resume file.");
    } finally {
      setAIState({ isUploading: false });
    }
  };

  const handleAnalyzeATS = async (currentResume?: ResumeSchema) => {
    // Feature gate: check ATS scan credits
    if (!canUseFeature('ats_scan')) {
      openUpgradeModal('ats_scan');
      return;
    }

    try {
      setAIState({ isAnalyzing: true });
      const dataToAnalyze = currentResume || resume;
      const deviceInfo = `${navigator.platform} - ${navigator.vendor}`;
      
      const analysis = await api.post<ATSAnalysis>('/v1/ai/analyze-ats', {
        resume_data: dataToAnalyze,
        job_description: jobDescription,
        target_profession: targetProfession,
        device_info: deviceInfo
      });
      
      setAIState({ atsAnalysis: analysis });
    } catch (err) {
      console.error("Failed to analyze ATS", err);
    } finally {
      setAIState({ isAnalyzing: false });
    }
  };

  const handleOptimizeResume = async () => {
    // Feature gate: check AI generation credits
    if (!canUseFeature('ai_generation')) {
      openUpgradeModal('ai_generation');
      return;
    }

    try {
      setAIState({ isOptimizing: true });
      
      const analysisWithId = {
        ...(atsAnalysis || {}),
        resume_id: useResumeStore.getState().resumeId
      };

      const { optimized_resume } = await api.post<{optimized_resume: ResumeSchema}>('/v1/ai/optimize-resume', {
        resume_data: resume,
        job_description: jobDescription,
        target_profession: targetProfession,
        ats_analysis: analysisWithId
      });
      
      setFullResume(optimized_resume);
      await handleAnalyzeATS(optimized_resume);
      
    } catch (err) {
      console.error("Failed to optimize resume", err);
      showAlert.error("Optimization Failed", "Failed to optimize resume.");
    } finally {
      setAIState({ isOptimizing: false });
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

