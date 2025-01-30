import { PropsWithChildren } from "react";
import { Navbar } from "@/components/navbar";

export default  function AuthLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <div>
      <Navbar />
        {children}
    </div>
  );
}
