export const BattleScripts: ModdedBattleScriptsData = {
    runSwitch(pokemon: Pokemon) {
		this.runEvent('Swap', pokemon);
		this.runEvent('SwitchIn', pokemon);
		if (this.gen <= 2 && !pokemon.side.faintedThisTurn && pokemon.draggedIn !== this.turn) {
			this.runEvent('AfterSwitchInSelf', pokemon);
		}
		if (!pokemon.hp) return false;
		pokemon.isStarted = true;
		if (!pokemon.fainted) {
            if(pokemon.isTwist != '0') pokemon.addVolatile('twist');
			this.singleEvent('Start', pokemon.getAbility(), pokemon.abilityData, pokemon);
			pokemon.abilityOrder = this.abilityOrder++;
			this.singleEvent('Start', pokemon.getItem(), pokemon.itemData, pokemon);
		}
		if (this.gen === 4) {
			for (const foeActive of pokemon.side.foe.active) {
				foeActive.removeVolatile('substitutebroken');
			}
		}
		pokemon.draggedIn = null;
		return true;
	},
    pokemon: {
        inherit: true,
        isTwist: '0' // This field indicates if the Pokémon has to twist left or right
    },
    side: {
        inherit: true,
        twist: false, // If this field is true, right after switchIn (inside the runSwitch function) the 'twist' volatile is added to the active Pokémon
        getChoice() {
            if (this.choice.actions.length > 1 && this.choice.actions.every(action => action.choice === 'team')) {
                return `team ` + this.choice.actions.map(action => action.pokemon!.position + 1).join(', ');
            }
            return this.choice.actions.map(action => {
                switch (action.choice) {
                case 'move':
                    let details = ``;
                    if (action.targetLoc && this.active.length > 1) details += ` ${action.targetLoc > 0 ? '+' : ''}${action.targetLoc}`;
                    // if (action.mega) details += (action.pokemon!.item === 'ultranecroziumz' ? ` ultra` : ` mega`);
                    if (action.zmove) details += ` zmove`;
                    if (action.maxMove) details += ` dynamax`;
                    return `move ${action.moveid}${details}`;
                case 'switch':
                    if (action.mega) details += ` mega`; // As you can see, now MegaEvo happens when you switch, not when you choose a move
                case 'instaswitch':
                    return `switch ${action.target!.position + 1}`;
                case 'team':
                    return `team ${action.pokemon!.position + 1}`;
                default:
                    return action.choice;
                }
            }).join(', ');
        },
        choosePass(): boolean | Side {
            const index = this.getChoiceIndex(true);
            if (index >= this.active.length) return false;
            const pokemon: Pokemon = this.active[index];
    
            switch (this.requestState) {
            case 'switch':
                if (pokemon.switchFlag) { // This condition will always happen if called by Battle#choose()
                    if (!this.choice.forcedPassesLeft) {
                        return this.emitChoiceError(`Can't pass: You need to switch in a Pokémon to replace ${pokemon.name}`);
                    }
                    this.choice.forcedPassesLeft--;
                }
                break;
            case 'move':
                // Checking if the Pokémon has to Twist, no need to 
                if(this.twist){
                    return this.emitChoiceError(`Can't pass: You chose to Twist, you have to switch.`);
                }
                if (!pokemon.fainted) {
                    return this.emitChoiceError(`Can't pass: Your ${pokemon.name} must make a move (or switch)`);
                }
                break;
            default:
                return this.emitChoiceError(`Can't pass: Not a move or switch request`);
            }
    
            // tslint:disable-next-line:no-object-literal-type-assertion
            this.choice.actions.push({
                choice: 'pass',
            } as ChosenAction);
            return true;
        }
    },
    // The value returned corresponds to wheter or not it is possible to execute Twisting
    // It seemed like it was used only inside the runMegaEvo() function, but I left it like this just in case it is called somewhere else.
    canMegaEvo(pokemon){
        return (pokemon.side.twist) ? false : 'Twist';
    },
    // This function overwrites the normal functioning of the Mega Evolution, so is run when you tick the megaevolution box
    // It activates the side.twist attribute that is the checked inside runTwist() function, that has to be put somehow inside the switchIn
    // But that doesn't seem accessible from this class, from this entire folder tbh; in fact, it is inside the 'sim' folder, under 'sim/battle.ts'
    // that file cannot be put inside the 'mods' folder, so I don't really know what to do
    runMegaEvo(pokemon) {
        if(pokemon.isTwist) return false;
        const side = pokemon.side;
        var i = 0;
        if (side.twist) return false;
        side.twist = true;
        for (const ally of side.pokemon) {
            if(i % 2 == 0){
                ally.isTwist = 'L';
            } else if(i % 2 == 1) {
                ally.isTwist = 'R';
            } i += 1;
        }
        pokemon.canMegaEvo = 'Twist'; // in the case it isn't the same value as the one returned by canMegaEvo() function
        return true;
    }
};