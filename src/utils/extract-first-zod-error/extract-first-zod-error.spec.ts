import { extractFirstZodError } from './extract-first-zod-error';

describe('extractFirstZodError', () => {
  it('should return the first error message from field errors', () => {
    const fakeErrorFormat = {
      name: { _errors: ['Name is required'] },
      age: { _errors: [] },
      _errors: [],
    };

    expect(extractFirstZodError(fakeErrorFormat)).toBe('Name is required');
  });

  it('should skip _errors and find the next field error', () => {
    const fakeErrorFormat = {
      _errors: ['Some general error'],
      age: { _errors: ['Age must be a number'] },
    };

    expect(extractFirstZodError(fakeErrorFormat)).toBe('Age must be a number');
  });

  it('should return fallback message if no specific error found', () => {
    const fakeErrorFormat = {
      name: { _errors: [] },
      age: { _errors: [] },
      _errors: [],
    };

    expect(extractFirstZodError(fakeErrorFormat)).toBe('Validation failed');
  });
});
