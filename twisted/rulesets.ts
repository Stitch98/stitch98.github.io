export const BattleFormats: {[k: string]: ModdedFormatsData} = {
    twistedpokemon: {
        effectType: 'ValidatorRule',
		name: 'Twisted Pokemon',
		desc: "The ruleset for Twisted Pokemon",
		ruleset: ['Obtainable', 'Team Preview', 'Species Clause', 'Nickname Clause', 'Item Clause', 'Cancel Mod'],
		banlist: ['Battle Bond',
        'Mewtwo', 'Mew',
        'Lugia', 'Ho-Oh', 'Celebi',
        'Kyogre', 'Groudon', 'Rayquaza', 'Jirachi', 'Deoxys',
        'Dialga', 'Palkia', 'Giratina', 'Phione', 'Manaphy', 'Darkrai', 'Shaymin', 'Arceus',
        'Victini', 'Reshiram', 'Zekrom', 'Kyurem', 'Keldeo', 'Meloetta', 'Genesect',
        'Xerneas', 'Yveltal', 'Zygarde', 'Diancie', 'Hoopa', 'Volcanion',
        'Cosmog', 'Cosmoem', 'Solgaleo', 'Lunala', 'Necrozma', 'Magearna', 'Marshadow', 'Zeraora',
        'Meltan', 'Melmetal', 'Zacian', 'Zamazenta', 'Eternatus',
        ],
        onSwitchIn(pokemon){
            if(pokemon.side.twist && pokemon.isTwisted != '0') pokemon.addVolatile('twist');
        }
    }
}