export type Suit = 'Hearts' | 'Spades' | 'Clubs' | 'Diamonds'
export type Value = 'A' | 'K'

export type Card = {
  suit: Suit,
  value: Value
}

export type Snap = {
  pile: Set<Card>,
  hands: {
    player1: Set<Card>,
    player2: Set<Card>
  }
  nextPlayer: Player,
  winner?: Player
}

export type OpenPlay = Snap & {
  placeCard: (player: Player) => OpenPlay,
  callSnap: (player: Player) => OpenPlay
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
  return buildNextPlay(initialState)
}

const getPlaceCard = (state: Snap): (player: Player) => OpenPlay => {
  return (player: Player) => {
    if(state.nextPlayer !== player) {
      return buildNextPlay(state)
    }

    const otherPlayer = getOtherPlayer(player)

    const [card, ...hand] = Array.from(state.hands[player].values())

    const hands:any = {}
    hands[otherPlayer] = state.hands[otherPlayer]
    hands[player] = new Set(hand)

    const newState: Snap = {
      pile: state.pile.add(card),
      hands,
      nextPlayer: hands[otherPlayer].size > 0 ? otherPlayer : player
    }

    return buildNextPlay(newState)
  }
}

const getCallSnap = (state: Snap): (player: Player) => OpenPlay => {
  return (player: Player) => {
    const [first, second, ..._] = Array.from(state.pile.values()).reverse()

    if(first && second && first.value === second.value) {
      const otherPlayer = getOtherPlayer(player)

      state.pile.forEach(pc => state.hands[player].add(pc))
      
      const hands:any = {}
      hands[otherPlayer] = state.hands[otherPlayer]
      hands[player] = state.hands[player]

      const winner = state.hands[otherPlayer].size === 0 ? player : undefined

      const newState: Snap = {
        pile: new Set<Card>(),
        hands,
        nextPlayer: player,
        winner
      }

      return buildNextPlay(newState)
    }

    return buildNextPlay(state)
  }
}

const buildNextPlay = (state: Snap) => ({
  ...state,
  placeCard: getPlaceCard(state),
  callSnap: getCallSnap(state),
})

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

const getOtherPlayer = (player: string) => {
  return player === "player1" ? "player2" : "player1"
}

