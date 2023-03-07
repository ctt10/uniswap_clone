import {IToken} from "./Token";
import images from "../../Assets/index"
/**
 * This servers as a base model
 *  to describe/display a token in app
 */
export const defaultToken:IToken = {
  name:"",
  symbol: "",
  type: "",
  img: "",
  Network:[{
    name:"",
    Abi:"",
    Address:""
  }],
  balance:0
}