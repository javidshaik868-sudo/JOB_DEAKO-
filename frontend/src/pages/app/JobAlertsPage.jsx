import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Badge, StatusBadge } from '../../components/common/Card';
import { Button, IconButton } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input, Select } from '../../components/common/Input';
import { CardSkeleton } from '../../components/common/Spinner';
import { PageHeader, EmptyState, ErrorState } from '../../components/common/Feedback';
import { Icon } from '../../components/icons/Icon';
import { jobAlertsApi } from '../../services/jobAlertsApi';
import { useToast } from '../../context/ToastContext';

export const JobAlertsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAlert, setNewAlert] = useState({
    role: '',
    location: '',
    experience: '1-3 yrs',
    salary: '₹20-30 LPA',
    frequency: 'Daily',
  });

  const toast = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['jobAlerts'],
    queryFn: () => jobAlertsApi.getAlerts(),
  });

  const alerts = data?.alerts || [];

  const createMutation = useMutation({
    mutationFn: (alertData) => jobAlertsApi.createAlert(alertData),
    onSuccess: () => {
      toast.success('Job Alert configured successfully!');
      queryClient.invalidateQueries({ queryKey: ['jobAlerts'] });
      setIsModalOpen(false);
      setNewAlert({ role: '', location: '', experience: '1-3 yrs', salary: '₹20-30 LPA', frequency: 'Daily' });
    },
    onError: () => toast.error('Failed to create job alert'),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, currentStatus }) =>
      jobAlertsApi.toggleAlertStatus(id, currentStatus === 'active' ? 'paused' : 'active'),
    onSuccess: (_, vars) => {
      toast.success(vars.currentStatus === 'active' ? 'Alert paused' : 'Alert resumed');
      queryClient.invalidateQueries({ queryKey: ['jobAlerts'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => jobAlertsApi.deleteAlert(id),
    onSuccess: () => {
      toast.success('Job Alert removed');
      queryClient.invalidateQueries({ queryKey: ['jobAlerts'] });
    },
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newAlert.role.trim()) {
      toast.error('Please specify a role title');
      return;
    }
    createMutation.mutate(newAlert);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Job Alerts"
        subtitle="Receive instant notifications whenever matching roles are published"
        badge={<Badge variant="lime">{alerts.length} Active Alerts</Badge>}
        actions={
          <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)} leftIcon={<Icon name="plus" size={16} />}>
            Create New Alert
          </Button>
        }
      />

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : isError ? (
        <ErrorState
          title="Could not load job alerts"
          description={error?.message || 'Failed to retrieve your configured job alerts.'}
          onRetry={refetch}
        />
      ) : alerts.length === 0 ? (
        <EmptyState
          icon="bell"
          title="No job alerts setup"
          description="Create customized alerts for your preferred tech roles, compensation range, and locations."
          actionLabel="Create Your First Alert"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {alerts.map((alert) => (
            <Card key={alert.id} style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: alert.status === 'active' ? 'rgba(34, 197, 94, 0.1)' : 'var(--bg-secondary)',
                      color: alert.status === 'active' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name="bell" size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                      {alert.role}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                      <span>{alert.location || 'Any Location'}</span>
                      <span>•</span>
                      <span>Exp: {alert.experience}</span>
                      <span>•</span>
                      <span>Min: {alert.salary}</span>
                      <span>•</span>
                      <Badge variant="slate" size="sm">{alert.frequency}</Badge>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <StatusBadge status={alert.status} />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleMutation.mutate({ id: alert.id, currentStatus: alert.status })}
                  >
                    {alert.status === 'active' ? 'Pause' : 'Resume'}
                  </Button>
                  <IconButton
                    icon={<Icon name="delete" size={16} />}
                    ariaLabel="Delete alert"
                    onClick={() => deleteMutation.mutate(alert.id)}
                    size="sm"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Alert Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Job Alert"
      >
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Role Title / Target Keyword"
            placeholder="e.g. Senior Frontend Engineer"
            value={newAlert.role}
            onChange={(e) => setNewAlert({ ...newAlert, role: e.target.value })}
            required
          />

          <Input
            label="Location (City or Remote)"
            placeholder="e.g. Hyderabad / Remote"
            value={newAlert.location}
            onChange={(e) => setNewAlert({ ...newAlert, location: e.target.value })}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Select
              label="Experience"
              value={newAlert.experience}
              onChange={(e) => setNewAlert({ ...newAlert, experience: e.target.value })}
              options={[
                { value: '0-1 yrs', label: '0-1 yrs' },
                { value: '1-3 yrs', label: '1-3 yrs' },
                { value: '3-5 yrs', label: '3-5 yrs' },
                { value: '5+ yrs', label: '5+ yrs' },
              ]}
            />
            <Select
              label="Frequency"
              value={newAlert.frequency}
              onChange={(e) => setNewAlert({ ...newAlert, frequency: e.target.value })}
              options={[
                { value: 'Instant', label: 'Instant' },
                { value: 'Daily', label: 'Daily Digest' },
                { value: 'Weekly', label: 'Weekly Summary' },
              ]}
            />
          </div>

          <Input
            label="Minimum Compensation Target"
            placeholder="e.g. ₹25 LPA"
            value={newAlert.salary}
            onChange={(e) => setNewAlert({ ...newAlert, salary: e.target.value })}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="ghost" size="md" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={createMutation.isPending}>
              Create Alert
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default JobAlertsPage;
