import type { Character } from "./characters";
import { characters, getCharacterChatTheme } from "./characters";

export interface CharacterChatLine {
  fromId: string;
  text: string;
  time: string;
}

const chats: Record<string, CharacterChatLine[]> = {
  rose: [
    { fromId: "daisy", text: "i picked our table. you're not eating lunch alone?", time: "11:02" },
    { fromId: "rose", text: "…okay. one day i'll believe you mean it.", time: "11:03" },
    { fromId: "lemon", text: "she means it. i'll swing by after sixth—save me a seat?", time: "11:04" },
    { fromId: "rose", text: "both of you vs the whole hall is a lot of ally for one scentless girl", time: "11:05" },
    { fromId: "daisy", text: "that's the point 💛", time: "11:05" },
  ],
  lemon: [
    { fromId: "rose", text: "everyone keeps saying we don't fit the story", time: "8:14" },
    { fromId: "lemon", text: "then we write a worse story for them and live the real one", time: "8:15" },
    { fromId: "daisy", text: "screenshots saved for my moral support folder", time: "8:16" },
    { fromId: "lemon", text: "daisy you're insufferable", time: "8:16" },
    { fromId: "daisy", text: "LY 🌼", time: "8:17" },
  ],
  daisy: [
    { fromId: "daisy", text: "if i say it out loud in the gc it counts as brave right", time: "6:42" },
    { fromId: "rose", text: "say it", time: "6:43" },
    { fromId: "daisy", text: "i'm not performing the lie anymore. even if it costs the table.", time: "6:44" },
    { fromId: "lemon", text: "then we eat standing up. still a table.", time: "6:45" },
  ],
  narcissa: [
    { fromId: "goldenrod", text: "bells matter. polish matters. gaps get filled.", time: "7:51" },
    { fromId: "narcissa", text: "trust. i don't do 'off-days.'", time: "7:52" },
    { fromId: "iris", text: "narrative is clean on your side. keep the smile consistent", time: "7:53" },
    { fromId: "narcissa", text: "consistent is my whole brand bestie 💅", time: "7:54" },
  ],
  nettles: [
    { fromId: "nettles", text: "hall's yours til 3—noise?", time: "2:11" },
    { fromId: "goldenrod", text: "none i can't route around", time: "2:11" },
    { fromId: "iris", text: "if whispers start, send them to me. i'll trim", time: "2:12" },
    { fromId: "nettles", text: "copy", time: "2:12" },
  ],
  goldenrod: [
    { fromId: "goldenrod", text: "order holds or we scatter. pick your lane today.", time: "9:30" },
    { fromId: "iris", text: "lanes are already painted. i'll handle the story", time: "9:31" },
    { fromId: "narcissa", text: "stage is set. lights love me", time: "9:31" },
    { fromId: "nettles", text: "say when. i clear the way", time: "9:32" },
  ],
  iris: [
    { fromId: "iris", text: "new girl is inconvenient", time: "10:04" },
    { fromId: "goldenrod", text: "inconvenient is still manageable", time: "10:05" },
    { fromId: "narcissa", text: "don't make me a footnote in her montage", time: "10:06" },
    { fromId: "iris", text: "you're headline. she's a glitch—i'll edit around it", time: "10:07" },
  ],
};

export function getCharacterChatLines(profileId: string): CharacterChatLine[] {
  return chats[profileId] ?? [];
}

/** Profile character plus their allies, for header + avatars. */
export function getAllyThreadParticipants(profileCharacter: Character): Character[] {
  const byId = new Map(characters.map((c) => [c.id, c]));
  const list: Character[] = [profileCharacter];
  for (const id of profileCharacter.allyIds) {
    const ally = byId.get(id);
    if (ally) list.push(ally);
  }
  return list;
}

/** Serialized shape for `CharacterAllyThread` (standalone / future use). */
export function buildAllyThreadForProfile(character: Character) {
  return {
    viewerId: character.id,
    theme: getCharacterChatTheme(character.id),
    lines: getCharacterChatLines(character.id),
    participants: getAllyThreadParticipants(character).map((c) => ({
      id: c.id,
      name: c.name,
      image: c.image,
    })),
  };
}
