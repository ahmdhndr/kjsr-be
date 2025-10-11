export const PASSWORD_HASHER = 'PasswordHasher';
export const MAILER = 'Mailer';

export enum ROLES {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export enum STATUS_PREAPPROVAL {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// export const DEFAULT_EMAIL_FROM = process.env.DEFAULT_EMAIL_FROM;
// export const EMAIL_FROM_ADMIN = process.env.EMAIL_FROM_ADMIN;

// export const ADMIN_RECIPIENT: string[] = JSON.parse(
//   process.env.ADMIN_RECIPIENT as string,
// );

export enum ArticleStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  NEEDS_REVISION = 'needs_revision',
  PUBLISHED = 'published',
}
