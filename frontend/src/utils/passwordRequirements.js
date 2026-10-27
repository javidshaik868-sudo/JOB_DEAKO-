export const getPasswordRequirements = (password = '') => [
  {
    key: 'minLength',
    label: 'At least 8 characters',
    met: password.length >= 8,
    error: 'Password must be at least 8 characters long.',
  },
  {
    key: 'uppercase',
    label: 'One uppercase letter (A-Z)',
    met: /[A-Z]/.test(password),
    error: 'Password must include at least one uppercase letter (A-Z).',
  },
  {
    key: 'number',
    label: 'One number (0-9)',
    met: /[0-9]/.test(password),
    error: 'Password must include at least one number (0-9).',
  },
  {
    key: 'specialCharacter',
    label: 'One special character',
    met: /[^A-Za-z0-9\s]/.test(password),
    error: 'Password must include at least one special character.',
  },
];