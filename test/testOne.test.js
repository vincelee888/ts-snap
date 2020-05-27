import { greeter } from '../src/example'

test('adds 1 + 2 to equal 3', () => {
    expect(greeter('Rick and Morty')).toBe('Hello, Rick and Morty');
});