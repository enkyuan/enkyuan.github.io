// @ts-nocheck -- Browser API fixtures are supplied to Bun outside the app TypeScript config.
import { expect, test } from "bun:test";
import { get } from "svelte/store";
import { useLocation } from "../../../src/lib/hooks/use-location";
import { createWorldGrid } from "../../../src/lib/hooks/use-map";

// Value: protects=location state survives provider and animation failures and serializes retries;
// fails_when=coordinates disappear on geocoder failure or an optional animation reports GPS failure;
// why_new=source-string checks do not execute the state transitions; seam=none;
// no_claim=uses Svelte server lifecycle and browser API fixtures, not browser permission or rendering proof.
test("preserves usable coordinates through failures and serializes location retries", async () => {
  const descriptors = new Map(
    ["navigator", "document", "fetch"].map((name) => [
      name,
      Object.getOwnPropertyDescriptor(globalThis, name),
    ]),
  );
  const setGlobal = (name, value) =>
    Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });
  const cells = createWorldGrid();
  const position = { coords: { latitude: 48.8566, longitude: 2.3522, accuracy: 50 } };
  try {
    setGlobal("document", {});
    setGlobal("navigator", {});
    let hook = useLocation(
      cells,
      () => false,
      () => undefined,
    );
    await hook.locate();
    expect(get(hook.location)).toMatchObject({
      state: "error",
      failure: { kind: "unsupported", retryable: false },
    });

    for (const code of [1, 2, 3]) {
      setGlobal("navigator", {
        geolocation: {
          getCurrentPosition(_success, failure) {
            failure({ code });
          },
        },
      });
      hook = useLocation(
        cells,
        () => false,
        () => undefined,
      );
      await hook.locate();
      expect(get(hook.location)).toMatchObject({ state: "error", failure: { retryable: true } });
    }

    let releasePosition;
    let calls = 0;
    setGlobal("navigator", {
      geolocation: {
        getCurrentPosition(success) {
          calls++;
          releasePosition = success;
        },
      },
    });
    setGlobal("fetch", async () => {
      throw new TypeError("Offline");
    });
    hook = useLocation(
      cells,
      () => false,
      () => undefined,
    );
    const first = hook.locate();
    await hook.locate();
    expect(calls).toBe(1);
    expect(get(hook.location).state).toBe("locating");
    releasePosition(position);
    await first;
    expect(get(hook.location)).toMatchObject({
      state: "located",
      latitude: 48.8566,
      longitude: 2.3522,
      failure: { kind: "geocoding", retryable: true },
    });
    expect(get(hook.location).highlightedCells.length).toBeGreaterThan(0);

    setGlobal(
      "fetch",
      async () =>
        new Response(
          JSON.stringify({ address: { City: "Paris", CntryName: "France", CountryCode: "FR" } }),
        ),
    );
    const retry = hook.locate();
    expect(calls).toBe(2);
    releasePosition(position);
    await retry;
    expect(get(hook.location)).toMatchObject({
      state: "located",
      place: "Paris",
      countryCode: "FR",
      failure: undefined,
    });

    for (const [address, expected] of [
      [{ Region: "Île-de-France" }, { place: "Île-de-France", countryCode: "" }],
      [
        { CntryName: "Atlantis", CountryCode: "ZZZ" },
        { place: "Atlantis", countryCode: "" },
      ],
    ]) {
      setGlobal("fetch", async () => new Response(JSON.stringify({ address })));
      const refresh = hook.locate();
      releasePosition(position);
      await refresh;
      expect(get(hook.location)).toMatchObject({ state: "located", ...expected });
    }
    setGlobal(
      "fetch",
      async () =>
        new Response(
          JSON.stringify({ address: { City: "Paris", CntryName: "France", CountryCode: "FRA" } }),
        ),
    );

    setGlobal("navigator", {
      geolocation: {
        getCurrentPosition(success) {
          success(position);
        },
      },
    });
    for (const documentFixture of [
      {
        startViewTransition() {
          throw new DOMException("Unavailable", "InvalidStateError");
        },
      },
      {
        startViewTransition(update) {
          return { finished: Promise.resolve().then(update) };
        },
      },
      {},
    ]) {
      setGlobal("document", documentFixture);
      hook = useLocation(
        cells,
        () => true,
        () => undefined,
      );
      await hook.locate();
      expect(get(hook.location)).toMatchObject({
        state: "located",
        place: "Paris",
        countryCode: "FR",
        failure: undefined,
      });
    }
    for (const animate of [
      () => ({ finished: Promise.resolve() }),
      () => {
        throw new TypeError("Animation unavailable");
      },
    ]) {
      const pill = {
        getBoundingClientRect: () => ({ left: 0, top: 0, width: 200, height: 54 }),
        animate,
      };
      hook = useLocation(
        cells,
        () => true,
        () => pill,
      );
      await hook.locate();
      expect(get(hook.location)).toMatchObject({
        state: "located",
        place: "Paris",
        failure: undefined,
      });
    }
  } finally {
    for (const [name, descriptor] of descriptors) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  }
});

// Value: protects=an actionable retry starts a native request while an old badge animation is pending;
// fails_when=the request lock lasts until cosmetic animation completion; why_new=existing retries await the previous locate call;
// seam=none; no_claim=deferred WAAPI fixtures test orchestration, not native animation timing or permission UI.
test("starts an actionable retry before the previous error animation finishes", async () => {
  const descriptors = new Map(
    ["navigator", "document", "fetch"].map((name) => [
      name,
      Object.getOwnPropertyDescriptor(globalThis, name),
    ]),
  );
  const setGlobal = (name, value) =>
    Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });
  let releaseAnimation;
  let animationStarted;
  const pendingAnimation = new Promise((resolve) => {
    releaseAnimation = resolve;
  });
  const started = new Promise((resolve) => {
    animationStarted = resolve;
  });
  let animationCalls = 0;
  let nativeCalls = 0;
  let first;
  let second;
  const pill = {
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 200, height: 54 }),
    animate() {
      animationCalls++;
      animationStarted();
      return {
        finished: animationCalls === 1 ? pendingAnimation : Promise.resolve(),
        cancel: () => releaseAnimation(),
      };
    },
  };
  try {
    setGlobal("document", {});
    setGlobal("navigator", {
      geolocation: {
        getCurrentPosition(success, failure) {
          nativeCalls++;
          if (nativeCalls === 1) failure({ code: 1 });
          else success({ coords: { latitude: 48.8566, longitude: 2.3522, accuracy: 50 } });
        },
      },
    });
    setGlobal(
      "fetch",
      async () => new Response(JSON.stringify({ address: { City: "Paris", CountryCode: "FRA" } })),
    );
    const hook = useLocation(
      createWorldGrid(),
      () => true,
      () => pill,
    );
    first = hook.locate();
    await started;
    expect(get(hook.location)).toMatchObject({ state: "error", failure: { retryable: true } });
    second = hook.locate();
    expect(nativeCalls).toBe(2);
    releaseAnimation();
    await Promise.all([first, second]);
    expect(get(hook.location)).toMatchObject({
      state: "located",
      place: "Paris",
      countryCode: "FR",
    });
  } finally {
    releaseAnimation();
    await Promise.allSettled([first, second]);
    for (const [name, descriptor] of descriptors) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  }
});
