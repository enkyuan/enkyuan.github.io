import NoteIcon from "$lib/components/icons/note.svelte";
import GlobeIcon from "$lib/components/icons/globe.svelte";
import StickyNoteIcon from "$lib/components/icons/sticky-note.svelte";
import GithubIcon from "$lib/components/icons/github.svelte";
import { base } from "$app/paths";

export const navigationLinks = [
  { component: NoteIcon, label: "whoami", href: `${base}/` },
  { component: GlobeIcon, label: "crafts", href: `${base}/crafts` },
  {
    component: StickyNoteIcon,
    label: "writing",
    href: `${base}/writing`,
  },
  {
    component: GithubIcon,
    label: "src",
    href: "https://github.com/enkyuan/enkyuan.github.io",
    external: true,
    position: "bottom",
  },
];
