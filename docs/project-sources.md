# Project premise sources

The portfolio uses the same structure for Kaji and Kaze: one premise sentence followed by three explanatory paragraphs. The copy describes the boundary each project controls, the mechanism it uses, and the responsibilities left to its host. It avoids claiming deployment, adoption, or guarantees beyond the published contracts.

## Kaji

Reviewed the [introduction](https://kaji.build/introduction/), [capability contract](https://kaji.build/docs/concepts/capability/), [idempotency behavior](https://kaji.build/docs/concepts/idempotency/), [outcome definitions](https://kaji.build/docs/concepts/outcomes/), [store requirements](https://kaji.build/docs/concepts/stores/), and [refund example](https://kaji.build/docs/reference/refund-example/).

The current TypeScript library runs inside the application. It orders validation, duplicate-request handling, authorization, optional approval, execution, and recording. Repeat protection depends on the supplied store and external provider; uncertain side effects remain unknown rather than being treated as safe to retry. The revised premise replaces the older ReAct/provider-runtime account with this narrower contract.

## Kaze

Reviewed the public [reference implementation README](https://github.com/hiyoriOS/kaze) and [draft protocol specification](https://github.com/hiyoriOS/kaze/blob/main/spec/kaze.md). The local checkout had an older README, so the public source determined the copy.

Kaze specifies signed platform Offers and key-bound mandates, uses Web Bot Auth to establish the operator, and reuses payment and receipt conventions. The Rust verifier is deterministic; time, trust material, replay state, quotas, and settlement remain the caller's responsibilities. Draft status is stated in the premise. The portfolio makes no claim that the protocol is an adopted standard or supplies legal recourse by itself.
