import assert from "assert";

export function shuffle<T extends { id: string } = { id: string }>(
    deck: T[],
    cycles = 25,
    originalDeck: T[] | null = null,
) {
    originalDeck = originalDeck ?? deck;

    if (!cycles) {
        try {
            assert.notDeepEqual(originalDeck, deck);
            return deck;
        } catch {
            return shuffle(deck, 25, originalDeck);
        }
    }

    const arr = deck.slice();

    // Get random indexes up to the last index - 1
    const randomIdx = () => Math.floor(Math.random() * Math.max(arr.length - 1, 0));

    for (let i = 0; i < arr.length; ++i) {
        const eIdx = arr.length - 1;
        const rIdx = randomIdx();
        const end = arr[eIdx];
        const rand = arr[rIdx];

        // If the deck has multiple instances of the same question, make sure
        // they aren't placed next to each other.
        const randRight = arr[rIdx + 1];
        const randLeft = arr[rIdx - 1];
        const endLeft = arr[eIdx - 1];

        if (rIdx === eIdx - 1) {
            if (end.id === randLeft?.id) continue;
        } else {
            if (end.id === randLeft?.id || end.id === randRight?.id) continue;
            if (endLeft?.id) {
                if (rand.id === endLeft.id) continue;
            }
        }

        arr[eIdx] = rand;
        arr[rIdx] = end;
    }

    return shuffle(arr, --cycles, originalDeck);
}
