<script lang="ts">
import Container from "../lib/components/ui/container.svelte";
import Header from "../lib/components/ui/header.svelte";
import Section from "../lib/components/ui/section.svelte";
import Divider from "../lib/components/ui/divider.svelte";
import Heading from "../lib/components/ui/heading.svelte";
import Text from "../lib/components/ui/text.svelte";
import List from "../lib/components/ui/list.svelte";
import Link from "../lib/components/ui/link.svelte";
import { experiences } from "../lib/constants/experiences";
import { socials } from "../lib/constants/socials";
</script>

<Container>
    <Header
        name="Enkang Yuan"
        title="Student"
        link_href="/crafts"
        link_text="See my work"
    />

    <Section title="Experience">
        {#each experiences as experience, i}
            <Divider show={i < experiences.length - 1}>
                <Heading level={4} text={experience.company} />
                <Text
                    text={experience.dates}
                    size="xs"
                    color="gray-600"
                    mb="mb-2"
                />
                <Text
                    text={experience.description}
                    size="xs"
                    color="gray-700"
                    mb="mb-3"
                />
                {#if experience.achievements.length > 0}
                    <List items={experience.achievements} />
                {/if}
            </Divider>
        {/each}
    </Section>

	<Section title="Connect" mb="mb-0">
		<div class="flex gap-5">
			{#each socials as link}
				<Link href={link.href} text={link.text} class="text-sm" />
			{/each}
		</div>
	</Section>
</Container>

<style>
    :global(body) {
        font-family: var(--font-body);
    }
</style>
