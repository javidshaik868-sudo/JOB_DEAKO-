import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { PasswordInput } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/icons/Icon';
import { authApi } from '../../services/authApi';
import { useToast } from '../../context/ToastContext';
import { getPasswordRequirements } from '../../utils/passwordRequirements';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const toast = useToast();
  const navigate = useNavigate();

  const passwordRequirements = getPasswordRequirements(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('This password reset link is missing or invalid. Request a new one.');
      return;
    }

    const unmetPasswordRequirement = passwordRequirements.find((requirement) => !requirement.met);
    if (unmetPasswordRequirement) {
      setError(unmetPasswordRequirement.error);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword({ token, newPassword: password });
      toast.success('Password successfully reset! Please sign in.');
      navigate('/signin');
    } catch (requestError) {
      setError(requestError.message || 'Password reset failed. Request a new reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Your new password must be unique from previously used credentials"
    >
      {error && (
        <div
          role="alert"
          style={{
            backgroundColor: 'var(--color-error-bg)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.625rem 0.875rem',
            marginBottom: '1.25rem',
            fontSize: '0.8125rem',
            color: 'var(--color-error)',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <PasswordInput
          label="New Password"
          placeholder="8+ chars, uppercase, number, symbol"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <PasswordInput
          label="Confirm New Password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {/* Requirements Checklist */}
        <div
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.375rem',
            fontSize: '0.75rem',
          }}
        >
          {passwordRequirements.map((requirement) => (
            <div
              key={requirement.key}
              style={{
                color: requirement.met ? 'var(--color-primary)' : 'var(--color-text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Icon name={requirement.met ? 'check' : 'close'} size={14} />
              <span>{requirement.label}</span>
            </div>
          ))}
        </div>

        <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading}>
          Reset Password
        </Button>

        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <Link to="/signin" style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
            ← Back to Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};
export default ResetPasswordPage;
