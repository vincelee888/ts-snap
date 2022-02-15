import { startGame } from "../src/example"

describe('snap', () => {
    const deck = new Set([
        { suit : 'Hearts', value: 'A' },
        { suit : 'Spades', value: 'A' },
    ])
    const game = startGame(deck, 2)

    describe('starting the game', () => {
        const { player1Hand, player2Hand} = game

        it('should start with an empty pile', () => {
            expect(game.pile.size).toEqual(0)
        })

        it('should deal the half the deck to each player', () => {
            expect(player1Hand.size).toEqual(deck.size / 2)
            expect(player1Hand.size).toEqual(player2Hand.size)
            expect(player1Hand).not.toEqual(player2Hand)
        })
    })

    describe('placing cards', () => {
        it('should move that card onto the pile', () => {
            const result = game.placeCard('player1')

            expect(result.pile.size).toEqual(1)
            const playedCard = { suit: 'Hearts', value: 'A' }
            expect(result.pile.values().next().value).toEqual(playedCard)
            expect(result.player1Hand.has(playedCard)).toBeFalsy()
        })
    })
})
