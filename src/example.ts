export type Card = {}

type Snap = {
  pile: Set<Card>,
  player1Hand: Set<Card>,
  player2Hand: Set<Card>,
}

type OpenPlay = Snap & {
  placeCard: (player: Player) => Snap
}

type Player = 'player1' | 'player2'

export const startGame = (deck: Set<Card>, totalPlayers: number = 2): OpenPlay => {
  const [ player1Hand, player2Hand ] = dealCards(deck, totalPlayers)

  const pile = new Set<Card>()

  const initialState = {
    pile,
    player1Hand,
    player2Hand,
  }
  return {
    ...initialState,
    placeCard: getPlaceCard(initialState)
  }
}

const getPlaceCard = (state: Snap): (player: Player) => OpenPlay => {
  return (player: Player) => {
    const [card, ...hand] = Array.from(state.player1Hand.values())
    const newState = {
      pile: state.pile.add(card),
      player1Hand: new Set(hand),
      player2Hand: state.player2Hand
    }

    return {
      ...newState,
      placeCard: getPlaceCard(newState)
    }
  }
}

const dealCards = (deck: Set<Card>, totalPlayers: number) => {
  const hands = new Array(totalPlayers)
    .fill(undefined)
    .map(_ => new Set<Card>())
  Array.from(deck.values()).forEach((c, i) => {
    const handIndex = i % totalPlayers
    hands[handIndex].add(c)
  })
  return hands
}

