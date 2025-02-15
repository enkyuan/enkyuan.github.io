import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold mb-8">hey, i'm enkang</h1>

      <p className="text-md">cs + math student building tools for the web</p>

      <section>
        <h2 className="text-xl font-bold mb-4">what i'm up to:</h2>
        <ul className="text-sm  pl-5 space-y-2">
          <li>- researching compiler design</li>
          <li>- working on advanced maths</li>
          <li>
            - platform/backend @{" "}
            <Link
              to="https://www.gather-connect.com/"
              className="underline underline-offset-4"
            >
              Gather
            </Link>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">sidequests:</h2>
        <ul className="text-sm pl-4 space-y-2">
          <li>- learning to speak Mandarin through immersion </li>
          <li>- studying Hanzi (writing Chinese) using Anki </li>
          <li>- configuring my fedora asahi setup</li>
          <li>- hitting the gym </li>
          <li>- playing violin</li>
          <li>- grinding chess</li>
          <li>- hiking</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">thinking about:</h2>
        <ul className="text-sm space-y-1">
          <li>- personal agency</li>
          <li>- stoicism, and philosophy in general</li>
          <li>- what im going to do with my life</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">get in touch:</h2>
        <div className="text-sm flex flex-col gap-2 space-x-4 space-y-2">
          <div>
            id love to hear any insights, ideas, or anything informal. reach out
            to me via email (below) or my socials.
          </div>
          <div>yuan.enkng [at] gmail [dot] com</div>
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
