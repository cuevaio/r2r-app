'use server';

import { db } from '@/db';
import { documentInfoPrimary } from '@/db/schema';
import { DrizzleError, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function changeTitle(formData: FormData): Promise<
  | {
      success: true;
    }
  | { success: false; error: string }
> {
  const documentId = formData.get('documentId');
  const title = formData.get('title');

  const documentIdParsing = z.string().uuid().safeParse(documentId);
  if (!documentIdParsing.success) {
    return {
      success: false,
      error: 'Document id: ' + documentIdParsing.error.issues[0].message,
    };
  }

  const titleParsing = z
    .string({ description: 'title' })
    .min(1)
    .max(127)
    .safeParse(title);
  if (!titleParsing.success) {
    return {
      success: false,
      error: 'Title: ' + titleParsing.error.issues[0].message,
    };
  }

  try {
    await db
      .update(documentInfoPrimary)
      .set({
        title: titleParsing.data,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(documentInfoPrimary.documentId, documentIdParsing.data));

    revalidatePath(`/documents/${documentIdParsing.data}`, 'page');
    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof DrizzleError) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  return {
    success: false,
    error: 'Internal server error',
  };
}
