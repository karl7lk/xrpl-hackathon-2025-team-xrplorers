import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-prod';

export function signAdminToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      org: user.organization
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
}

export function verifyAdminToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export const ROLES = {
  GLOBAL: 'global_admin',
  GOV: 'government',
  NGO: 'ngo'
};