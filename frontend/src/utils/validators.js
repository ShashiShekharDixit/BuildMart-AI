export const required = (value) => (!value ? 'This field is required' : null);
export const minLength = (min) => (value) => (!value || value.length < min ? `Minimum ${min} characters` : null);
export const maxLength = (max) => (value) => (value && value.length > max ? `Maximum ${max} characters` : null);
export const isEmail = (value) => (!/\S+@\S+\.\S+/.test(value) ? 'Invalid email address' : null);
export const isPhone = (value) => (!/^[6-9]\d{9}$/.test(value) ? 'Invalid Indian phone number' : null);
export const isPositive = (value) => (Number(value) <= 0 ? 'Must be greater than 0' : null);

export const validate = (rules, value) => {
  for (const rule of rules) {
    const error = rule(value);
    if (error) return error;
  }
  return null;
};
