import { gql } from "graphql-request";

export const typeDefs = gql`
	type Pool{
		id: number
		token0: string
		token1: string
	}

	type getPool {
		tokenA: string,
	    tokenB: string,
	    fee: number
		getPool: pool!
	}
`