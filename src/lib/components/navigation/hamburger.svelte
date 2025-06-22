<script lang="ts">
import { navigationLinks } from "$lib/stores/navigation";
import MenuIcon from "../icons/menu.svelte";
import { fly } from "svelte/transition";
import { quintInOut } from "svelte/easing";

let isOpen = $state(false);

function toggle() {
	isOpen = !isOpen;
}
</script>

<div class="hamburger-container">
	<button class="fab" onclick={toggle} aria-label="Open menu">
		<MenuIcon color="var(--white)" />
	</button>

	{#if isOpen}
		<div
			class="menu-overlay"
			role="button"
			tabindex="0"
			onclick={toggle}
			onkeydown={(e) => {
				if (e.key === "Enter" || e.key === " ") toggle();
			}}
		>
			<nav
				aria-hidden={!isOpen}
				onclick={(e) => e.stopPropagation()}
				transition:fly={{
					x: "-100%",
					duration: 500,
					easing: quintInOut,
				}}
			>
				<ul class="main-links">
					{#each navigationLinks as link}
						<li>
							<a
								href={link.href}
								target={link.external ? "_blank" : undefined}
								rel={link.external
									? "noopener noreferrer"
									: undefined}
							>
								<link.component />
								<span>{link.label}</span>
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		</div>
	{/if}
</div>

<style>
	.hamburger-container {
		position: relative;
		z-index: 20;
	}
	.fab {
		position: fixed;
		bottom: 1.5rem;
		left: 1.5rem;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: var(--dark);
		border: 1.5px solid var(--gray1);
		display: grid;
		place-items: center;
		cursor: pointer;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		transition: transform 0.2s;
		z-index: 20;
	}
	.fab:hover {
		transform: scale(1.05);
	}
	.menu-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
	}
	nav {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 75%;
		max-width: 320px;
		background: var(--dark);
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		padding: 3rem 2rem;
		box-shadow: 4px 0 16px rgba(0, 0, 0, 0.2);
	}
	.main-links {
		list-style: none;
		padding: 0;
		margin: 0 0 5rem 0;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	.main-links a {
		display: flex;
		align-items: end;
		gap: 1rem;
		font-size: 1.1rem;
		font-weight: 500;
		color: var(--fg);
		text-decoration: none;
		padding: 0.5rem;
		border-radius: 8px;
		transition: background 0.2s;
	}
	.main-links a:hover {
		background: var(--visual-select-bg);
	}
</style>
