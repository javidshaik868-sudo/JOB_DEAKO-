import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, Badge } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { PageHeader, ErrorState } from '../../components/common/Feedback';
import { Icon } from '../../components/icons/Icon';
import { resumeApi } from '../../services/resumeApi';
import { useToast } from '../../context/ToastContext';

export const ResumeAnalyzerPage = () => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const toast = useToast();

  const analyzeMutation = useMutation({
    mutationFn: (f) => resumeApi.analyzeResume(f),
    onSuccess: (data) => {
      setAnalysisResult(data);
      toast.success('Resume analyzed successfully!');
    },
    onError: (err) => {
      toast.error(err.message || 'Analysis failed. Please try a different PDF.');
    },
  });

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      analyzeMutation.mutate(selected);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      analyzeMutation.mutate(dropped);
    }
  };

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      <PageHeader
        title="AI Resume Scanner & ATS Analyzer"
        subtitle="Benchmark your resume against modern Applicant Tracking Systems and keyword filters"
      />

      {/* Upload Zone */}
      {!analysisResult && (
        <Card style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            style={{
              border: '2px dashed var(--border-primary)',
              borderRadius: 'var(--radius-xl)',
              padding: '3rem 1.5rem',
              backgroundColor: 'var(--bg-secondary)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'border-color var(--transition-fast)',
            }}
            onClick={() => document.getElementById('resume-file-input')?.click()}
          >
            <input
              id="resume-file-input"
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <Icon name="upload" size={28} />
            </div>

            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              {analyzeMutation.isPending ? 'Analyzing Resume Semantics...' : 'Upload your resume to scan'}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.375rem', margin: '0.375rem 0 1.25rem' }}>
              Drag and drop your PDF or DOCX file (Maximum 10 MB)
            </p>

            {analyzeMutation.isPending ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-primary)' }}>
                <Spinner size={20} />
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Running ATS Parser...</span>
              </div>
            ) : (
              <Button variant="primary" size="md">
                Select File from Device
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Analysis Results View */}
      {analysisResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Top Score Banner */}
          <Card style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: '50%',
                    border: '4px solid var(--color-primary)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-glow-lime)',
                    backgroundColor: 'var(--bg-tertiary)',
                  }}
                >
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>
                    {analysisResult.overallScore}
                  </span>
                  <span style={{ fontSize: '0.625rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    ATS Score
                  </span>
                </div>

                <div>
                  <Badge variant="lime" size="md" dot>
                    {analysisResult.status}
                  </Badge>
                  <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#FFFFFF', margin: '0.375rem 0 0' }}>
                    {analysisResult.fileName}
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0 0' }}>
                    Your document ranks higher than 84% of candidate profiles in modern tech queues.
                  </p>
                </div>
              </div>

              <Button
                variant="secondary"
                size="md"
                onClick={() => setAnalysisResult(null)}
                leftIcon={<Icon name="refresh" size={16} />}
              >
                Scan Another File
              </Button>
            </div>

            {/* Sub-scores */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                marginTop: '2rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              {analysisResult.categories?.map((cat) => (
                <div key={cat.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                    <span>{cat.name}</span>
                    <span style={{ color: 'var(--color-primary)' }}>{cat.score}%</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, backgroundColor: 'var(--bg-secondary)', marginTop: '0.375rem', overflow: 'hidden' }}>
                    <div style={{ width: `${cat.score}%`, height: '100%', backgroundColor: 'var(--color-primary)' }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Keywords Match Matrix */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <Card style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Icon name="check-circle" size={18} color="var(--color-primary)" />
                <span>Detected Keywords & Skills</span>
              </h3>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                {analysisResult.matchingSkills?.map((s) => (
                  <Badge key={s} variant="emerald" size="md">
                    {s}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Icon name="warning" size={18} color="var(--color-warning)" />
                <span>High-Value Missing Keywords</span>
              </h3>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                {analysisResult.missingKeywords?.map((s) => (
                  <Badge key={s} variant="amber" size="md">
                    + {s}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Actionable Suggestions */}
          <Card style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '1rem' }}>
              AI Optimization Recommendations
            </h3>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              {analysisResult.suggestions?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
};
export default ResumeAnalyzerPage;
