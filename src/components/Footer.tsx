import { sitemap } from "../sitemap";

const Footer = () => {
  return (
    <div className="md:py-4 sm:py-0">
      <div className="flex flex-col items-end justify-between gap-4 md:h-16 md:flex-row sm:h-4">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
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
