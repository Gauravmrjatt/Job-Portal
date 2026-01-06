import "./globals.css";
import { Toaster } from "sonner";
import ReduxProvider from "@/components/providers/ReduxProvider";

export const metadata = {
  title: "Job Portal - Find Your Dream Job",
  description: "A modern job portal to find and apply for your dream job",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
