import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Badge } from '../../components/common/Card';
import { CardSkeleton } from '../../components/common/Spinner';
import { PageHeader, Tabs, EmptyState, ErrorState } from '../../components/common/Feedback';
import { Icon } from '../../components/icons/Icon';
import { unsplashResources } from '../../data/unsplashAssets';
import { careerResourcesApi } from '../../services/careerResourcesApi';

export const CareerResourcesPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['careerResources', activeCategory],
    queryFn: () => careerResourcesApi.getResources(activeCategory),
  });

  const resources = data?.resources || [];

  const categories = [
    { id: 'all', label: 'All Guides' },
    { id: 'interview', label: 'Interview Prep' },
    { id: 'resume', label: 'Resume Mastery' },
    { id: 'dsa', label: 'DSA & Algorithms' },
    { id: 'system-design', label: 'System Design' },
    { id: 'ai', label: 'AI & ML Careers' },
  ];

  const getGuideImage = (category) => {
    const key = category?.toLowerCase();
    if (key?.includes('resume')) return unsplashResources.resume;
    if (key?.includes('system')) return unsplashResources.systemDesign;
    if (key?.includes('dsa') || key?.includes('algorithm')) return unsplashResources.dsa;
    if (key?.includes('ai') || key?.includes('ml')) return unsplashResources.ai;
    return unsplashResources.interview;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Career Growth & Tech Resources"
        subtitle="Curated roadmaps, technical interview handbooks, and system design architecture guides"
      />

      <Tabs tabs={categories} activeTab={activeCategory} onChange={setActiveCategory} />

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : isError ? (
        <ErrorState
          title="Could not load career resources"
          description={error?.message || 'Unable to retrieve resource documents.'}
          onRetry={refetch}
        />
      ) : resources.length === 0 ? (
        <EmptyState
          icon="globe"
          title="No resources found"
          description="Resource documents for this category are being updated. Check back shortly or browse other domains."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {resources.map((res) => {
            const coverImg = getGuideImage(res.category);
            return (
              <Card
                key={res.id}
                variant="interactive"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {/* Cover Image from Unsplash */}
                <div style={{ position: 'relative', width: '100%', height: '140px', backgroundColor: 'var(--bg-secondary)', overflow: 'hidden' }}>
                  <img
                    src={coverImg}
                    alt={res.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.85,
                      transition: 'transform var(--transition-fast)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '50px',
                      background: 'linear-gradient(to top, var(--bg-card) 0%, transparent 100%)',
                    }}
                  />
                  <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                    <Badge variant="lime" size="sm">
                      {res.category}
                    </Badge>
                  </div>
                </div>

                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{res.readTime || '5 min read'}</span>
                    </div>

                    <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                      {res.title}
                    </h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                      {res.description}
                    </p>
                  </div>

                  <div style={{ marginTop: '1.25rem', paddingTop: '0.875rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{res.author || 'JobDheko Editorial'}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span>Read Article</span>
                      <Icon name="arrow-right" size={14} />
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default CareerResourcesPage;
