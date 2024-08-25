import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';

const DocumentChunksPage = async ({
  params,
}: {
  params: { documentId: string; pageIndex: string };
}) => {
  const pageIndex = z
    .preprocess((val) => {
      if (typeof val === 'string') {
        return parseInt(val, 10);
      }
      return val;
    }, z.number().min(0).int())
    .safeParse(params.pageIndex);

  if (!pageIndex.success) {
    throw new Error('Invalid page index');
  }

  if (pageIndex.data.toString() !== params.pageIndex) {
    throw new Error('Invalid page index');
  }

  const chunks = (
    (await db.execute(sql`SELECT
  metadata, id, CAST(metadata ->> 'chunk_order' AS INTEGER) AS chunk_order
FROM
  vecs.primary
WHERE
  metadata ->> 'document_id' = ${params.documentId}
ORDER BY
  chunk_order
LIMIT
  10
OFFSET ${10 * pageIndex.data}`)) as {
      metadata: {
        document_id: string;
        extraction_id: string;
        text: string;
        title: string;
        user_id: string;
      };
      id: string;
      chunk_order: number;
    }[]
  ).map((x) => ({
    id: x.id,
    text: x.metadata.text,
    chunk_order: x.chunk_order,
  }));

  return (
    <div>
      <div className="grid grid-cols-1 gap-4">
        {chunks.map((chunk) => (
          <div key={chunk.id} className="rounded bg-muted p-4 text-foreground">
            <div className="flex justify-between">
              <Badge className="text-xs">{chunk.id}</Badge>
            </div>
            <p>{chunk.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentChunksPage;
