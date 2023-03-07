import React, {useState, useEffect, useContext} from "react";
import { WalletContext } from "../Context/WalletContext";
import { MainSection } from "../Components/index";
import { SwapContextProvider } from "../Context/SwapContext";

const Swap = () => {
  return (
    <div>
      <SwapContextProvider>
        <MainSection />
      </SwapContextProvider>
    </div>
  );
}

export default Swap;
