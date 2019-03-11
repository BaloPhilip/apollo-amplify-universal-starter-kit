// eslint-disable
// this is an auto generated file. This will be overwritten

export const getCounter = `query GetCounter($id: ID!) {
  getCounter(id: $id) {
    amount
  }
}
`;
export const listCounters = `query ListCounters(
  $filter: ModelCounterFilterInput
  $limit: Int
  $nextToken: String
) {
  listCounters(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      amount
    }
    nextToken
  }
}
`;
