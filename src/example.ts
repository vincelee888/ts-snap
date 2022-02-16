export type Card = {}

export type Snap = {
  pile: Set<Card>,
  hands: {
    player1: Set<Card>,
    player2: Set<Card>
  }
  nextPlayer: Player
}

export type OpenPlay = Snap & {
  placeCard: (player: Player) => OpenPlay
}

type Player = 'player1' | 'player2'

export const startGame = (deck: Set<Card>, totalPlayers: number = 2): OpenPlay => {
  const [ player1Hand, player2Hand ] = dealCards(deck, totalPlayers)

  const pile = new Set<Card>()

  const initialState: Snap = {
    pile,
    hands: {
      player1: player1Hand,
      player2: player2Hand
    },
    nextPlayer: 'player1'
  }
  return {
    ...initialState,
    placeCard: getPlaceCard(initialState)
  }
}

const getPlaceCard = (state: Snap): (player: Player) => OpenPlay => {
  return (player: Player) => {
    if(state.nextPlayer !== player) {
      return {
        ...state,
        placeCard: getPlaceCard(state)
      }
    }

    const otherPlayer = player === "player1" ? "player2" : "player1"

    const [card, ...hand] = Array.from(state.hands[player].values())

    const hands:any = {}
    hands[otherPlayer] = state.hands[otherPlayer]
    hands[player] = new Set(hand)

    const newState: Snap = {
      pile: state.pile.add(card),
      hands,
      nextPlayer: 'player2'
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

