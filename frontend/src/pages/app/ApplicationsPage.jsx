import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { StatusBadge } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { CardSkeleton } from '../../components/common/Spinner';
import { PageHeader, Tabs, EmptyState, ErrorState } from '../../components/common/Feedback';
import { Icon } from '../../components/icons/Icon';
import { CompanyLogo } from '../../components/common/CompanyLogo';
import { applicationsApi } from '../../services/applicationsApi';

const trackerStages = ['Submitted', 'In review', 'Interview', 'Decision'];
const statusUpdateLabels = {
  applied: 'Application submitted',
  reviewed: 'Under review',
  under_review: 'Under review',
  shortlisted: 'Shortlisted for next round',
  assessment: 'Technical assessment',
  technical_assessment: 'Technical assessment',
  interview: 'Interview stage',
  interview_scheduled: 'Interview scheduled',
  hr: 'HR interview stage',
  offer: 'Offer received',
  rejected: 'Application not selected',
  withdrawn: 'Application withdrawn',
  closed: 'Application closed',
};

const normalizeStatus = (status = '') => status.toLowerCase().replace(/[\s-]+/g, '_');

const getStageIndex = (status) => {
  const normalizedStatus = normalizeStatus(status);
  if (['offer', 'rejected', 'withdrawn', 'closed'].includes(normalizedStatus)) return 3;
  if (['interview', 'interview_scheduled', 'hr', 'assessment', 'technical_assessment'].includes(normalizedStatus)) return 2;
  if (['reviewed', 'shortlisted', 'under_review'].includes(normalizedStatus)) return 1;
  return 0;
};

const matchesTab = (application, tab) => {
  const status = normalizeStatus(application.status);
  if (tab === 'all') return true;
  if (tab === 'review') return ['reviewed', 'shortlisted', 'under_review', 'assessment', 'technical_assessment'].includes(status);
  if (tab === 'interview') return ['interview', 'interview_scheduled', 'hr'].includes(status);
  if (tab === 'offer') return status === 'offer';
  if (tab === 'closed') return ['rejected', 'withdrawn', 'closed'].includes(status);
  return true;
};

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

const getStatusForBadge = (status) => (
  normalizeStatus(status) === 'interview_scheduled' ? 'interview' : status || 'applied'
);

export const ApplicationsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['applications'],
    queryFn: () => applicationsApi.getApplications('all'),
  });

  const allApplications = data?.applications || [];
  const reviewCount = allApplications.filter((application) => matchesTab(application, 'review')).length;
  const interviewCount = allApplications.filter((application) => matchesTab(application, 'interview')).length;
  const offerCount = allApplications.filter((application) => matchesTab(application, 'offer')).length;
  const query = search.trim().toLowerCase();
  const applications = allApplications
    .filter((application) => matchesTab(application, activeTab))
    .filter((application) => !query || [application.jobTitle, application.companyName, application.location]
      .some((value) => value?.toLowerCase().includes(query)))
    .sort((first, second) => new Date(second.statusUpdatedAt || second.updatedAt || second.appliedAt || 0)
      - new Date(first.statusUpdatedAt || first.updatedAt || first.appliedAt || 0));

  const tabs = [
    { id: 'all', label: 'All applications' },
    { id: 'review', label: 'Under review' },
    { id: 'interview', label: 'Interviews' },
    { id: 'offer', label: 'Offers' },
    { id: 'closed', label: 'Closed' },
  ];

  return (
    <div className="application-tracker">
      <PageHeader
        title="Application Tracker"
        subtitle="Follow every application from submission through the hiring decision."
        actions={(
          <Button variant="primary" size="md" onClick={() => navigate('/app/jobs')} leftIcon={<Icon name="search" size={16} />}>
            Find More Jobs
          </Button>
        )}
      />

      <div className="application-tracker-metrics" aria-label="Application summary">
        <div className="application-tracker-metric">
          <span>Total applications</span>
          <strong>{allApplications.length}</strong>
        </div>
        <div className="application-tracker-metric">
          <span>Under review</span>
          <strong>{reviewCount}</strong>
        </div>
        <div className="application-tracker-metric">
          <span>Interviews</span>
          <strong>{interviewCount}</strong>
        </div>
        <div className="application-tracker-metric">
          <span>Offers</span>
          <strong>{offerCount}</strong>
        </div>
      </div>

      <div className="application-tracker-controls">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <label className="application-tracker-search">
          <Icon name="search" size={17} color="var(--color-text-muted)" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by role or company"
            aria-label="Search applications by role or company"
          />
        </label>
      </div>

      {isLoading ? (
        <div className="application-tracker-list">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : isError ? (
        <ErrorState
          title="Failed to retrieve applications"
          description={error?.message || 'Unable to load application updates.'}
          onRetry={refetch}
        />
      ) : applications.length === 0 ? (
        <EmptyState
          icon="file"
          title={query ? 'No matching applications' : activeTab === 'all' ? 'No applications yet' : 'No applications in this stage'}
          description={query
            ? 'Try another role or company name.'
            : 'Applications you submit will appear here with their latest hiring-stage updates.'}
          actionLabel={query ? undefined : 'Explore Jobs'}
          onAction={query ? undefined : () => navigate('/app/jobs')}
        />
      ) : (
        <div className="application-tracker-list" aria-label="Applications and status updates">
          {applications.map((application) => {
            const status = normalizeStatus(application.status);
            const stageIndex = getStageIndex(status);
            const updateDate = formatDate(application.statusUpdatedAt || application.updatedAt);
            const appliedDate = formatDate(application.appliedAt);
            const lastUpdateText = application.latestUpdate || application.statusMessage || (
              statusUpdateLabels[status] || 'Application status updated'
            );

            return (
              <article
                key={application.id}
                className="application-tracker-row"
                onClick={() => navigate(`/app/applications/${application.id}`)}
              >
                <div className="application-tracker-row-header">
                  <div className="application-tracker-role">
                    <CompanyLogo company={application.companyName} size="md" />
                    <div className="application-tracker-role-copy">
                      <h2>{application.jobTitle || 'Role Application'}</h2>
                      <p>
                        {application.companyName || 'Hiring Company'}
                        {application.location ? ` · ${application.location}` : ''}
                        {appliedDate ? ` · Applied ${appliedDate}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="application-tracker-row-actions">
                    <StatusBadge status={getStatusForBadge(status)} />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/app/applications/${application.id}`);
                      }}
                      rightIcon={<Icon name="arrow-right" size={14} />}
                    >
                      Details
                    </Button>
                  </div>
                </div>

                <div
                  className="application-tracker-progress"
                  role="progressbar"
                  aria-label={`${application.jobTitle || 'Application'} hiring progress`}
                  aria-valuemin="0"
                  aria-valuemax="3"
                  aria-valuenow={stageIndex}
                >
                  <div className="application-tracker-progress-line">
                    <span style={{ width: `${(stageIndex / (trackerStages.length - 1)) * 100}%` }} />
                  </div>
                  {trackerStages.map((stage, index) => (
                    <div
                      key={stage}
                      className={`application-tracker-stage${index < stageIndex ? ' is-complete' : ''}${index === stageIndex ? ' is-current' : ''}`}
                    >
                      <span className="application-tracker-stage-dot">
                        {index < stageIndex ? <Icon name="check" size={12} strokeWidth={3} /> : null}
                      </span>
                      <span>{stage}</span>
                    </div>
                  ))}
                </div>

                <div className="application-tracker-update">
                  <span className="application-tracker-update-icon"><Icon name="clock" size={15} /></span>
                  <span>{lastUpdateText}</span>
                  <time>
                    {updateDate ? `Updated ${updateDate}` : appliedDate ? `Applied ${appliedDate}` : 'Awaiting update'}
                  </time>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;