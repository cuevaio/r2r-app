import { ChunksPagination } from './pagination';

const DocumentLayout = async ({
  children,
  overview,
  chunks,
}: {
  children: React.ReactNode;
  overview: React.ReactNode;
  chunks: React.ReactNode;
}) => {
  return (
    <div>
      {children}
      {overview}
      <div>
        <ChunksPagination />
      </div>
      {chunks}
    </div>
  );
};

export default DocumentLayout;
