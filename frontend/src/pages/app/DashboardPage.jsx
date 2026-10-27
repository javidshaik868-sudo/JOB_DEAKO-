import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Icon } from '../../components/icons/Icon';
import { Card, Badge, StatusBadge } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Skeleton, CardSkeleton } from '../../components/common/Spinner';
import { EmptyState, ErrorState } from '../../components/common/Feedback';
import { CompanyLogo } from '../../components/common/CompanyLogo';
import { useAuth } from '../../context/AuthContext';
import { jobsApi } from '../../services/jobsApi';
import { applicationsApi } from '../../services/applicationsApi';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Query jobs from service layer
  const {
    data: jobsData,
    isLoading: isJobsLoading,
    isError: isJobsError,
    refetch: refetchJobs,
  } = useQuery({
    queryKey: ['recommendedJobs'],
    queryFn: () => jobsApi.getJobs({ page: 1 }),
  });

  // Query applications from service layer
  const {
    data: appsData,
    isLoading: isAppsLoading,
    isError: isAppsError,
    refetch: refetchApps,
  } = useQuery({
    queryKey: ['recentApplications'],
    queryFn: () => applicationsApi.getApplications(),
  });

  const jobs = jobsData?.jobs || [];
  const applications = appsData?.applications || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #131B1E 0%, #182422 100%)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.75rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--color-primary)',
              marginBottom: '0.375rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} />
            <span>Candidate Terminal</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            Welcome back, {user?.name?.split(' ')[0] || 'Engineer'}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: '0.375rem 0 0' }}>
            Discover tech opportunities aligned with your background and track interview statuses.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/app/resume-analyzer">
            <Button variant="secondary" size="md" leftIcon={<Icon name="sparkles" size={16} />}>
              Analyze Resume
            </Button>
          </Link>
          <Link to="/app/jobs">
            <Button variant="primary" size="md" leftIcon={<Icon name="search" size={16} />}>
              Find Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {/* Applied */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, margin: 0, textTransform: 'uppercase' }}>
                Applied Jobs
              </p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', margin: '0.25rem 0 0' }}>
                {applications.length}
              </h3>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="file" size={18} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.75rem' }}>
            <Link to="/app/applied-jobs" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
              View all applications →
            </Link>
          </div>
        </Card>

        {/* Interviews */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, margin: 0, textTransform: 'uppercase' }}>
                Interviews
              </p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', margin: '0.25rem 0 0' }}>
                {applications.filter((a) => a.status === 'interview').length}
              </h3>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="calendar" size={18} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.75rem' }}>
            <span>Active scheduling rounds</span>
          </div>
        </Card>

        {/* Saved Jobs */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, margin: 0, textTransform: 'uppercase' }}>
                Saved Jobs
              </p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', margin: '0.25rem 0 0' }}>
                0
              </h3>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(56, 189, 248, 0.1)', color: 'var(--color-info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="bookmark" size={18} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.75rem' }}>
            <Link to="/app/saved-jobs" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
              Review bookmarked roles →
            </Link>
          </div>
        </Card>

        {/* Profile Strength */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, margin: 0, textTransform: 'uppercase' }}>
                Profile Status
              </p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0.25rem 0 0' }}>
                85%
              </h3>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(163, 230, 53, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="user" size={18} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.75rem' }}>
            <Link to="/app/profile/edit" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
              Complete remaining 15% →
            </Link>
          </div>
        </Card>
      </div>

      {/* Main Grid: Recommended Jobs & Recent Applications */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.75rem',
        }}
      >
        {/* Recommended Jobs Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>
              Recommended Opportunities
            </h2>
            <Link to="/app/jobs" style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 600 }}>
              View all
            </Link>
          </div>

          {isJobsLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : isJobsError ? (
            <ErrorState
              title="Unable to load recommended jobs"
              description="Could not connect to the jobs service. Verify your backend or retry."
              onRetry={refetchJobs}
            />
          ) : jobs.length === 0 ? (
            <EmptyState
              icon="search"
              title="No recommended jobs yet"
              description="As companies post new tech roles matching your profile, they will appear here in real time."
              actionLabel="Search All Jobs"
              onAction={() => navigate('/app/jobs')}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {jobs.map((job) => (
                <Card key={job.id} variant="interactive" onClick={() => navigate(`/app/jobs/${job.id}`)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <CompanyLogo company={job.company} size="sm" />
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                          {job.title}
                        </h3>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0 0' }}>
                          {job.company} • {job.location}
                        </p>
                      </div>
                    </div>
                    {job.salary && <Badge variant="lime">{job.salary}</Badge>}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{job.workMode || 'Full-time'}</span>
                    <Button variant="ghost" size="sm" rightIcon={<Icon name="arrow-right" size={14} />}>
                      Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Applications Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>
              Recent Applications
            </h2>
            <Link to="/app/applications" style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 600 }}>
              View all
            </Link>
          </div>

          {isAppsLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : isAppsError ? (
            <ErrorState
              title="Unable to load applications"
              description="Failed to fetch your recent job application history."
              onRetry={refetchApps}
            />
          ) : applications.length === 0 ? (
            <EmptyState
              icon="file"
              title="No active applications"
              description="You haven't submitted any job applications yet. Discover roles and apply with one click."
              actionLabel="Explore Jobs"
              onAction={() => navigate('/app/jobs')}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {applications.map((app) => (
                <Card
                  key={app.id}
                  variant="interactive"
                  onClick={() => navigate(`/app/applications/${app.id}`)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <CompanyLogo company={app.companyName} size="sm" />
                      <div>
                        <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                          {app.jobTitle || 'Role Application'}
                        </h3>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0 0' }}>
                          {app.companyName || 'Company'}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.875rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      Applied: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recent'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 500 }}>
                      Track Progress →
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
