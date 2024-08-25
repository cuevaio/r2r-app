import { db } from '@/db';
import { documentInfoPrimary } from '@/db/schema';
import Link from 'next/link';

const TestPage = async () => {
  const documents = await db.select().from(documentInfoPrimary);

  return (
    <div>
      <h1>Documents</h1>

      <div className="grid grid-cols-3">
        {documents.map((doc) => (
          <Link
            key={doc.documentId}
            className="border"
            href={`/documents/${doc.documentId}`}
          >
            {doc.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TestPage;
