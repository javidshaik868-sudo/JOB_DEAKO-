import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/icons/Icon';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const VerifyOtpPage = () => {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const [email] = useState(initialEmail);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = useRef([]);
  const { verifyOTP, resendOTP } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleInputChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only allow last typed character
    setOtp(newOtp);

    // Auto-next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split('');
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      const response = await resendOTP(email);
      setTimer(45);
      setCanResend(false);
      toast.info(response.debugOtp ? `Development verification code: ${response.debugOtp}` : 'A new verification code was sent.');
    } catch (requestError) {
      setError(requestError.message || 'Could not resend the verification code.');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    setIsLoading(true);
    try {
      await verifyOTP({ email, otp: fullOtp });
      toast.success('Email verified successfully! Welcome to JobDheko.');
      navigate('/app', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP. Please try again.');
      toast.error('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle={`We've dispatched a 6-digit verification code to ${email}`}
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

      <form onSubmit={handleVerify}>
        {/* OTP 6-box input container */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            margin: '1.5rem 0 2rem',
          }}
          onPaste={handlePaste}
        >
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              style={{
                width: '46px',
                height: '52px',
                textAlign: 'center',
                fontSize: '1.25rem',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-primary)',
              }}
              aria-label={`Digit ${idx + 1}`}
            />
          ))}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
        >
          Verify & Continue
        </Button>
      </form>

      {/* Resend Timer & Email change */}
      <div
        style={{
          marginTop: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.8125rem',
          color: 'var(--color-text-secondary)',
        }}
      >
        <div>
          Didn&apos;t receive code?{' '}
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              style={{
                color: 'var(--color-primary)',
                fontWeight: 600,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Resend Code
            </button>
          ) : (
            <span style={{ color: 'var(--color-text-muted)' }}>
              Resend in <strong style={{ color: '#FFFFFF' }}>{timer}s</strong>
            </span>
          )}
        </div>

        <Link to="/signup" style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
          Wrong email address? Change email
        </Link>
      </div>
    </AuthLayout>
  );
};
export default VerifyOtpPage;
