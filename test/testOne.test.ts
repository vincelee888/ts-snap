import { Card, SnapPlay, SnapState, startGame } from "../src/example"

describe('snap', () => {
    const deck: Set<Card> = new Set([
        { suit: 'Hearts', value: 'A' } as Card,
        { suit: 'Spades', value: 'A' } as Card,
        { suit: 'Hearts', value: 'K' } as Card,
        { suit: 'Spades', value: 'K' } as Card,
    ])

    let game: SnapPlay

    beforeEach(() => {
        game = startGame(deck, 2)
    })

    describe('starting the game', () => {
        it('should start with an empty pile', () => {
            expect(game.pile.size).toEqual(0)
        })

        it('should deal half the deck to each player', () => {
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
            const playedCard: Card = { suit: 'Hearts', value: 'A' }
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
            expect(result.hands.player1.size).toEqual(1)
            expect(result.hands.player2.size).toEqual(1)
        })

        it('player1 goes after player2', () => {
            const result = game
                    .placeCard('player1')
                    .placeCard('player2')
                    .placeCard('player1')

            expect(result.pile.size).toEqual(3)
            expect(result.hands.player1.size).toEqual(0)
            expect(result.hands.player2.size).toEqual(1)
        })
    })

    describe('calling snap', () => {
        it('snap on empty pile is invalid', () => {
            const result = game.callSnap('player2')

            expect(result.hands.player1.size).toEqual(2)
            expect(result.hands.player2.size).toEqual(2)
        })
        it('snap on single card in pile is invalid', () => {
            const result = game
                .placeCard('player1')
                .callSnap('player1')

            expect(result.pile.size).toEqual(1)
            expect(result.hands.player1.size).toEqual(1)
            expect(result.nextPlayer).toEqual('player2')
        })
        it('snap when last two cards have differet values is invalid', () => {
            const result = game
                .placeCard('player1')
                .placeCard('player2')
                .placeCard('player1')
                .callSnap('player1')

            expect(result.pile.size).toEqual(3)
            expect(result.hands.player1.size).toEqual(0)
            expect(result.nextPlayer).toEqual('player2')
        })
        it('player1 calls valid snap', () => {
            const result = game
                .placeCard('player1')
                .placeCard('player2')
                .callSnap('player1')

            expect(result.pile.size).toEqual(0)
            expect(result.hands.player1.size).toEqual(3)
            expect(result.nextPlayer).toEqual('player1')
            expect(result.winner).toBeUndefined()
        })
        it('player2 calls valid snap', () => {
            const result = game
                .placeCard('player1')
                .placeCard('player2')
                .callSnap('player2')

            expect(result.pile.size).toEqual(0)
            expect(result.hands.player2.size).toEqual(3)
            expect(result.nextPlayer).toEqual('player2')
        })
    })

    describe('end game', () => {
        it('player with all the cards keeps placing cards', () => {
            const result = game
                .placeCard('player1')
                .placeCard('player2')
                .callSnap('player1')
                .placeCard('player1')
                .placeCard('player2')
                .placeCard('player1')

            expect(result.hands.player2.size).toEqual(0)
            expect(result.hands.player1.size).toEqual(1)
            expect(result.nextPlayer).toEqual('player1')
        })
        it('last card to be played is a snap', () => {
            const result = game
                .placeCard('player1')
                .placeCard('player2')
                .callSnap('player1')
                .placeCard('player1')
                .placeCard('player2')
                .placeCard('player1')
                .placeCard('player1')
                .callSnap('player1')

            expect(result.pile.size).toEqual(0)
            expect(result.hands.player2.size).toEqual(0)
            expect(result.hands.player1.size).toEqual(4)
            expect(result.winner).toEqual('player1')
        })
    })
})
