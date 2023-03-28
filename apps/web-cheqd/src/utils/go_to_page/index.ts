export * from 'ui/utils/go_to_page';

export function DID_RESOLVER_URL(did: string) {
  return `https://resolver.cheqd.net/1.0/identifiers/${did}`;
}
export const RESOURCE_URL = (collection: string, id: string) =>
  `https://resolver.cheqd.net/1.0/identifiers/did:cheqd:${method}:${collection}/resources/${id}`;
