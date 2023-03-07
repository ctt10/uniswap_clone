import {IPool, IPoolContext} from "./Pool";
import {defaultToken} from "../Token/defaultToken";

/**
 * This servers as a base model
 *  to describe/display a pool in app
 */
export const defaultPool:IPool = {
  Id: "",
  Address: "",
  tokenX:defaultToken,
  tokenOneAmount: 0,
  tokenY:defaultToken,
  tokenTwoAmount: 0,
  Network: [{
    Name:"",
    Address: ""
  }],
  slippage:0,
  deadline:0,
  fee:0,
}

export const defaultPoolContext:IPoolContext = {
  tokenOne: defaultToken,
  setTokenOne: () => {},
  tokenTwo: defaultToken,
  setTokenTwo: ()=> {},
  activePool: defaultPool,
  setActivePool: () => {},
  slippage:0,
  setSlippage:()=> {},
  deadline:0,
  setDeadline:()=> {},
  fee:0,
  setFee:()=> {},
}

