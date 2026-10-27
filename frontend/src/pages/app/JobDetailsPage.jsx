import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Icon } from '../../components/icons/Icon';
import { Card, Badge } from '../../components/common/Card';
import { Button, IconButton } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Spinner';
import { ErrorState, EmptyState } from '../../components/common/Feedback';
import { ApplyJobModal } from '../../components/jobs/ApplyJobModal';
import { CompanyLogo } from '../../components/common/CompanyLogo';
import { jobsApi } from '../../services/jobsApi';
import { useToast } from '../../context/ToastContext';

export const JobDetailsPage = () => {
  const { jobId } = useParams();
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: job, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobsApi.getJobById(jobId),
  });

  const saveMutation = useMutation({
    mutationFn: () => (isSaved ? jobsApi.unsaveJob(jobId) : jobsApi.saveJob(jobId)),
    onSuccess: () => {
      setIsSaved(!isSaved);
      toast.success(isSaved ? 'Job removed from bookmarks' : 'Job saved to bookmarks');
      queryClient.invalidateQueries({ queryKey: ['savedJobs'] });
    },
    onError: () => {
      toast.error('Unable to update bookmark');
    },
  });

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Job link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '960px', margin: '0 auto' }}>
        <Skeleton width="180px" height="2rem" />
        <Card>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <Skeleton width="64px" height="64px" borderRadius="var(--radius-lg)" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Skeleton width="50%" height="1.5rem" />
              <Skeleton width="30%" height="1rem" />
            </div>
          </div>
          <Skeleton width="100%" height="150px" />
        </Card>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto' }}>
        <ErrorState
          title="Job Posting Not Found"
          description={error?.message || 'This position may have been closed or removed by the hiring company.'}
          onRetry={refetch}
        />
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Button variant="secondary" size="md" onClick={() => navigate('/app/jobs')}>
            ← Back to All Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '4rem' }}>
      {/* Back Link */}
      <div>
        <Link
          to="/app/jobs"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            fontSize: '0.8125rem',
            color: 'var(--color-text-secondary)',
          }}
        >
          <Icon name="arrow-left" size={16} />
          <span>Back to Jobs</span>
        </Link>
      </div>

      {/* Main Job Header Card */}
      <Card style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
            <CompanyLogo company={job.company} src={job.logo} size="lg" />

            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                {job.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.375rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 600, color: '#FFFFFF' }}>{job.company}</span>
                <span>•</span>
                <span>{job.location}</span>
                <span>•</span>
                <Badge variant="lime">{job.workMode || 'Full-time'}</Badge>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <IconButton
              icon={<Icon name={isSaved ? 'bookmark-filled' : 'bookmark'} size={18} color={isSaved ? 'var(--color-primary)' : 'currentColor'} />}
              ariaLabel={isSaved ? 'Unsave job' : 'Save job'}
              onClick={() => saveMutation.mutate()}
              size="md"
              variant="secondary"
            />
            <IconButton
              icon={<Icon name="share" size={18} />}
              ariaLabel="Share job"
              onClick={handleShare}
              size="md"
              variant="secondary"
            />
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsApplyOpen(true)}
              rightIcon={<Icon name="arrow-right" size={16} />}
            >
              Apply Now
            </Button>
          </div>
        </div>

        {/* Highlights Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
            marginTop: '1.75rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Salary Package</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '0.25rem' }}>
              {job.salary || 'Competitive'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Experience Required</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#FFFFFF', marginTop: '0.25rem' }}>
              {job.experience || '2+ Years'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Job Type</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#FFFFFF', marginTop: '0.25rem' }}>
              {job.jobType || 'Full Time'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Posted On</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#FFFFFF', marginTop: '0.25rem' }}>
              {job.posted || 'Recently'}
            </div>
          </div>
        </div>
      </Card>

      {/* Description & Requirements */}
      <Card style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1rem' }}>
          Role Overview
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
          {job.description || 'We are looking for a skilled engineer to contribute to high-performance web systems and microservices.'}
        </p>

        {job.responsibilities && (
          <div style={{ marginTop: '1.75rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Responsibilities
            </h3>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
              {job.responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {job.requirements && (
          <div style={{ marginTop: '1.75rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Requirements & Qualifications
            </h3>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
              {job.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Technical Skills */}
        {job.skills && (
          <div style={{ marginTop: '1.75rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Required Technologies
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {job.skills.map((s) => (
                <Badge key={s} variant="slate" size="md">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Apply Modal */}
      <ApplyJobModal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        job={job}
      />
    </div>
  );
};
export default JobDetailsPage;
