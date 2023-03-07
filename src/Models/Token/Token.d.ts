import Contract_Network_Info from "../Contract/contract";
import {ContractInterface} from "ethers";

export declare interface IToken {
  name: string,
  symbol: string,
  type: string,
  img: StaticImageData,
  Network: [Contract_Network_Info],
  balance: number
}