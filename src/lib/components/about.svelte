<script lang="ts">
	import { about } from "$lib/constants/about";
	import "$lib/styles/about.css";
</script>

<section class="about" aria-labelledby="about-title">
	<p class="map-note">{about.mapNote}</p>

	<div class="about-copy">
		<h2 id="about-title">{about.heading}</h2>
		<p>
			{about.rolePrefix}
			<span class="role-highlight">{about.role}</span>
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
				</a>
			</p>
		{/if}
	</div>
</section>
