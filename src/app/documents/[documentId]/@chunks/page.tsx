import { db } from '@/db';
import { sql } from 'drizzle-orm';

const DocumentChunksPage = async ({
  params,
}: {
  params: { documentId: string };
}) => {
  const chunks = (
    (await db.execute(sql`SELECT
  metadata, id
FROM
  vecs.primary
WHERE
  metadata ->> 'document_id' = ${params.documentId}
ORDER BY
  CAST(metadata ->> 'chunk_order' AS INTEGER)
LIMIT
  10`)) as {
      metadata: {
        document_id: string;
        extraction_id: string;
        text: string;
        title: string;
        user_id: string;
      };
      id: string;
    }[]
  ).map((x) => ({ id: x.id, text: x.metadata.text }));

  return (
    <div>
      <div className="grid grid-cols-1 gap-4">
        {chunks.map((chunk) => (
          <div
            key={chunk.id}
            className="rounded bg-primary/10 p-4 text-primary-foreground"
          >
            {chunk.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentChunksPage;
