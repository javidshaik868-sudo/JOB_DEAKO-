import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Badge } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { CardSkeleton } from '../../components/common/Spinner';
import { PageHeader, Tabs, EmptyState, ErrorState } from '../../components/common/Feedback';
import { Icon } from '../../components/icons/Icon';
import { notificationsApi } from '../../services/notificationsApi';
import { useToast } from '../../context/ToastContext';

export const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['notifications', activeTab],
    queryFn: () => notificationsApi.getNotifications(activeTab),
  });

  const markAllMutation = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      toast.success('All notifications marked as read');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const notifications = data?.notifications || [];

  const tabs = [
    { id: 'all', label: 'All Alerts' },
    { id: 'applications', label: 'Applications' },
    { id: 'jobs', label: 'Job Matches' },
    { id: 'messages', label: 'Messages' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '840px', margin: '0 auto' }}>
      <PageHeader
        title="Notifications"
        subtitle="Stay notified about recruiter messages, interview milestones, and application status updates"
        actions={
          notifications.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => markAllMutation.mutate()}
              isLoading={markAllMutation.isPending}
            >
              Mark All Read
            </Button>
          )
        }
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : isError ? (
        <ErrorState
          title="Could not load notifications"
          description={error?.message || 'Unable to retrieve notifications.'}
          onRetry={refetch}
        />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon="bell"
          title="No notifications"
          description="You are completely caught up! New application milestones, recruiter replies, and job recommendations will appear here."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map((n) => (
            <Card
              key={n.id}
              style={{
                padding: '1.25rem',
                borderLeft: n.read ? '1px solid var(--border-primary)' : '3px solid var(--color-primary)',
                backgroundColor: n.read ? 'var(--bg-card)' : 'var(--bg-card-elevated)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name={n.type === 'message' ? 'message' : n.type === 'job' ? 'briefcase' : 'file'} size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                      {n.title}
                    </h4>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: '0.25rem 0 0' }}>
                      {n.message}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{n.time || 'Today'}</span>
                  {!n.read && (
                    <button
                      type="button"
                      onClick={() => markReadMutation.mutate(n.id)}
                      style={{
                        color: 'var(--color-primary)',
                        fontSize: '0.75rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                      aria-label="Mark read"
                    >
                      <Icon name="check" size={14} />
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
export default NotificationsPage;
