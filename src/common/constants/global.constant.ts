export const PASSWORD_HASHER = 'PasswordHasher';

export enum ROLES {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export enum STATUS_PREAPPROVAL {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export const DEFAULT_EMAIL_FROM = 'KJSR <no-reply@kjsr.or.id>';
export const EMAIL_FROM_ADMIN = 'Admin KJSR <admin@kjsr.or.id>';
export const ADMIN_RECIPIENT = ['admin@kjsr.or.id'];

export enum ArticleStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  NEEDS_REVISION = 'needs_revision',
  PUBLISHED = 'published',
}
