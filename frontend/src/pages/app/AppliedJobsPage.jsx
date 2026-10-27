import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../../components/common/Button';
import { CardSkeleton } from '../../components/common/Spinner';
import { EmptyState, ErrorState, PageHeader } from '../../components/common/Feedback';
import { Icon } from '../../components/icons/Icon';
import { CompanyLogo } from '../../components/common/CompanyLogo';
import { applicationsApi } from '../../services/applicationsApi';

export const AppliedJobsPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['appliedJobs'],
    queryFn: () => applicationsApi.getApplications('all'),
  });

  const applications = [...(data?.applications || [])].sort(
    (first, second) => new Date(second.appliedAt || 0) - new Date(first.appliedAt || 0),
  );

  return (
    <div className="applied-jobs-page">
      <PageHeader
        title="Applied Jobs"
        subtitle="A list of the roles you have applied for."
        actions={(
          <Button variant="primary" size="md" onClick={() => navigate('/app/jobs')} leftIcon={<Icon name="search" size={16} />}>
            Find More Jobs
          </Button>
        )}
      />

      {isLoading ? (
        <div className="applied-job-list">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : isError ? (
        <ErrorState
          title="Failed to load applied jobs"
          description={error?.message || 'Unable to load your applied jobs.'}
          onRetry={refetch}
        />
      ) : applications.length === 0 ? (
        <EmptyState
          icon="file"
          title="No applied jobs yet"
          description="Jobs you apply to will appear here."
          actionLabel="Explore Jobs"
          onAction={() => navigate('/app/jobs')}
        />
      ) : (
        <div className="applied-job-list" aria-label="Applied jobs">
          {applications.map((application) => {
            const jobTitle = application.jobTitle || 'Role Application';
            const companyName = application.companyName || 'Hiring Company';
            const appliedDate = application.appliedAt
              ? new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                .format(new Date(application.appliedAt))
              : 'Recently';

            return (
              <article className="applied-job-row" key={application.id}>
                <div className="applied-job-main">
                  <CompanyLogo company={companyName} size="md" />
                  <div className="applied-job-copy">
                    <h2>{jobTitle}</h2>
                    <p>{companyName}{application.location ? ` · ${application.location}` : ''}</p>
                  </div>
                </div>
                <div className="applied-job-actions">
                  <time>{appliedDate}</time>
                  <Button
                    variant="secondary"
                    size="sm"
                    aria-label={`Track ${jobTitle} at ${companyName}`}
                    onClick={() => navigate(`/app/applications/${application.id}`)}
                    rightIcon={<Icon name="arrow-right" size={14} />}
                  >
                    Track
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default AppliedJobsPage;
