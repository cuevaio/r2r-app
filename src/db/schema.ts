import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

export const documentInfoPrimary = pgTable('document_info_primary', {
  documentId: uuid('document_id').primaryKey().notNull(),
  title: text('title'),
  userId: uuid('user_id'),
  version: text('version'),
  sizeInBytes: integer('size_in_bytes'),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  }).defaultNow(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    mode: 'string',
  }).defaultNow(),
  metadata: jsonb('metadata'),
  status: text('status').default('processing'),
});

export const usersPrimary = pgTable(
  'users_primary',
  {
    id: uuid('id')
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    email: text('email').notNull(),
    hashedPassword: text('hashed_password').notNull(),
    isSuperuser: boolean('is_superuser').default(false),
    isActive: boolean('is_active').default(true),
    isVerified: boolean('is_verified').default(false),
    verificationCode: text('verification_code'),
    verificationCodeExpiry: timestamp('verification_code_expiry', {
      withTimezone: true,
      mode: 'string',
    }),
    name: text('name'),
    bio: text('bio'),
    profilePicture: text('profile_picture'),
    resetToken: text('reset_token'),
    resetTokenExpiry: timestamp('reset_token_expiry', {
      withTimezone: true,
      mode: 'string',
    }),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => {
    return {
      usersPrimaryEmailKey: unique('users_primary_email_key').on(table.email),
    };
  },
);

export const blacklistedTokensPrimary = pgTable(
  'blacklisted_tokens_primary',
  {
    id: uuid('id')
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    token: text('token').notNull(),
    blacklistedAt: timestamp('blacklisted_at', {
      withTimezone: true,
      mode: 'string',
    }).defaultNow(),
  },
  (table) => {
    return {
      idxBlacklistedTokensPrimaryBlacklistedAt: index(
        'idx_blacklisted_tokens_primary_blacklisted_at',
      ).using('btree', table.blacklistedAt),
      idxBlacklistedTokensPrimaryToken: index(
        'idx_blacklisted_tokens_primary_token',
      ).using('btree', table.token),
    };
  },
);
