import { describe, expect, it } from 'vitest';
import { homePath } from './api';

describe('homePath', () => {
  it('sends only super admins to the admin panel', () => {
    expect(homePath('super_admin')).toBe('/panel');
    expect(homePath('admin')).toBe('/crm');
    expect(homePath('user')).toBe('/profile');
    expect(homePath(undefined)).toBe('/profile');
  });
});
