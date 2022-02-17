export type Suit = 'Hearts' | 'Spades' | 'Clubs' | 'Diamonds'
export type Value = 'A' | 'K'

export type Card = {
  suit: Suit,
  value: Value
}

export type SnapState = {
  pile: Set<Card>,
  hands: {
    player1: Set<Card>,
    player2: Set<Card>
  }
  nextPlayer: Player,
  winner?: Player
}

export type SnapPlay = SnapState & {
  placeCard: (player: Player) => SnapPlay,
  callSnap: (player: Player) => SnapPlay
}

type Player = 'player1' | 'player2'

export const startGame = (deck: Set<Card>, totalPlayers: number = 2): SnapPlay => {
  const [ player1Hand, player2Hand ] = dealCards(deck, totalPlayers)

  const initialState: SnapState = {
    pile: new Set<Card>(),
    hands: {
      player1: player1Hand,
      player2: player2Hand
    },
    nextPlayer: 'player1'
  }

  return buildNextPlay(initialState)
}

const getPlaceCard = (state: SnapState): (player: Player) => SnapPlay => (player: Player) => {
  const cardPlaced = () => {
    const otherPlayer = getOtherPlayer(player)

    const [card, ...hand] = Array.from(state.hands[player].values())

    const hands: any = {}
    hands[otherPlayer] = state.hands[otherPlayer]
    hands[player] = new Set(hand)

    return {
      pile: state.pile.add(card),
      hands,
      nextPlayer: hands[otherPlayer].size > 0 ? otherPlayer : player
    }
  }

  const nextState = state.nextPlayer !== player
    ? state 
    : cardPlaced()

  return buildNextPlay(nextState)
}

const getCallSnap = (state: SnapState): (player: Player) => SnapPlay => (player: Player) => {
  const snapCalled = () => {
    const otherPlayer = getOtherPlayer(player)

    state.pile.forEach(pc => state.hands[player].add(pc))

    const hands: any = {}
    hands[otherPlayer] = state.hands[otherPlayer]
    hands[player] = state.hands[player]

    const winner = state.hands[otherPlayer].size === 0 ? player : undefined

    return {
      pile: new Set<Card>(),
      hands,
      nextPlayer: player,
      winner
    }
  }

  const [first, second, ..._] = Array.from(state.pile.values()).reverse()

  const nextState = first && second && first.value === second.value
    ? snapCalled()
    : state

  return buildNextPlay(nextState)
}

const buildNextPlay = (state: SnapState) => ({
  ...state,
  placeCard: getPlaceCard(state),
  callSnap: getCallSnap(state),
})

const dealCards = (deck: Set<Card>, totalPlayers: number) => {
  const hands = new Array(totalPlayers)
    .fill(undefined)
    .map(_ => new Set<Card>())
  return Array.from(deck.values()).reduce((acc, next, i) => {
    acc[i % totalPlayers].add(next)
    return acc
  }, hands)
}

const getOtherPlayer = (player: string) => {
  return player === "player1" ? "player2" : "player1"
}

