<script lang="ts">
import Button from "../lib/components/ui/button.svelte";
import Tooltip from "../lib/components/ui/tooltip.svelte";
import ArrowRight from "../lib/components/icons/arrow-right.svelte";
import Mail from "../lib/components/icons/mail.svelte";
import Twitter from "../lib/components/icons/twitter.svelte";
import { pages, labels } from "$lib/constants";
import { sidebarState } from "$lib/stores/sidebar.svelte";

const current = 0;
const next = 1;
</script>

<div class="top-center-responsive-btn">
	<Button
		href={pages[next]}
		variant="primary"
		onmouseenter={() => sidebarState.setHovered(next)}
		onmouseleave={() => sidebarState.setHovered(null)}
	>
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
				i'm currently working with my friend <Tooltip
					variant="link-preview"
					placement="auto"
					delay={300}
					previewTitle="Abhay Srivatsa"
					previewDescription="Software engineer & designer building innovative products"
					previewUrl="abhaysrivatsa.com"
				>
					<a
						href="https://www.abhaysrivatsa.com/"
						target="_blank"
						rel="noopener">abhay</a
					>
				</Tooltip>
				to ship
				<Tooltip
					variant="link-preview"
					placement="auto"
					delay={300}
					previewTitle="readspace"
					previewDescription="A personal newsstand for blogs, newsletters & feeds. Stay informed without the noise."
					previewUrl="github.com/kamui-fin/readspace"
				>
					<a
						href="https://github.com/kamui-fin/readspace"
						target="_blank"
						rel="noopener">readspace</a
					>
				</Tooltip>, a personal newsstand in your pocket—it automatically fetches
				articles and snippets from all your favorite blogs, newsletters,
				and social feeds so you stay informed without the noise. a
				chrome extension, mobile app, and hosted version are in the
				works, but it's available for self-hosting. contributions are
				welcome! i've worked briefly at
				<Tooltip
					variant="link-preview"
					placement="auto"
					delay={300}
					previewTitle="Gather"
					previewDescription="Social connection platform bringing people together"
					previewUrl="gather-connect.com"
				>
					<a
						href="https://www.gather-connect.com/"
						target="_blank"
						rel="noopener">gather</a
					>
				</Tooltip>
				migrating their platform to react native and did some research for
				<Tooltip
					variant="link-preview"
					placement="auto"
					delay={300}
					previewTitle="AeroMed Labs"
					previewDescription="Medical research & innovation for aerospace applications"
					previewUrl="linkedin.com/company/aeromedlab"
				>
					<a
						href="https://www.linkedin.com/company/aeromedlab/"
						target="_blank"
						rel="noopener">aeromed labs</a
					>
				</Tooltip>. currently studying ce @ purdue.
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
				<Tooltip
					variant="link-preview"
					placement="auto"
					delay={300}
					previewTitle="Email Me"
					previewDescription="Send me an email - I usually respond within 24 hours"
					previewUrl="yuan.enkng@gmail.com"
				>
					<a href="mailto:yuan.enkng@gmail.com">yuan.enkng@gmail.com</a>
				</Tooltip>
				or via
				<span class="icon blue-text">
					<Twitter size={24} color="var(--diff-change)" class="" />
				</span>
				<span class="blue-text">twitter</span> dms at
				<Tooltip
					variant="link-preview"
					placement="auto"
					delay={300}
					previewTitle="@enkyuan on Twitter"
					previewDescription="Follow me for updates on my projects and tech thoughts"
					previewUrl="x.com/enkyuan"
				>
					<a href="https://x.com/enkyuan">@enkyuan</a>
				</Tooltip>.
			</p>
		</section>
	</div>
</div>

<style>
	.top-center-responsive-btn {
		display: none;
	}
	@media (min-width: 1024px) {
		.top-center-responsive-btn {
			position: absolute;
			top: 2rem;
			left: 50%;
			transform: translateX(-50%);
			z-index: 10;
			display: block;
		}
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

	@media (max-width: 1024px) {
		.page-content {
			max-width: 80vw;
			margin-top: 6rem;
		}
		.geist-header {
			font-size: 2rem;
		}
		.geist-subheader {
			font-size: 1.4rem;
			margin-top: 2.5rem;
		}
		section p {
			font-size: 1.2rem;
		}
	}

	@media (max-width: 768px) {
		.page-content {
			max-width: 90vw;
			margin-top: 4rem;
		}
		.geist-header {
			font-size: 1.6rem;
		}
		.geist-subheader {
			font-size: 1rem;
			margin-top: 2rem;
		}
		section p {
			font-size: 1rem;
		}
	}
</style>
