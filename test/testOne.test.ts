import { greeter } from '../src/example'

test('greeter uses the correct name', () => {
    expect(greeter('Rick and Morty')).toBe('Hello, Rick and Morty');
});