import Head from "next/head";
import { Inter } from "next/font/google";
import Link from "next/link";
import { GithubIcon } from "./GithubIcon";

const inter = Inter({ subsets: ["latin"] });

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <title>DiagramGenie🔮</title>
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
        <Link
          href="https://github.com/ShimantaBhuyan/diagram-genie"
          className="fixed right-6 sm:right-4 top-0 sm:top-4 shadow-2xl p-5 rounded-full cursor-pointer w-[36px] h-[36px] sm:w-fit sm:h-fit"
        >
          <GithubIcon />
        </Link>
        {children}
      </main>
      <div className="flex flex-col justify-center items-center w-full shadow-2xl mt-10 py-4 gap-5 pb-5">
        <h2 className="text-md">
          Made with ☕ by{" "}
          <Link href="https://twitter.com/AllDevThings" className="underline">
            Shimanta
          </Link>
        </h2>
      </div>
    </>
  );
};
