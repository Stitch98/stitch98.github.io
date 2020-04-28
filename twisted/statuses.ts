export const BattleStatuses: { [k: string]: ModdedPureEffectData } = {
    inherit: true,
    twist: {
        name: 'Twist',
        id: 'twist',
        num: 0,
        duration: 0,
        onStart(pokemon) {
            this.twisted = pokemon.isTwist;
            var twistName;
            switch (this.twisted) {
                case 'L':
                    twistName = 'Left Twist';
                    break;
                case 'R':
                    twistName = 'Right Twist';
                    break;
                case '0':
                default:
                    pokemon.removeVolatile('twist'); return;

            }
            this.add('-start', pokemon, twistName);
            var twistTypes = '';
            twistTypes += this.getTwistedType(pokemon.types[0]);
            if(pokemon.types.length > 1){
                twistTypes += '/' + this.getTwistedType(pokemon.types[1]);
            }
            if (pokemon.isTwist != '0') this.add('-formechange', pokemon, true);
            pokemon.setType(twistTypes);
            const side = pokemon.side;
            for (const ally of side.pokemon) {
                if (ally.isTwist != '0') ally.isTwist = '0';
            }
        },
        onBeforeMove(move, pokemon) {
            if (pokemon.volatiles['twist'] && pokemon.type === move.type) {
                move.name = this.TwistedTypes[move.type].prefix + ' ' + move.name;
            }

        },
        onModifyMove(move, pokemon) {
            if (pokemon.volatiles['twist'] && pokemon.type === move.type) {
                move.type = this.getTwistedType(this.twisted, move.type);
            }

        },
        onBeforeSwitchOutPriority: -1,
        onBeforeSwitchOut(pokemon) {
            pokemon.removeVolatile('twist');
            pokemon.isTwist = '0';
            pokemon.canMegaEvo = null;
        },
        onEnd(pokemon) {
            this.add('-end', pokemon, 'Twist');
            if (pokemon.isTwist != '0') this.add('-formechange', pokemon, pokemon.species.name);
            pokemon.setTypes(pokemon.baseSpecies.getTypes());
            pokemon.side.twist = false;
        },
        twisted: '0',
        getTwistedType(type, lr) {
            return this.TwistedTypes[type][lr];
        },
        TwistedTypes: {
            Grass: { L: 'Rock', R: 'Electric', prefix: 'Sprouting' },
            Fire: { L: 'Grass', R: 'Fighting', prefix: 'Blazing' },
            Water: { L: 'Fire', R: 'Poison', prefix: 'Soaking' },
            Electric: { L: 'Flying', R: 'Ice', prefix: 'Sparkling' },
            Psychic: { L: 'Dark', R: 'Bug', prefix: 'Mesmerizing' },
            Ice: { L: 'Psychic', R: 'Electric', prefix: 'Freezing' },
            Dragon: { L: 'Fairy', R: 'Fire', prefix: 'Roaring' },
            Dark: { L: 'Ghost', R: 'Fairy', prefix: 'Obscuring' },
            Fairy: { L: 'Water', R: 'Ground', prefix: 'Twinkling' },
            Normal: { L: 'Poison', R: 'Ghost', prefix: 'Stomping' },
            Fighting: { L: 'Steel', R: 'Dark', prefix: 'Blasting' },
            Flying: { L: 'Rock', R: 'Ground', prefix: 'Swirling' },
            Poison: { L: 'Bug', R: 'Grass', prefix: 'Polluting' },
            Ground: { L: 'Fighting', R: 'Ice', prefix: 'Desolating' },
            Rock: { L: 'Dragon', R: 'Steel', prefix: 'Crumbling' },
            Bug: { L: 'Water', R: 'Psychic', prefix: 'Infesting' },
            Ghost: { L: 'Normal', R: 'Flying', prefix: 'Terrifying' },
            Steel: { L: 'Dragon', R: 'Normal', prefix: 'Piercing' }
        }
    },
};