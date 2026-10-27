import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/icons/Icon';
import { authApi } from '../../services/authApi';
import { useToast } from '../../context/ToastContext';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [debugResetToken, setDebugResetToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide your account email.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await authApi.forgotPassword({ email });
      setDebugResetToken(response.debugResetToken || '');
      setIsSubmitted(true);
      toast.success('Password reset instructions dispatched.');
    } catch {
      // In dev or on backend, show success state
      setIsSubmitted(true);
      toast.info('If that email is registered, you will receive reset instructions.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter the email associated with your account and we will send you a reset link"
    >
      {isSubmitted ? (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              backgroundColor: 'rgba(34, 197, 94, 0.12)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}
          >
            <Icon name="mail" size={24} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
            Check Your Email
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            We sent a password reset link to <strong style={{ color: '#FFFFFF' }}>{email}</strong>.
          </p>

          {import.meta.env.DEV && debugResetToken && (
            <Link to={`/reset-password?token=${encodeURIComponent(debugResetToken)}`} style={{ marginTop: '0.5rem' }}>
              <Button variant="primary" size="md" fullWidth>
                Open development reset link
              </Button>
            </Link>
          )}

          <div style={{ marginTop: '1rem' }}>
            <Link to="/signin" style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
              ← Return to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && (
            <div
              role="alert"
              style={{
                backgroundColor: 'var(--color-error-bg)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '0.625rem 0.875rem',
                fontSize: '0.8125rem',
                color: 'var(--color-error)',
              }}
            >
              {error}
            </div>
          )}

          <Input
            label="Account Email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Icon name="mail" size={16} />}
            required
          />

          <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading}>
            Send Reset Link
          </Button>

          <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            <Link to="/signin" style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
              ← Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
export default ForgotPasswordPage;
