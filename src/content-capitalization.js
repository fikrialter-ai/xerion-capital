// The revised copy is canonical. Keep this adapter for existing consumers;
// legacy substitutions must never overwrite the user's new wording.
export const capitalizationEdits = [];

export function applyCapitalization(source) {
  return structuredClone(source);
}
