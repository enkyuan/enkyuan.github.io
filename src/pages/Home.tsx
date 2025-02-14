import { Icon } from "@iconify/react";

const Home = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-8">hey, i'm enkang</h1>

      <p className="text-md">cs + math student building tools for the web</p>

      <section>
        <h2 className="text-xl font-bold mb-4">what i'm up to:</h2>
        <ul className="text-sm  pl-5 space-y-2">
          <li>- figuring out what to do with my life</li>
          <li>- learning as much as i can</li>
          <li>- trying to meet cool people</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">previously:</h2>
        <ul className="text-sm pl-5 space-y-2">
          <li>
            - best overall hack @ columbia devfest (
            <a className="underline" href="./Projects">
              social stockfish
            </a>
            )
          </li>
          <li>
            - stony brook icpc (top 30 GNY, syntax saviors winning it all in
            2025)
          </li>
          <li>- high school stuff</li>
          <ul className="list-disc pl-9 space-y-2">
            <li>salutatorian (2/390), 1570 on a standardized test</li>
            <li>
              math team, math honor society president (top 5 NCIML, top 20 ARML)
            </li>
            <li>
              ran some other clubs (nhs president, multicultural show director)
            </li>
            <li>top 500 trading seashells and fish (imc prosperity 2)</li>
            <li>grandmaster (top 1000 NA) teamfight tactics</li>
          </ul>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">thinking about:</h2>
        <ul className="text-sm space-y-1">
          <li>- personal agency</li>
          <li>- communication</li>
          <li>- archetypes of people</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">get in touch:</h2>
        <div className="text-sm flex flex-col gap-2 space-x-4 space-y-2">
          <div>
            id love to hear any insights, ideas, or anything informal. reach out
            to me via email (below) or my socials.
          </div>
          <div>email me at yuan.enkng [at] gmail [dot] com</div>
          <div className="flex flex-row gap-2">
            <a href="https://github.com/enkyuan" aria-label="GitHub">
              <Icon icon="ri:github-fill" className="w-8 h-auto" />
            </a>
            <a href="https://x.com/enkyuan" aria-label="Twitter">
              <Icon icon="ri:twitter-fill" className="w-8 h-auto" />
            </a>
            <a
              href="https://www.linkedin.com/in/enkyuan/"
              aria-label="LinkedIn"
            >
              <Icon icon="ri:linkedin-fill" className="w-8 h-auto" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
