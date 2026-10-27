import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../common/Modal';
import { Input, Textarea, Select } from '../common/Input';
import { Button } from '../common/Button';
import { Icon } from '../icons/Icon';
import { applicationsApi } from '../../services/applicationsApi';
import { useToast } from '../../context/ToastContext';

export const ApplyJobModal = ({ isOpen, onClose, job }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    resumeId: 'default-resume',
    expectedSalary: '₹30 LPA',
    noticePeriod: 'Immediate to 15 Days',
    coverLetter: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const applyMutation = useMutation({
    mutationFn: (payload) => applicationsApi.submitApplication(job.id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['recentApplications'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application submitted successfully!');
      onClose();
      navigate(`/app/application-success?applicationId=${data.id}&jobTitle=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}`);
    },
    onError: (err) => {
      setError(err.message || 'Failed to submit application. Please try again.');
      toast.error('Application submission failed');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    applyMutation.mutate({
      ...formData,
      jobTitle: job.title,
      companyName: job.company,
    });
  };

  if (!job) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Apply for ${job.title}`}
      maxWidth="560px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {error && (
          <div
            role="alert"
            style={{
              backgroundColor: 'var(--color-error-bg)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.625rem 0.875rem',
              fontSize: '0.8125rem',
              color: 'var(--color-error)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Icon name="warning" size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Select Resume & Compensation */}
        {step === 1 && (
          <>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
                Select Resume for Submission
              </label>
              <div
                style={{
                  border: '1px solid var(--border-accent)',
                  backgroundColor: 'rgba(34, 197, 94, 0.05)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon name="resume" size={24} color="var(--color-primary)" />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FFFFFF' }}>
                      Priya_Sharma_Senior_FullStack.pdf
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      Updated recently • 92% ATS Match
                    </div>
                  </div>
                </div>
                <Icon name="check-circle" size={20} color="var(--color-primary)" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Input
                label="Expected Compensation"
                name="expectedSalary"
                value={formData.expectedSalary}
                onChange={handleChange}
                placeholder="e.g. ₹35 LPA"
                required
              />

              <Select
                label="Notice Period"
                name="noticePeriod"
                value={formData.noticePeriod}
                onChange={handleChange}
                options={[
                  { value: 'Immediate to 15 Days', label: 'Immediate to 15 Days' },
                  { value: '30 Days', label: '30 Days' },
                  { value: '60 Days', label: '60 Days' },
                  { value: '90 Days', label: '90 Days' },
                ]}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <Button variant="primary" size="md" onClick={() => setStep(2)}>
                Next: Cover Letter →
              </Button>
            </div>
          </>
        )}

        {/* Step 2: Cover Letter & Review */}
        {step === 2 && (
          <>
            <Textarea
              label="Cover Letter / Quick Note to Recruiter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              rows={5}
              placeholder="Highlight key achievements, relevant repositories, or why you are excited about this opportunity..."
            />

            <div
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                padding: '0.875rem 1rem',
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
              }}
            >
              By submitting, your profile details, portfolio links, and verified resume will be sent directly to the hiring team at <strong>{job.company}</strong>.
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <Button variant="ghost" size="md" onClick={() => setStep(1)}>
                ← Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={applyMutation.isPending}
                leftIcon={<Icon name="send" size={16} />}
              >
                Submit Application
              </Button>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
};
