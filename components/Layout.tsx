import Head from "next/head";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <title>DiagramGenie</title>
        <meta
          name="description"
          content="Generate software engineering diagrams"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`${inter.className} flex flex-col items-center min-h-[100vh] p-6`}
      >
        {children}
      </main>
    </>
  );
};
