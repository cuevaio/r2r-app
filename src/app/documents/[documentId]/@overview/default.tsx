import { db } from '@/db';
import { documentInfoPrimary, usersPrimary } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { FileTextIcon, UserCircleIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { LocalDate } from '@/components/local-date';

import { readableFileSize } from '@/lib/readable-file-size';

import { Title } from './title';

const DocumentOverviewPage = async ({
  params,
}: {
  params: { documentId: string };
}) => {
  const [{ document_info_primary: document, users_primary: user }] = await db
    .select()
    .from(documentInfoPrimary)
    .leftJoin(usersPrimary, eq(documentInfoPrimary.userId, usersPrimary.id))
    .where(eq(documentInfoPrimary.documentId, params.documentId));

  return (
    <div className="flex justify-between">
      <div className="space-y-1">
        <div className="flex items-start">
          <div className="mr-2 flex w-6 justify-end">
            <FileTextIcon className="size-6" />
          </div>
          <Title>{document.title!}</Title>
        </div>

        <div className="flex items-center">
          <div className="mr-2 flex w-6 justify-end">
            <UserCircleIcon className="size-4" />
          </div>
          <div className="text-xs">{user?.name || 'Unknown user'}</div>
        </div>
        <div className="flex items-end">
          <div className="mr-2 flex w-6 justify-end">
            <div className="text-xs font-bold">Size</div>
          </div>
          <Tooltip>
            <TooltipTrigger className="text-xs">
              {readableFileSize(document.sizeInBytes!, true)}
            </TooltipTrigger>
            <TooltipContent>
              <p>{readableFileSize(document.sizeInBytes!, false)}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-end">
          <div className="mr-2 flex w-6 justify-end">
            <div className="text-xs font-bold">Version</div>
          </div>
          <div className="text-xs">{document.version}</div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <Badge variant="secondary">
          <FileTextIcon className="size-4" />
          {document.documentId}
        </Badge>

        <div className="font-mono text-xs">
          Created at <LocalDate>{document.createdAt!}</LocalDate>
        </div>
        <div className="font-mono text-xs">
          Updated at <LocalDate>{document.updatedAt!}</LocalDate>
        </div>
      </div>
    </div>
  );
};

export default DocumentOverviewPage;
