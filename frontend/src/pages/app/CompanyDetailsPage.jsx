import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, Badge } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Skeleton, CardSkeleton } from '../../components/common/Spinner';
import { PageHeader, EmptyState, ErrorState } from '../../components/common/Feedback';
import { Icon } from '../../components/icons/Icon';
import { CompanyLogo } from '../../components/common/CompanyLogo';
import { companiesApi } from '../../services/companiesApi';

export const CompanyDetailsPage = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const { data: company, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['company', companyId],
    queryFn: () => companiesApi.getCompanyById(companyId),
  });

  const { data: jobsData, isLoading: isJobsLoading } = useQuery({
    queryKey: ['companyJobs', companyId],
    queryFn: () => companiesApi.getCompanyJobs(companyId),
    enabled: Boolean(companyId),
  });

  const jobs = jobsData?.jobs || [];

  if (isLoading) {
    return (
      <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Skeleton width="180px" height="2rem" />
        <Card>
          <Skeleton width="100%" height="240px" />
        </Card>
      </div>
    );
  }

  if (isError || !company) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto' }}>
        <ErrorState
          title="Company Not Found"
          description={error?.message || 'Unable to locate company details.'}
          onRetry={refetch}
        />
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Button variant="secondary" size="md" onClick={() => navigate('/app/companies')}>
            ← Back to Companies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      <div>
        <Link
          to="/app/companies"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}
        >
          <Icon name="arrow-left" size={16} />
          <span>Back to All Companies</span>
        </Link>
      </div>

      {/* Company Header Card */}
      <Card style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <CompanyLogo company={company.name} src={company.logo} size="xl" />
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                {company.name}
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0 0' }}>
                {company.industry || 'Technology'} • {company.location || 'Headquarters'}
              </p>
            </div>
          </div>

          {company.website && (
            <a href={company.website} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="sm" rightIcon={<Icon name="arrow-up-right" size={14} />}>
                Visit Website
              </Button>
            </a>
          )}
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginTop: '1.25rem', margin: '1.25rem 0 0' }}>
          {company.about || company.description || 'Global software innovation enterprise empowering high performance digital architectures.'}
        </p>
      </Card>

      {/* Open Positions Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
            Open Roles at {company.name}
          </h2>
          <Badge variant="lime">{jobs.length} Openings</Badge>
        </div>

        {isJobsLoading ? (
          <CardSkeleton />
        ) : jobs.length === 0 ? (
          <EmptyState
            icon="briefcase"
            title="No current openings"
            description={`${company.name} has no public positions at the moment. Create a job alert to be notified when they open roles.`}
            actionLabel="Create Alert for this Company"
            onAction={() => navigate('/app/job-alerts')}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {jobs.map((job) => (
              <Card
                key={job.id}
                variant="interactive"
                onClick={() => navigate(`/app/jobs/${job.id}`)}
                style={{ padding: '1.25rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                      {job.title}
                    </h3>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                      {job.location} • {job.workMode} {job.salary && `• ${job.salary}`}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" rightIcon={<Icon name="arrow-right" size={14} />}>
                    View Position
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default CompanyDetailsPage;
