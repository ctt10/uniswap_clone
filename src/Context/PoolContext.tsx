import React, { useState, useEffect, createContext } from "react";
import {ethers} from "ethers";
import {Token, CurrencyAmount, TradeType, Percent} from "@uniswap/sdk-core"; 
import {
    createContractInstance
} from "../Utils/Contracts/ContractUtils";
import {
    getPoolPrice,
    getPoolImmutables,
    getPoolState,
} from "../Utils/Pools/PoolUtils";
import {
    swapUpdatePrice,
} from "../Utils/Price/PriceUtils";

//@Types
import { 
    defaultPool, IPool,
    defaultToken, IToken,
    defaultPoolContext, IPoolContext
}  from "../Models/index";
import {
    singleSwap
} from "../Utils/Swap/SwapUtils";

/**
 * This goal of object serves as a global state manager 
 *     for a singed in user
 */
export const PoolContext = createContext<IPoolContext>(defaultPoolContext);

export const PoolContextProvider = ({ children }) => {
    if(!children) return null;

    //TOKEN PAIR
    const [activePool, setActivePool] = useState<IPool>(defaultPool); //index of active pool?

    const [tokenOne, setTokenOne] = useState<IToken>(defaultPool.tokenX);
    const [tokenOneAmount, setTokenOneAmount] = useState<number>(defaultPool.tokenOneAmount);

    const [tokenTwo, setTokenTwo] = useState<IToken>(defaultPool.tokenY);
    const [tokenTwoAmount, setTokenTwoAmount] = useState<number>(defaultPool.tokenTwoAmount);

    const [slippage, setSlippage] = useState<number>(defaultPool.slippage);
    const [deadline, setDeadline] = useState<number>(defaultPool.deadline);
    const [fee, setFee] = useState<number>(defaultPool.fee);

    return(
        <PoolContext.Provider
            value={{
                tokenOne,
                setTokenOne,
                tokenOneAmount,
                setTokenOneAmount,
                tokenTwo,
                setTokenTwo,
                tokenTwoAmount,
                setTokenTwoAmount,
                activePool,
                setActivePool,
                slippage,
                setSlippage,
                deadline,
                setDeadline,
                fee,
                setFee,
            }}
        >
            {children}
        </PoolContext.Provider>
    );
}