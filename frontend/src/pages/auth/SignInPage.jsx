import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { Input, PasswordInput } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/app';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      toast.success('Signed in successfully');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
      toast.error('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your JobDheko account to explore opportunities"
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
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Icon name="warning" size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Social Login Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button
          type="button"
          onClick={() => toast.info('Google SSO integration ready for backend OAuth')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '0.625rem',
            color: 'var(--color-text-primary)',
            fontSize: '0.8125rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'border-color var(--transition-fast)',
          }}
        >
          <Icon name="google" size={16} />
          <span>Google</span>
        </button>

        <button
          type="button"
          onClick={() => toast.info('LinkedIn SSO integration ready for backend OAuth')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '0.625rem',
            color: 'var(--color-text-primary)',
            fontSize: '0.8125rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'border-color var(--transition-fast)',
          }}
        >
          <Icon name="linkedin" size={16} />
          <span>LinkedIn</span>
        </button>

        <button
          type="button"
          onClick={() => toast.info('GitHub SSO integration ready for backend OAuth')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '0.625rem',
            color: 'var(--color-text-primary)',
            fontSize: '0.8125rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'border-color var(--transition-fast)',
          }}
        >
          <Icon name="github" size={16} />
          <span>GitHub</span>
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
        }}
      >
        <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border-subtle)' }} />
        <span>OR EMAIL</span>
        <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border-subtle)' }} />
      </div>

      {/* Credentials Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Icon name="mail" size={16} />}
          required
        />

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
              Password
            </span>
            <Link
              to="/forgot-password"
              style={{ fontSize: '0.75rem', color: 'var(--color-primary)', textDecoration: 'none' }}
            >
              Forgot Password?
            </Link>
          </div>
          <PasswordInput
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          style={{ marginTop: '0.5rem' }}
        >
          Sign In
        </Button>
      </form>

      {/* Switch to Sign Up */}
      <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
        Don&apos;t have an account?{' '}
        <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          Create Account
        </Link>
      </div>
    </AuthLayout>
  );
};
export default SignInPage;
