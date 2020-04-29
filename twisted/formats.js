let Formats = [ {
        name: "[Gen 8] Twisted Pokemon",
		desc: `You can Twist the Pokemon switching in, changing its type between two predetermined typings.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/pet-mods-submission-thread.3657184/post-8446318">Twisted Pokemon</a>`,
		],


		mod: 'gen8',
		forcedLevel: 50,
		teamLength: {
			validate: [3, 6],
			battle: 3,
		},
		ruleset: ['Standard GBU', 'Dynamax Clause'],
		banlist: ['Moody', 'Power Construct'],		
		minSourceGen: 8,
        onSwitchInPriority: 2,
        onSwitchIn(pokemon){
			if(!pokemon.side.twist && pokemon.isTwisted == '0') pokemon.canMegaEvo = true;
        }}
     ];