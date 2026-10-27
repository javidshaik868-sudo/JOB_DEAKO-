import React from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { SuccessState } from '../../components/common/Feedback';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/icons/Icon';

export const ApplicationSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const applicationId = searchParams.get('applicationId') || 'app-recent';
  const jobTitle = searchParams.get('jobTitle') || 'Selected Role';
  const company = searchParams.get('company') || 'Hiring Partner';

  return (
    <div style={{ maxWidth: '640px', margin: '3rem auto' }}>
      <SuccessState
        title="Application Successfully Dispatched!"
        description={`Your resume and candidate dossier have been submitted to ${company} for the ${jobTitle} position. The hiring team will review your qualifications and notify you of upcoming interview steps.`}
        actionLabel="Track Application Progress"
        onAction={() => navigate(`/app/applications/${applicationId}`)}
        secondaryActionLabel="Explore More Jobs"
        onSecondaryAction={() => navigate('/app/jobs')}
      />

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <Link to="/app" style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
          ← Return to Dashboard
        </Link>
      </div>
    </div>
  );
};
export default ApplicationSuccessPage;
