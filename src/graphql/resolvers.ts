//Since schema.ts pool query contains "pools"
//resolver must contain query with same name 

export const resolvers = {
   resolvers: {
    Query: {
      pools: () => 'This is the `greetings` field of the root `Query` type'
    }
  }
};
