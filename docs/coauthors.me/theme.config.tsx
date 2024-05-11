import Image from "next/image";
import { useRouter } from "next/router.js";
import { type DocsThemeConfig, useConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logoLink: "/why",
  logo: function Logo() {
    return (
      <div className="flex items-center gap-1">
        <Image
          src="/img/logo.png"
          width={34}
          height={34}
          alt="coauthors logo"
        />
        <div className="relative">
          <strong>Coauthors</strong>
        </div>
      </div>
    );
  },
  head: function Head() {
    const { title, frontMatter } = useConfig();
    const { asPath } = useRouter();

    return (
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content={title || "Coauthors"} />
        <meta property="og:url" content={`https://coauthors.me${asPath}`} />
        <meta
          property="og:description"
          content={frontMatter.description || "Make us as Co-author easily"}
        />
        <meta property="og:image" content="/banner.png" />
        <link rel="icon" href="/img/favicon.ico" type="image/ico" />
      </>
    );
  },
  project: {
    link: "https://github.com/coauthors/coauthors",
  },
  docsRepositoryBase:
    "https://github.com/coauthors/coauthors/tree/main/docs/coauthors.io",
  useNextSeoProps() {
    const { asPath } = useRouter();
    if (asPath !== "/") {
      return {
        titleTemplate: "%s – Coauthors",
      };
    }
  },
  feedback: {
    content: "",
  },
  editLink: {
    text: "Edit this page →",
  },
  sidebar: {
    titleComponent({ title }) {
      return <>{title}</>;
    },
    defaultMenuCollapseLevel: 4,
    toggleButton: true,
  },
  search: {
    placeholder: "Search documentation...",
  },
  footer: {
    text: "2024 © Coauthors authors.",
  },
  darkMode: false,
  nextThemes: {
    forcedTheme: "dark",
  },
};

export default config;
