import { Todos, Todo } from '@/components/Todos';
import { client } from '@/lib/client';
import { gql } from 'graphql-request';

type MyListPageMetadata = {
  params: { listId: string };
}

export async function generateMetadata({ params }: MyListPageMetadata) {
  return {
    title: `TODO List ${params.listId}`,
  };
}

type MyListPageProps = MyListPageMetadata;

const GET_TODOs_QUERY = gql`
  query GetTODOs($listId: Int!) {
    getTODOs(listId: $listId) {
      id
      desc
      finished
    }
  }
`;

export default async function MyListPage({ params: { listId } }: MyListPageProps) {
  const { getTODOs } = await client.request<{ getTODOs: Todo[] }>(GET_TODOs_QUERY, {
    listId: parseInt(listId),
  });

  return (
    <div className="flex align-center justify-center p-16 sm:p-8">
      <Todos
        listId={parseInt(listId)}
        // TODO swap with real data from query and
        // make sure to make the query from the server
        list={ getTODOs ?? []}
      />
    </div>
  );
}
