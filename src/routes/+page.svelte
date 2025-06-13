<script lang="ts">
import Button from "../lib/components/ui/button.svelte";
import ArrowRight from "../lib/components/icons/arrow-right.svelte";
import Mail from "../lib/components/icons/mail.svelte";
import Twitter from "../lib/components/icons/twitter.svelte";
import { pages, labels } from "$lib/constants";

let current = 0;
const next = (current + 1) % pages.length;
</script>

<div class="top-center-btn">
	<Button href={pages[next]} variant="primary">
		{labels[current]}
		<span slot="icon"><ArrowRight /></span>
	</Button>
</div>

<div class="geist-bg-full">
	<div class="page-content">
		<h1 class="geist-header">hey, I'm Enkang</h1>
		<h2 class="geist-subheader">[about]</h2>
		<section>
			<p>
				i'm currently working with my friend <a
					href="https://www.abhaysrivatsa.com/"
					target="_blank"
					rel="noopener">abhay</a
				>
				to ship
				<a
					href="https://github.com/kamui-fin/readspace"
					target="_blank"
					rel="noopener">readspace</a
				>, a personal newsstand in your pocket—it automatically fetches
				articles and snippets from all your favorite blogs, newsletters,
				and social feeds so you stay informed without the noise. a
				chrome extension, mobile app, and hosted version are in the
				works, but it's available for self-hosting. contributions are
				welcome! i've worked briefly at
				<a
					href="https://www.gather-connect.com/"
					target="_blank"
					rel="noopener">gather</a
				>
				migrating their platform to react native and did some research for
				<a
					href="https://www.linkedin.com/company/aeromedlab/"
					target="_blank"
					rel="noopener">aeromed labs</a
				>. currently studying ce @ purdue.
			</p>
		</section>
		<h2 class="geist-subheader side">[sidequests]</h2>
		<section>
			<p>
				i enjoy hiking, hitting the gym, and learning Mandarin through
				immersion. i like to study advanced maths occasionally
				(currently studying <i>Putnam and Beyond</i>) but i'm not quite
				the amateur mathematician. outside of readspace, i contribute to
				some open source projects on occasion and cook up some small
				projects for the web.
			</p>
		</section>
		<h2 class="geist-subheader side">[contact]</h2>
		<section>
			<p>
				you can reach me at my
				<span class="icon orange-text">
					<Mail size={24} color="var(--orange)" />
				</span>
				<span class="orange-text">email</span>
				<a href="mailto:hey@enkyuan.me">hey@enkyuan.me</a>
				or via
				<span class="icon blue-text">
					<Twitter size={24} color="var(--diff-change)" class="" />
				</span>
				<span class="blue-text">twitter</span> dms at
				<a href="https://x.com/enkyuan">@enkyuan</a>.
			</p>
		</section>
	</div>
</div>

<style>
	.top-center-btn {
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		position: absolute;
		top: 2rem;
		left: 0;
		z-index: 20;
	}
	.geist-bg-full {
		min-height: 100vh;
		background: var(--bg);
		width: 100vw;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	.page-content {
		max-width: 60vw;
		margin: 8.5rem auto 0 auto;
		padding: 0 1.5rem;
	}
	.geist-header {
		font-family: "Geist", var(--font-body), sans-serif;
		font-weight: 700;
		font-size: 2.2rem;
		color: var(--green);
		text-align: left;
		margin-bottom: 2.5rem;
	}
	.geist-subheader {
		font-family: "Geist", var(--font-body), sans-serif;
		font-weight: 600;
		font-size: 1.8rem;
		color: var(--yellow);
		text-align: left;
		margin-top: 3.5rem;
		margin-bottom: 0.8rem;
	}
	section {
		margin-bottom: 3.5rem;
	}
	section p {
		font-size: 1.4rem;
		line-height: 1.6;
		margin: 0;
	}
	section p a {
		color: var(--blue-type);
		text-decoration: none;
		transition: color 0.2s ease;
	}
	section p a:hover {
		color: var(--pink);
		text-decoration: none;
	}
	.icon {
		display: inline-block;
		vertical-align: middle;
		margin: 0 0.01em;
	}
	.icon:first-child :global(svg) {
		transform: rotate(-20deg);
	}
	.orange-text {
		color: var(--orange);
	}
	.blue-text {
		color: var(--diff-change);
	}
</style>
