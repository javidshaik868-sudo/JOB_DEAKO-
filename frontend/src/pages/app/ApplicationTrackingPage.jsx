import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, Badge, StatusBadge } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Spinner';
import { PageHeader, ErrorState } from '../../components/common/Feedback';
import { Icon } from '../../components/icons/Icon';
import { CompanyLogo } from '../../components/common/CompanyLogo';
import { applicationsApi } from '../../services/applicationsApi';

export const ApplicationTrackingPage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const { data: application, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => applicationsApi.getApplicationById(applicationId),
  });

  const stages = [
    { key: 'applied', label: 'Applied', desc: 'Application & resume dispatched' },
    { key: 'reviewed', label: 'Under Review', desc: 'Recruiter reviewed credentials' },
    { key: 'shortlisted', label: 'Shortlisted', desc: 'Selected for hiring rounds' },
    { key: 'assessment', label: 'Technical Assessment', desc: 'Coding or system take-home' },
    { key: 'interview', label: 'Technical Interview', desc: 'Live architectural round' },
    { key: 'hr', label: 'HR & Culture', desc: 'Final alignment discussion' },
    { key: 'offer', label: 'Official Offer', desc: 'Compensation & joining package' },
  ];

  const currentStatus = application?.status || 'applied';
  const currentStageIndex = stages.findIndex((s) => s.key === currentStatus);
  const activeIndex = currentStageIndex >= 0 ? currentStageIndex : 0;

  if (isLoading) {
    return (
      <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Skeleton width="200px" height="2rem" />
        <Card>
          <Skeleton width="100%" height="240px" />
        </Card>
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto' }}>
        <ErrorState
          title="Application Record Not Found"
          description={error?.message || 'Could not locate the requested application record.'}
          onRetry={refetch}
        />
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Button variant="secondary" size="md" onClick={() => navigate('/app/applications')}>
            ← Back to Applications
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      <PageHeader
        title="Application Status Tracker"
        subtitle={`Tracking ID: #${applicationId} • ${application.jobTitle || 'Role'}`}
        badge={<StatusBadge status={application.status} />}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to={`/app/applications/${applicationId}/schedule`}>
              <Button variant="primary" size="md" leftIcon={<Icon name="calendar" size={16} />}>
                Interview Schedule
              </Button>
            </Link>
            <Link to="/app/messages">
              <Button variant="secondary" size="md" leftIcon={<Icon name="message" size={16} />}>
                Message Team
              </Button>
            </Link>
          </div>
        }
      />

      {/* Role Summary Card */}
      <Card style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <CompanyLogo company={application.companyName} size="lg" />
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                {application.jobTitle || 'Engineering Role'}
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0 0' }}>
                {application.companyName || 'Hiring Enterprise'} • Applied on{' '}
                {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'Recent'}
              </p>
            </div>
          </div>
          <Badge variant="lime" size="lg">
            Expected: {application.expectedSalary || 'Negotiable'}
          </Badge>
        </div>
      </Card>

      {/* Timeline Stepper Card */}
      <Card style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.75rem' }}>
          Recruitment Journey
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {stages.map((stage, idx) => {
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            const isUpcoming = idx > activeIndex;

            return (
              <div
                key={stage.key}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.25rem',
                  position: 'relative',
                  paddingBottom: idx === stages.length - 1 ? 0 : '2rem',
                }}
              >
                {/* Connecting Line */}
                {idx !== stages.length - 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '28px',
                      left: '15px',
                      width: 2,
                      bottom: 0,
                      backgroundColor: isCompleted ? 'var(--color-primary)' : 'var(--border-subtle)',
                      transition: 'background-color 200ms ease',
                    }}
                  />
                )}

                {/* Node Circle */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: isCompleted || isCurrent ? 'var(--color-primary)' : 'var(--bg-card-elevated)',
                    border: isCompleted || isCurrent ? '2px solid var(--color-primary)' : '2px solid var(--border-primary)',
                    color: isCompleted || isCurrent ? 'var(--color-text-dark)' : 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    zIndex: 2,
                    boxShadow: isCurrent ? 'var(--shadow-glow-lime)' : 'none',
                  }}
                >
                  {isCompleted ? (
                    <Icon name="check" size={16} strokeWidth={3} />
                  ) : (
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{idx + 1}</span>
                  )}
                </div>

                {/* Stage Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <h4
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: isCurrent ? 700 : 600,
                        color: isUpcoming ? 'var(--color-text-muted)' : '#FFFFFF',
                        margin: 0,
                      }}
                    >
                      {stage.label}
                    </h4>
                    {isCurrent && <Badge variant="lime" size="sm">Current Phase</Badge>}
                  </div>
                  <p
                    style={{
                      fontSize: '0.8125rem',
                      color: isUpcoming ? 'var(--color-text-muted)' : 'var(--color-text-secondary)',
                      margin: '0.25rem 0 0',
                    }}
                  >
                    {stage.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
export default ApplicationTrackingPage;
