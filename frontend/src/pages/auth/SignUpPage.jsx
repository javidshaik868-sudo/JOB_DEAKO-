import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { Input, PasswordInput, Select, Checkbox } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getPasswordRequirements } from '../../utils/passwordRequirements';

export const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    qualification: 'B.Tech / B.E.',
    gender: 'Prefer not to say',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const passwordRequirements = getPasswordRequirements(formData.password);
  const strength = passwordRequirements.filter((requirement) => requirement.met).length;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Please enter your mobile phone number.');
      return;
    }
    const unmetPasswordRequirement = passwordRequirements.find((requirement) => !requirement.met);
    if (unmetPasswordRequirement) {
      setError(unmetPasswordRequirement.error);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!formData.agreeTerms) {
      setError('You must agree to the Terms of Service to continue.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await signup(formData);
      toast.success(response.debugOtp
        ? `Development verification code: ${response.debugOtp}`
        : 'Account created. Check your email for a verification code.');
      navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your information.');
      toast.error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join JobDheko to discover curated engineering and tech roles"
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

      {/* Social Registration */}
      <div className="signup-social-buttons" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <button
          type="button"
          aria-label="Sign up with Google"
          title="Sign up with Google"
          onClick={() => toast.info('Google SSO ready')}
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
          }}
        >
          <Icon name="google" size={16} />
          <span>Google</span>
        </button>

        <button
          type="button"
          aria-label="Sign up with LinkedIn"
          title="Sign up with LinkedIn"
          onClick={() => toast.info('LinkedIn SSO ready')}
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
          }}
        >
          <Icon name="linkedin" size={16} />
          <span>LinkedIn</span>
        </button>

        <button
          type="button"
          aria-label="Sign up with GitHub"
          title="Sign up with GitHub"
          onClick={() => toast.info('GitHub SSO ready')}
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
          marginBottom: '1.25rem',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
        }}
      >
        <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border-subtle)' }} />
        <span>OR REGISTER WITH DETAILS</span>
        <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border-subtle)' }} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Input
          label="Full Name"
          name="fullName"
          placeholder="e.g. Priya Sharma"
          value={formData.fullName}
          onChange={handleChange}
          leftIcon={<Icon name="user" size={16} />}
          required
        />

        <Input
          label="Gmail / Email Address"
          type="email"
          name="email"
          placeholder="priya@example.com"
          value={formData.email}
          onChange={handleChange}
          leftIcon={<Icon name="mail" size={16} />}
          required
        />

        <Input
          label="Mobile Number"
          type="tel"
          name="phone"
          placeholder="+91 98765 43210"
          value={formData.phone}
          onChange={handleChange}
          leftIcon={<Icon name="phone" size={16} />}
          required
        />

        <div className="signup-qualification-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <Select
            label="Qualification"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            options={[
              { value: 'B.Tech / B.E.', label: 'B.Tech / B.E.' },
              { value: 'M.Tech / M.E.', label: 'M.Tech / M.E.' },
              { value: 'B.Sc / BCA', label: 'B.Sc / BCA' },
              { value: 'M.Sc / MCA', label: 'M.Sc / MCA' },
              { value: 'Other Degree', label: 'Other Degree' },
            ]}
          />

          <Select
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={[
              { value: 'Female', label: 'Female' },
              { value: 'Male', label: 'Male' },
              { value: 'Non-binary', label: 'Non-binary' },
              { value: 'Prefer not to say', label: 'Prefer not to say' },
            ]}
          />
        </div>

        <div>
          <PasswordInput
            label="Password"
            name="password"
            placeholder="8+ chars, uppercase, number, symbol"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {/* Password Strength Meter */}
          {formData.password && (
            <div style={{ marginTop: '0.375rem' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    style={{
                      flex: 1,
                      height: 3,
                      borderRadius: 2,
                      backgroundColor:
                        strength >= step
                          ? strength <= 2
                            ? 'var(--color-warning)'
                            : 'var(--color-primary)'
                          : 'var(--border-subtle)',
                      transition: 'background-color 200ms ease',
                    }}
                  />
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.375rem 0.75rem', marginTop: '0.5rem', fontSize: '0.6875rem' }}>
                {passwordRequirements.map((requirement) => (
                  <div
                    key={requirement.key}
                    style={{
                      color: requirement.met ? 'var(--color-primary)' : 'var(--color-text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <Icon name={requirement.met ? 'check' : 'close'} size={13} />
                    <span>{requirement.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Re-enter password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <Checkbox
          label="I agree to the Terms of Service & Privacy Policy"
          name="agreeTerms"
          checked={formData.agreeTerms}
          onChange={handleChange}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          style={{ marginTop: '0.5rem' }}
        >
          Create Account
        </Button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
        Already have an account?{' '}
        <Link to="/signin" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          Sign In
        </Link>
      </div>
    </AuthLayout>
  );
};
export default SignUpPage;
