import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Badge } from '../../components/common/Card';
import { Button, IconButton } from '../../components/common/Button';
import { CardSkeleton } from '../../components/common/Spinner';
import { PageHeader, EmptyState, ErrorState } from '../../components/common/Feedback';
import { Icon } from '../../components/icons/Icon';
import { CompanyLogo } from '../../components/common/CompanyLogo';
import { jobsApi } from '../../services/jobsApi';
import { useToast } from '../../context/ToastContext';

export const SavedJobsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['savedJobs'],
    queryFn: () => jobsApi.getSavedJobs(),
  });

  const unsaveMutation = useMutation({
    mutationFn: (jobId) => jobsApi.unsaveJob(jobId),
    onSuccess: () => {
      toast.success('Job removed from your saved list');
      queryClient.invalidateQueries({ queryKey: ['savedJobs'] });
    },
    onError: () => {
      toast.error('Failed to remove saved job');
    },
  });

  const savedJobs = data?.savedJobs || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Saved Jobs"
        subtitle="Review bookmarked opportunities and apply when you are ready"
        badge={<Badge variant="lime">{savedJobs.length} Saved</Badge>}
      />

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : isError ? (
        <ErrorState
          title="Could not load saved jobs"
          description={error?.message || 'Failed to retrieve your bookmarks.'}
          onRetry={refetch}
        />
      ) : savedJobs.length === 0 ? (
        <EmptyState
          icon="bookmark"
          title="No saved jobs yet"
          description="Click the bookmark icon on any job card in Find Jobs to save opportunities for later review."
          actionLabel="Browse Available Jobs"
          onAction={() => navigate('/app/jobs')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {savedJobs.map((job) => (
            <Card
              key={job.id}
              variant="interactive"
              onClick={() => navigate(`/app/jobs/${job.id}`)}
              style={{ padding: '1.5rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <CompanyLogo company={job.company} size="md" />
                  <div>
                    <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                      {job.title}
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0 0' }}>
                      {job.company} • {job.location} • <span style={{ color: 'var(--color-primary)' }}>{job.workMode}</span>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <IconButton
                    icon={<Icon name="delete" size={18} />}
                    ariaLabel="Remove bookmark"
                    onClick={(e) => {
                      e.stopPropagation();
                      unsaveMutation.mutate(job.id);
                    }}
                    size="sm"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/app/jobs/${job.id}`);
                    }}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
export default SavedJobsPage;
