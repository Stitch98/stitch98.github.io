let Formats = [ {name: "[Gen 8] Shared Power",
		desc: `Once a Pok&eacute;mon switches in, its ability is shared with the rest of the team.`,
		threads: [
			`&bullet; <a href="https://www.smogon.com/forums/threads/pet-mods-submission-thread.3657184/post-8446318">Shared Power</a>`,
		],

		mod: 'gen8',
		ruleset: ['Standard', 'Dynamax Clause'],
		banlist: [
			'Darmanitan-Galar', 'Eternatus', 'Kyurem-Black', 'Kyurem-White', 'Lunala', 'Marshadow', 'Melmetal',
			'Mewtwo', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Reshiram', 'Shedinja', 'Solgaleo', 'Toxapex',
			'Zacian', 'Zamazenta', 'Zekrom'
        ]},
        onSwitchInPriority: 2,
        onSwitchIn(pokemon){
            if(pokemon.side.twist && pokemon.isTwisted != '0') pokemon.addVolatile('twist');
        }
     ];