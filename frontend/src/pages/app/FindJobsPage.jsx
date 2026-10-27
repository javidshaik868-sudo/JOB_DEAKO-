import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Icon } from '../../components/icons/Icon';
import { Card, Badge } from '../../components/common/Card';
import { Button, IconButton } from '../../components/common/Button';
import { CardSkeleton } from '../../components/common/Spinner';
import { EmptyState, ErrorState, PageHeader, Pagination } from '../../components/common/Feedback';
import { CompanyLogo } from '../../components/common/CompanyLogo';
import { DropdownSelect } from '../../components/common/DropdownSelect';
import { jobsApi } from '../../services/jobsApi';
import { useToast } from '../../context/ToastContext';

const workModeOptions = [
  { value: '', label: 'All Work Modes' },
  { value: 'Remote', label: 'Remote' },
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'On-site', label: 'On-site' },
];

const experienceOptions = [
  { value: '', label: 'All Experience' },
  { value: '0-1', label: 'Entry (0-1 yrs)' },
  { value: '1-3', label: 'Junior (1-3 yrs)' },
  { value: '3-5', label: 'Mid-Level (3-5 yrs)' },
  { value: '5+', label: 'Senior (5+ yrs)' },
];

const sortOptions = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'relevance', label: 'Relevance' },
  { value: 'salary', label: 'Highest Compensation' },
];

export const FindJobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const q = searchParams.get('q') || '';
  const location = searchParams.get('location') || '';
  const workMode = searchParams.get('workMode') || '';
  const experience = searchParams.get('experience') || '';
  const sort = searchParams.get('sort') || 'recent';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [keywordInput, setKeywordInput] = useState(q);
  const [locationInput, setLocationInput] = useState(location);
  const [savedMap, setSavedMap] = useState({});

  useEffect(() => {
    setKeywordInput(q);
  }, [q]);

  useEffect(() => {
    setLocationInput(location);
  }, [location]);

  // Query jobs
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['jobs', { q, location, workMode, experience, sort, page }],
    queryFn: () => jobsApi.getJobs({ q, location, workMode, experience, sort, page }),
  });

  // Bookmark mutation
  const saveMutation = useMutation({
    mutationFn: (jobId) => {
      if (savedMap[jobId]) {
        return jobsApi.unsaveJob(jobId);
      }
      return jobsApi.saveJob(jobId);
    },
    onSuccess: (res, jobId) => {
      const isSaved = !savedMap[jobId];
      setSavedMap((prev) => ({ ...prev, [jobId]: isSaved }));
      toast.success(isSaved ? 'Job saved to your bookmarks' : 'Job removed from bookmarks');
      queryClient.invalidateQueries({ queryKey: ['savedJobs'] });
    },
    onError: () => {
      toast.error('Unable to update bookmark. Please try again.');
    },
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (keywordInput.trim()) next.set('q', keywordInput.trim());
    else next.delete('q');

    if (locationInput.trim()) next.set('location', locationInput.trim());
    else next.delete('location');

    next.set('page', '1');
    setSearchParams(next);
  };

  const handleFilterChange = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(key, val);
    else next.delete(key);
    next.set('page', '1');
    setSearchParams(next);
  };

  const jobs = data?.jobs || [];
  const totalPages = data?.totalPages || (jobs.length > 0 ? 1 : 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Find Opportunities"
        subtitle="Search and filter through verified tech and software engineering openings"
      />

      {/* Search Bar & Filters Form */}
      <Card padding="md">
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ flex: '2 1 240px', position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: '0.875rem', color: 'var(--color-text-muted)' }}>
                <Icon name="search" size={18} />
              </span>
              <input
                type="text"
                placeholder="Job title, technical skill, or company name..."
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                style={{ width: '100%', paddingLeft: '2.5rem' }}
              />
            </div>

            <div style={{ flex: '1 1 180px', position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: '0.875rem', color: 'var(--color-text-muted)' }}>
                <Icon name="location" size={18} />
              </span>
              <input
                type="text"
                placeholder="City or remote..."
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                style={{ width: '100%', paddingLeft: '2.5rem' }}
              />
            </div>

            <Button type="submit" variant="primary" size="md" leftIcon={<Icon name="search" size={16} />}>
              Search
            </Button>
          </div>

          {/* Filter Chips & Sort Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                Filter:
              </span>

              {/* Work Mode */}
              <DropdownSelect
                ariaLabel="Filter by work mode"
                value={workMode}
                options={workModeOptions}
                onChange={(value) => handleFilterChange('workMode', value)}
                style={{ minWidth: '8.5rem' }}
              />

              {/* Experience */}
              <DropdownSelect
                ariaLabel="Filter by experience"
                value={experience}
                options={experienceOptions}
                onChange={(value) => handleFilterChange('experience', value)}
                style={{ minWidth: '9.75rem' }}
              />

              {(q || location || workMode || experience || sort !== 'recent') && (
                <button
                  type="button"
                  onClick={() => setSearchParams({})}
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-error)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Sort */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Sort by:</span>
              <DropdownSelect
                ariaLabel="Sort jobs by"
                value={sort}
                options={sortOptions}
                onChange={(value) => handleFilterChange('sort', value)}
                align="end"
                style={{ minWidth: '11.5rem' }}
              />
            </div>
          </div>
        </form>
      </Card>

      {/* Jobs Listing Feed */}
      <div>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : isError ? (
          <ErrorState
            title="Search request failed"
            description={error?.message || 'Unable to load jobs from the API service.'}
            onRetry={refetch}
          />
        ) : jobs.length === 0 ? (
          <EmptyState
            icon="search"
            title="No matching jobs found"
            description="We couldn't find any opportunities matching your active query and filters. Try clearing some criteria or search for broader keywords."
            actionLabel="Reset Search & Filters"
            onAction={() => {
              setKeywordInput('');
              setLocationInput('');
              setSearchParams({});
            }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {jobs.map((job) => {
              const isSaved = Boolean(savedMap[job.id]);
              return (
                <Card
                  key={job.id}
                  variant="interactive"
                  onClick={() => navigate(`/app/jobs/${job.id}`)}
                  style={{ padding: '1.5rem' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <CompanyLogo company={job.company} src={job.logo} size="md" />
                      <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                          {job.title}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                          <span>{job.company}</span>
                          <span>•</span>
                          <span>{job.location}</span>
                          <span>•</span>
                          <span style={{ color: 'var(--color-primary)' }}>{job.workMode}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <IconButton
                        icon={<Icon name={isSaved ? 'bookmark-filled' : 'bookmark'} size={18} color={isSaved ? 'var(--color-primary)' : 'currentColor'} />}
                        ariaLabel={isSaved ? 'Unsave job' : 'Save job'}
                        onClick={(e) => {
                          e.stopPropagation();
                          saveMutation.mutate(job.id);
                        }}
                        size="sm"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                      {job.skills?.slice(0, 4).map((s) => (
                        <Badge key={s} variant="slate" size="sm">
                          {s}
                        </Badge>
                      ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {job.salary && <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)' }}>{job.salary}</span>}
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/app/jobs/${job.id}`);
                        }}
                        rightIcon={<Icon name="arrow-right" size={14} />}
                      >
                        View Job
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => {
                const next = new URLSearchParams(searchParams);
                next.set('page', p.toString());
                setSearchParams(next);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default FindJobsPage;
