import {GraphQLClient} from 'graphql-request';
import {GetStaticProps}from "next";

const endpoint = process.env.DATABASE_URL as string;
const graphQLClient = new GraphQLClient(endpoint);
graphQLClient.setHeader('X-GQL-TOKEN', process.env.GRAPH_QL_API_KEY as string);
export default graphQLClient;