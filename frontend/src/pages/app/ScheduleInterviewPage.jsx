import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Spinner';
import { PageHeader, EmptyState, ErrorState } from '../../components/common/Feedback';
import { Icon } from '../../components/icons/Icon';
import { applicationsApi } from '../../services/applicationsApi';
import { useToast } from '../../context/ToastContext';

export const ScheduleInterviewPage = () => {
  const { applicationId } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: slotsData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['interviewSlots', applicationId],
    queryFn: () => applicationsApi.getAvailableInterviewSlots(applicationId),
  });

  const scheduleMutation = useMutation({
    mutationFn: () =>
      applicationsApi.scheduleInterview(applicationId, {
        date: selectedDate,
        slot: selectedSlot,
      }),
    onSuccess: () => {
      toast.success('Interview scheduled! Calendar invite sent.');
      queryClient.invalidateQueries({ queryKey: ['application', applicationId] });
      navigate(`/app/applications/${applicationId}`);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to confirm interview slot');
    },
  });

  const dates = slotsData?.dates || [];

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      <PageHeader
        title="Schedule Your Interview"
        subtitle={`Select a convenient time slot for your upcoming technical discussion (Application #${applicationId})`}
      />

      {isLoading ? (
        <Card>
          <Skeleton width="100%" height="280px" />
        </Card>
      ) : isError ? (
        <ErrorState
          title="Interview Scheduling Unavailable"
          description={error?.message || 'No interview rounds are currently waiting for your scheduling input.'}
          onRetry={refetch}
        />
      ) : dates.length === 0 ? (
        <EmptyState
          icon="calendar"
          title="No Available Slots"
          description="The hiring manager has not published open calendar slots yet. You will receive an email notification when slots are added."
          actionLabel="Back to Tracking"
          onAction={() => navigate(`/app/applications/${applicationId}`)}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Interview Details Card */}
          <Card style={{ padding: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Interview Type</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#FFFFFF', marginTop: '0.25rem' }}>
                  {slotsData?.interviewType || 'Technical Discussion'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Estimated Duration</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#FFFFFF', marginTop: '0.25rem' }}>
                  {slotsData?.duration || '45 Mins'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Interviewer</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#FFFFFF', marginTop: '0.25rem' }}>
                  {slotsData?.interviewer || 'Engineering Team'}
                </div>
              </div>
            </div>
          </Card>

          {/* Slot Selection */}
          <Card style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Select Date & Time Slot
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {dates.map((day) => (
                <div key={day.date}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
                    {day.date}
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {day.slots.map((slot) => {
                      const isSelected = selectedDate === day.date && selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            setSelectedDate(day.date);
                            setSelectedSlot(slot);
                          }}
                          style={{
                            padding: '0.625rem 1.25rem',
                            borderRadius: 'var(--radius-md)',
                            border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--border-primary)',
                            backgroundColor: isSelected ? 'rgba(163, 230, 53, 0.15)' : 'var(--bg-secondary)',
                            color: isSelected ? 'var(--color-primary)' : 'var(--color-text-primary)',
                            fontSize: '0.875rem',
                            fontWeight: isSelected ? 700 : 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all var(--transition-fast)',
                          }}
                        >
                          <Icon name="clock" size={14} />
                          <span>{slot}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <Link to={`/app/applications/${applicationId}`}>
                <Button variant="ghost" size="md">
                  Cancel
                </Button>
              </Link>
              <Button
                variant="primary"
                size="md"
                disabled={!selectedDate || !selectedSlot}
                isLoading={scheduleMutation.isPending}
                onClick={() => scheduleMutation.mutate()}
                leftIcon={<Icon name="calendar" size={16} />}
              >
                Confirm Booking
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
export default ScheduleInterviewPage;
