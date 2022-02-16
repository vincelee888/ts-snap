import { OpenPlay, Snap, startGame } from "../src/example"

describe('snap', () => {
    const deck = new Set([
        { suit : 'Hearts', value: 'A' },
        { suit : 'Spades', value: 'A' },
    ])

    let game: OpenPlay

    beforeEach(() => {
        game = startGame(deck, 2)
    })

    describe('starting the game', () => {
        it('should start with an empty pile', () => {
            expect(game.pile.size).toEqual(0)
        })

        it('should deal the half the deck to each player', () => {
            const { player1, player2} = game.hands

            expect(player1.size).toEqual(deck.size / 2)
            expect(player1.size).toEqual(player2.size)
            expect(player1).not.toEqual(player2)
        })
    })

    describe('placing cards', () => {
        it('should move that card onto the pile', () => {
            const result = game.placeCard('player1')

            expect(result.pile.size).toEqual(1)
            const playedCard = { suit: 'Hearts', value: 'A' }
            expect(result.pile.values().next().value).toEqual(playedCard)
            expect(result.hands.player1.has(playedCard)).toBeFalsy()
        })
        it('player1 must go first', () => {
            const result = game.placeCard('player2')

            expect(result.pile.size).toEqual(0)
        })

        it('player2 goes after player1', () => {
            const result = game
                .placeCard('player1')
                .placeCard('player2')

            expect(result.pile.size).toEqual(2)
            expect(result.hands.player1.size).toEqual(0)
            expect(result.hands.player2.size).toEqual(0)
        })
    })
})
