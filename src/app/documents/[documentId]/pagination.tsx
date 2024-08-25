'use client';

import React from 'react';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ChunksPagination = () => {
  const params = useParams<{ pageIndex: string; documentId: string }>();
  const router = useRouter();

  const [pageIndexValue, setPageIndexValue] = React.useState<
    string | undefined
  >(params?.pageIndex);

  const pageIndex = pageIndexValue ? parseInt(pageIndexValue) : undefined;

  React.useEffect(() => {
    if (params) {
      setPageIndexValue(params?.pageIndex);
    }
  }, [params]);

  return (
    <div className="my-4 flex space-x-2">
      <form
        onSubmit={(event) => {
          event.preventDefault();

          const formData = new FormData(event.target as HTMLFormElement);

          const pageIndex = z
            .preprocess((val) => {
              if (typeof val === 'string') {
                return parseInt(val, 10);
              }
              return val;
            }, z.number().min(0).int())
            .safeParse(formData.get('pageIndex'));

          if (pageIndex.success) {
            router.push(`/documents/${params?.documentId}/p/${pageIndex.data}`);
          }
        }}
      >
        <Input
          className="size-8 p-1 text-center"
          name="pageIndex"
          value={pageIndexValue || 0}
          onChange={(event) => {
            setPageIndexValue(event.target.value);
          }}
        />
      </form>

      <Button
        className="size-8"
        type="button"
        variant="outline"
        size="icon"
        disabled={!pageIndex || pageIndex < 1}
        onClick={() => {
          if (pageIndex && pageIndex > 0) {
            router.push(`/documents/${params?.documentId}/p/${pageIndex - 1}`);
          }
        }}
      >
        <ChevronLeftIcon className="size-4" />
      </Button>

      <Button
        className="size-8"
        type="button"
        variant="outline"
        size="icon"
        onClick={() => {
          router.push(
            `/documents/${params?.documentId}/p/${(pageIndex || 0) + 1}`,
          );
        }}
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
};

export { ChunksPagination };
