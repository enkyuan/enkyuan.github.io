<script lang="ts">
import Container from "../../lib/components/ui/container.svelte";
import Section from "../../lib/components/ui/section.svelte";
import Divider from "../../lib/components/ui/divider.svelte";
import Heading from "../../lib/components/ui/heading.svelte";
import Text from "../../lib/components/ui/text.svelte";
import List from "../../lib/components/ui/list.svelte";
import { projects } from "../../lib/constants/projects";
</script>

<Container>
	<Section title="Some of my recent work" mb="mb-0">
		{#each projects as project, i}
			<Divider show={i < projects.length - 1}>
				<Heading level={4} text={project.name} />
				<Text text={project.dates} size="xs" color="gray-600" mb="mb-2" />
				<Text text={project.description} size="xs" color="gray-700" mb="mb-3" />
				{#if project.achievements.length > 0}
					<List items={project.achievements} />
				{/if}
			</Divider>
		{/each}
	</Section>
</Container>
