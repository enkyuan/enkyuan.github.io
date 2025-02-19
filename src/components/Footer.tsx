import { sitemap } from "../sitemap";

const Footer = () => {
  return (
    <div className="py-4">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
        <p className="w-full text-balance text-sm leading-loose text-muted-foreground">
          Built by{" "}
          <a
            href={sitemap.links.personal}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            enkyuan
          </a>
          . Source code available on{" "}
          <a
            href={sitemap.links.repo}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Footer;
