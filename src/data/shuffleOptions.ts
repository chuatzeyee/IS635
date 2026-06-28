interface OptionQuestion {
  readonly options: readonly string[]
  readonly correctIndex: number
}

function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// Returns a new question with its options shuffled and correctIndex remapped.
// Call inside a useMemo so it shuffles once per mount (i.e. once per page load).
export function withShuffledOptions<T extends OptionQuestion>(q: T): T {
  const correctText = q.options[q.correctIndex]
  const options = shuffle(q.options)
  return { ...q, options, correctIndex: options.indexOf(correctText) }
}

export function shuffleAllOptions<T extends OptionQuestion>(qs: readonly T[]): T[] {
  return qs.map(withShuffledOptions)
}
