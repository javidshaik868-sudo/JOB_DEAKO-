import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, Badge } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { CardSkeleton } from '../../components/common/Spinner';
import { PageHeader, EmptyState, ErrorState } from '../../components/common/Feedback';
import { Icon } from '../../components/icons/Icon';
import { CompanyLogo } from '../../components/common/CompanyLogo';
import { DropdownSelect } from '../../components/common/DropdownSelect';
import { companiesApi } from '../../services/companiesApi';

const industryOptions = [
  { value: '', label: 'All Industries' },
  { value: 'Cloud Computing', label: 'Cloud Computing' },
  { value: 'Artificial Intelligence', label: 'AI & Machine Learning' },
  { value: 'Fintech', label: 'Fintech & Payments' },
  { value: 'E-Commerce', label: 'E-Commerce' },
];

export const CompaniesPage = () => {
  const [query, setQuery] = useState('');
  const [industry, setIndustry] = useState('');
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['companies', { query, industry }],
    queryFn: () => companiesApi.getCompanies({ q: query, industry }),
  });

  const companies = data?.companies || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Top Tech Companies"
        subtitle="Explore leading engineering teams, startups, and tech enterprises actively hiring"
      />

      {/* Filter and Search Bar */}
      <Card padding="md">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ flex: '2 1 240px', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '0.875rem', color: 'var(--color-text-muted)' }}>
              <Icon name="search" size={18} />
            </span>
            <input
              type="text"
              placeholder="Search companies by name or technology..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '2.5rem' }}
            />
          </div>

          <DropdownSelect
            ariaLabel="Filter by industry"
            value={industry}
            options={industryOptions}
            onChange={setIndustry}
            style={{ flex: '1 1 180px' }}
            triggerStyle={{ width: '100%', minHeight: '43px', fontSize: '0.875rem', padding: '0.625rem 0.875rem' }}
          />
        </div>
      </Card>

      {/* Company Grid */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : isError ? (
        <ErrorState
          title="Could not load companies"
          description={error?.message || 'Unable to retrieve company directory.'}
          onRetry={refetch}
        />
      ) : companies.length === 0 ? (
        <EmptyState
          icon="building"
          title="No companies found"
          description="We couldn't find any companies matching your active query or industry filter."
          actionLabel="Clear Filters"
          onAction={() => {
            setQuery('');
            setIndustry('');
          }}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {companies.map((c) => (
            <Card
              key={c.id}
              variant="interactive"
              onClick={() => navigate(`/app/companies/${c.id}`)}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <CompanyLogo company={c.name} src={c.logo} size="md" />
                    <div>
                      <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                        {c.name}
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: '0.125rem 0 0' }}>
                        {c.industry || 'Technology'} • {c.location || 'India'}
                      </p>
                    </div>
                  </div>
                  {c.rating && (
                    <Badge variant="lime" size="sm">
                      ★ {c.rating}
                    </Badge>
                  )}
                </div>

                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '0.875rem', lineHeight: 1.6, margin: '0.875rem 0 0' }}>
                  {c.tagline || c.description || 'Pioneering modern software engineering and enterprise scale solutions.'}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '1.25rem',
                  paddingTop: '0.875rem',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                  {c.openRoles || 0} Open Roles
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  View Profile →
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
export default CompaniesPage;
