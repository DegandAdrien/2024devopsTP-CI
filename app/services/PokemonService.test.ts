import {describe, it, beforeEach, expect} from "vitest";
import {PokemonService} from "~/services/PokemonService";
import {PokeApiClient} from "~/services/PokeApiClient";

class MockPokeApiClient {
    getPokemonList() {
        return Promise.resolve([{id: 1, name: "test", sprite: "test", types: ["test"]}]);
    }
}

describe('PokemonService', () => {
    let pokemonService : PokemonService;
    let mockPokeApiClient: PokeApiClient;

    beforeEach(() => {
        mockPokeApiClient = new MockPokeApiClient() as PokeApiClient;
        pokemonService = new PokemonService(mockPokeApiClient);
    });

    it('should fetch Pokemon list', async () => {
        const list = await pokemonService.getPokemonList();
        expect(list).toEqual([{id: 1, name: "test", sprite: "test", types: ["test"]}]);
    });

    it('should return an empty team for a new user', () => {
        const userId = 'user1';
        const team = pokemonService.getUserTeam(userId);
        expect(team).toEqual([]);
    });

    it('should add a Pokemon to user team', () => {
        const userId = 'user1';
        const pokemon = { id: 1, name: 'Bulbasaur', sprite: "test", types: ["test"] };
        const result = pokemonService.togglePokemonInTeam(userId, pokemon);
        expect(result).toBe(true);

        const team = pokemonService.getUserTeam(userId);
        expect(team).toEqual([pokemon]);
    });

    it('should remove a Pokemon from user team', () => {
        const userId = 'user1';
        const pokemon = { id: 1, name: 'Bulbasaur', sprite: "test", types: ["test"] };
        pokemonService.togglePokemonInTeam(userId, pokemon); // Add first

        const result = pokemonService.togglePokemonInTeam(userId, pokemon); // Then remove
        expect(result).toBe(true);

        const team = pokemonService.getUserTeam(userId);
        expect(team).toEqual([]);
    });

    it('should not add more than 6 Pokemon to the team', () => {
        const userId = 'user1';
        for (let i = 1; i <= 6; i++) {
            const pokemon = { id: i, name: `Pokemon${i}`, sprite: "test", types: ["test"] };
            pokemonService.togglePokemonInTeam(userId, pokemon);
        }

        const newPokemon = { id: 7, name: 'Pokemon7',  sprite: "test", types: ["test"] };
        const result = pokemonService.togglePokemonInTeam(userId, newPokemon);
        expect(result).toBe(false);

        const team = pokemonService.getUserTeam(userId);
        expect(team.length).toBe(6);
    });

    it('should clear the user team', () => {
        const userId = 'user1';
        const pokemon = { id: 1, name: 'Bulbasaur',  sprite: "test", types: ["test"]};
        pokemonService.togglePokemonInTeam(userId, pokemon); // Add first

        pokemonService.clearTeam(userId);
        const team = pokemonService.getUserTeam(userId);
        expect(team).toEqual([]);
    });
});
