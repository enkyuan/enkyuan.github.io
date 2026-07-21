<script lang="ts">
	import { about } from "$lib/constants/about";
</script>

<section class="about" aria-labelledby="about-title">
	<p class="map-note">{about.mapNote}</p>

	<div class="about-copy">
		<h2 id="about-title">{about.heading}</h2>
		<p>
			{about.rolePrefix}
			<span class="role-highlight">{about.role}</span>.
		</p>
		{#if about.contacts.email && about.contacts.x}
			<p class="contact-copy">
				{about.contactPrefix}
				<a href={about.contacts.email.href} aria-label="Email Enkang">email</a>
				<span aria-hidden="true">+</span>
				<a
					class="social-icon"
					href={about.contacts.x.href}
					target="_blank"
					rel="noreferrer"
					aria-label="Enkang on X"
				>
					<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
						<path
							d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
						/>
					</svg>
				</a>.
			</p>
		{/if}
	</div>
</section>

<style>
	.about {
		--brand-lavender-blush: oklch(0.892 0.063 355.343);
		--brand-orchid: oklch(0.818 0.114 355.343);
		--brand-magenta: oklch(0.617 0.253 355.343);
		--map-gradient-blue: rgb(23 59 132);
		--font-about-rounded: ".SF NS Rounded", "SF Pro Rounded", "Portfolio Rounded", sans-serif;

		padding-bottom: clamp(5rem, 11vh, 8rem);
	}

	.map-note,
	.about-copy {
		max-width: 31rem;
	}

	.map-note {
		margin: 0;
		color: rgba(23, 25, 29, 0.5);
		font-family: var(--font-about-rounded);
		font-size: 0.8125rem;
		letter-spacing: -0.01em;
		line-height: 1.55;
		text-wrap: pretty;
	}

	.about-copy {
		margin-top: clamp(2.75rem, 7vh, 4.25rem);
	}

	.about-copy h2,
	.about-copy p {
		margin: 0;
		font-family: var(--font-about-rounded);
		font-size: 1rem;
		font-weight: 400;
		letter-spacing: -0.012em;
		line-height: 1.55;
		text-wrap: pretty;
	}

	.about-copy h2 {
		font-size: 1.125rem;
		font-weight: 500;
		letter-spacing: -0.018em;
		line-height: 1.3;
		text-wrap: balance;
	}

	.about-copy h2 + p,
	.about-copy p + p {
		margin-top: 1rem;
	}

	.role-highlight {
		background-image: linear-gradient(
			90deg,
			var(--brand-magenta) 0%,
			var(--brand-orchid) 24%,
			var(--brand-lavender-blush) 40%,
			var(--brand-orchid) 56%,
			var(--brand-magenta) 76%,
			var(--brand-orchid) 100%
		);
		background-position: 0% 50%;
		background-size: 220% 100%;
		background-clip: text;
		color: var(--brand-orchid);
		font-weight: 500;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: role-gradient-drift 7s linear infinite alternate;
	}

	.contact-copy {
		color: rgba(23, 25, 29, 0.68);
	}

	.contact-copy a {
		color: #17191d;
		font-family: var(--font-about-rounded);
		font-size: 1em;
		font-weight: 500;
		letter-spacing: 0;
		line-height: 1;
		text-decoration: none;
		transition: color 150ms var(--ease-out);
		vertical-align: -0.02em;
	}

	.contact-copy .social-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1em;
		height: 1em;
		font-family: inherit;
		font-size: 1em;
		vertical-align: -0.08em;
	}

	.social-icon svg {
		display: block;
		width: 100%;
		height: 100%;
		fill: currentColor;
	}

	.contact-copy a:focus-visible {
		border-radius: 2px;
		outline: 2px solid var(--map-gradient-blue);
		outline-offset: 3px;
	}

	@media (hover: hover) and (pointer: fine) {
		.contact-copy a:hover {
			color: var(--map-gradient-blue);
		}
	}

	@keyframes role-gradient-drift {
		to {
			background-position: 100% 50%;
		}
	}

	@media (max-width: 560px) {
		.about-copy {
			margin-top: 2.5rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.role-highlight {
			background-position: 50% 50%;
			animation: none;
		}

		.contact-copy a {
			transition-duration: 0ms;
		}
	}
</style>
