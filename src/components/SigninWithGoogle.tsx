import React, { FC, ReactNode } from "react";
import { Button } from "./ui/button";

interface google {
  childern: ReactNode;
}

const SigninWithGoogle: FC<google> = ({ childern }) => {
    
  const loginWithGoogle = () => {
    console.log("hello");
  };

  return <Button onClick={() => loginWithGoogle()}>{childern}</Button>;
};

export default SigninWithGoogle;
