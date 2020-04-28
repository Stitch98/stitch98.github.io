export const BattleStatuses: {[k: string]: ModdedPureEffectData} = {
    twist: {
        name: 'Twist',
		id: 'twist',
		num: 0,
        duration: 0,
        onStart(pokemon) {
            this.twisted = pokemon.isTwist;
            pokemon.types[0] = this.getTwistedType(pokemon.types[0], pokemon.isTwist);
            pokemon.types[1] = this.getTwistedType(pokemon.types[1], pokemon.isTwist);
            const side = pokemon.side;
            for (const ally of side.pokemon) {
                if(ally.volatile['twist']) ally.removeVolatile('twist');
            }
        },
        onModifyMove(move, pokemon) {
            if(pokemon.volatiles['twist'] && pokemon.type === move.type){
                move.type = this.getTwistedType(this.twisted, move.type);
                move.name = this.TwistedTypes[move.type].prefix + ' ' + move.name;
            }

        },
        onBeforeSwitchOutPriority: -1,
		onBeforeSwitchOut(pokemon) {
            pokemon.removeVolatile('twist');
            pokemon.isTwist = false;
        },
        onEnd(pokemon) {
            this.add('-end', pokemon, 'Twist');
            pokemon.types = pokemon.baseSpecies.types;
            pokemon.side.twist = false;
		},
        twisted: '0',
        getTwistedType(type, lr){
            return this.TwistedTypes[type][lr];
        }, 
        TwistedTypes: {
            Grass:      {L: 'Rock',     R: 'Electric',  prefix: 'Sprouting'},
            Fire:       {L: 'Grass',    R: 'Fighting',  prefix: 'Blazing'},
            Water:      {L: 'Fire',     R: 'Poison',    prefix: 'Soaking'},
            Electric:   {L: 'Flying',   R: 'Ice',       prefix: 'Sparkling'},
            Psychic:    {L: 'Dark',     R: 'Bug',       prefix: 'Mesmerizing'},
            Ice:        {L: 'Psychic',  R: 'Electric',  prefix: 'Freezing'},
            Dragon:     {L: 'Fairy',    R: 'Fire',      prefix: 'Roaring'},
            Dark:       {L: 'Ghost',    R: 'Fairy',     prefix: 'Obscuring'},
            Fairy:      {L: 'Water',    R: 'Ground',    prefix: 'Twinkling'},
            Normal:     {L: 'Poison',   R: 'Ghost',     prefix: 'Stomping'},
            Fighting:   {L: 'Steel',    R: 'Dark',      prefix: 'Blasting'},
            Flying:     {L: 'Rock',     R: 'Ground',    prefix: 'Swirling'},
            Poison:     {L: 'Bug',      R: 'Grass',     prefix: 'Polluting'},
            Ground:     {L: 'Fighting', R: 'Ice',       prefix: 'Desolating'},
            Rock:       {L: 'Dragon',   R: 'Steel',     prefix: 'Crumbling'},
            Bug:        {L: 'Water',    R: 'Psychic',   prefix: 'Infesting'},
            Ghost:      {L: 'Normal',   R: 'Flying',    prefix: 'Terrifying'},
            Steel:      {L: 'Dragon',   R: 'Normal',    prefix: 'Piercing'}
        }
    },
};