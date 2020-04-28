export const BattleScripts: ModdedBattleScriptsData = {
    battle: {
        inherit: true,
        runAction(action: Action) {
            const pokemonOriginalHP = action.pokemon?.hp;
            // returns whether or not we ended in a callback
            switch (action.choice) {
            case 'start': {
                // I GIVE UP, WILL WRESTLE WITH EVENT SYSTEM LATER
                const format = this.format;
    
                // Remove Pokémon duplicates remaining after `team` decisions.
                for (const side of this.sides) {
                    side.pokemon = side.pokemon.slice(0, side.pokemonLeft);
                }
    
                if (format.teamLength && format.teamLength.battle) {
                    // Trim the team: not all of the Pokémon brought to Preview will battle.
                    for (const side of this.sides) {
                        side.pokemon = side.pokemon.slice(0, format.teamLength.battle);
                        side.pokemonLeft = side.pokemon.length;
                    }
                }
    
                this.add('start');
                for (const side of this.sides) {
                    for (let pos = 0; pos < side.active.length; pos++) {
                        this.switchIn(side.pokemon[pos], pos);
                    }
                }
                for (const pokemon of this.getAllPokemon()) {
                    this.singleEvent('Start', this.dex.getEffectByID(pokemon.speciesid), pokemon.speciesData, pokemon);
                }
                this.midTurn = true;
                break;
            }
    
            case 'move':
                if (!action.pokemon.isActive) return false;
                if (action.pokemon.fainted) return false;
                this.runMove(action.move, action.pokemon, action.targetLoc, action.sourceEffect,
                    action.zmove, undefined, action.maxMove, action.originalTarget);
                break;
            case 'runDynamax':
                action.pokemon.addVolatile('dynamax');
                for (const pokemon of action.pokemon.side.pokemon) {
                    pokemon.canDynamax = false;
                }
                break;
            case 'beforeTurnMove': {
                if (!action.pokemon.isActive) return false;
                if (action.pokemon.fainted) return false;
                this.debug('before turn callback: ' + action.move.id);
                const target = this.getTarget(action.pokemon, action.move, action.targetLoc);
                if (!target) return false;
                if (!action.move.beforeTurnCallback) throw new Error(`beforeTurnMove has no beforeTurnCallback`);
                action.move.beforeTurnCallback.call(this, action.pokemon, target);
                break;
            }
    
            case 'event':
                // @ts-ignore - easier than defining a custom event attribute TBH
                this.runEvent(action.event, action.pokemon);
                break;
            case 'team': {
                action.pokemon.side.pokemon.splice(action.index, 0, action.pokemon);
                action.pokemon.position = action.index;
                // we return here because the update event would crash since there are no active pokemon yet
                return;
            }
    
            case 'pass':
                return;
            case 'megaEvo':
                this.runMegaEvo(action.pokemon); // HERE IS WHAT CHANGES: the megaevolution choise is evaluated together with switching
            case 'instaswitch':
            case 'switch':
                if (action.choice === 'switch' && action.pokemon.status && this.dex.data.Abilities.naturalcure) {
                    this.singleEvent('CheckShow', this.dex.getAbility('naturalcure'), null, action.pokemon);
                }
                if (this.switchIn(action.target, action.pokemon.position, action.sourceEffect) === 'pursuitfaint') {
                    // a pokemon fainted from Pursuit before it could switch
                    if (this.gen <= 4) {
                        // in gen 2-4, the switch still happens
                        this.hint("Previously chosen switches continue in Gen 2-4 after a Pursuit target faints.");
                        action.priority = -101;
                        this.queue.unshift(action);
                        break;
                    } else {
                        // in gen 5+, the switch is cancelled
                        this.hint("A Pokemon can't switch between when it runs out of HP and when it faints");
                        break;
                    }
                }
                break;
            case 'runUnnerve':
                this.singleEvent('PreStart', action.pokemon.getAbility(), action.pokemon.abilityData, action.pokemon);
                break;
            case 'runSwitch':
                this.runSwitch(action.pokemon);
                break;
            case 'runPrimal':
                if (!action.pokemon.transformed) {
                    this.singleEvent('Primal', action.pokemon.getItem(), action.pokemon.itemData, action.pokemon);
                }
                break;
            case 'shift': {
                if (!action.pokemon.isActive) return false;
                if (action.pokemon.fainted) return false;
                this.swapPosition(action.pokemon, 1);
                break;
            }
    
            case 'beforeTurn':
                this.eachEvent('BeforeTurn');
                break;
            case 'residual':
                this.add('');
                this.clearActiveMove(true);
                this.updateSpeed();
                const residualPokemon = this.getAllActive().map(pokemon => [pokemon, pokemon.hp] as const);
                this.residualEvent('Residual');
                for (const [pokemon, originalHP] of residualPokemon) {
                    if (pokemon.hp && pokemon.hp <= pokemon.maxhp / 2 && originalHP > pokemon.maxhp / 2) {
                        this.runEvent('EmergencyExit', pokemon);
                    }
                }
                this.add('upkeep');
                break;
            }
    
            // phazing (Roar, etc)
            for (const side of this.sides) {
                for (const pokemon of side.active) {
                    if (pokemon.forceSwitchFlag) {
                        if (pokemon.hp) this.dragIn(pokemon.side, pokemon.position);
                        pokemon.forceSwitchFlag = false;
                    }
                }
            }
    
            this.clearActiveMove();
    
            // fainting
    
            this.faintMessages();
            if (this.ended) return true;
    
            // switching (fainted pokemon, U-turn, Baton Pass, etc)
    
            if (!this.queue.length || (this.gen <= 3 && ['move', 'residual'].includes(this.queue[0].choice))) {
                // in gen 3 or earlier, switching in fainted pokemon is done after
                // every move, rather than only at the end of the turn.
                this.checkFainted();
            } else if (action.choice === 'megaEvo' && this.gen === 7) {
                this.eachEvent('Update');
                // In Gen 7, the action order is recalculated for a Pokémon that mega evolves.
                for (const [i, queuedAction] of this.queue.entries()) {
                    if (queuedAction.pokemon === action.pokemon && queuedAction.choice === 'move') {
                        this.queue.splice(i, 1);
                        queuedAction.mega = 'done';
                        this.queue.insertChoice(queuedAction, true);
                        break;
                    }
                }
                return false;
            } else if (this.queue.length && this.queue[0].choice === 'instaswitch') {
                return false;
            }
    
            if (this.gen >= 5) {
                this.eachEvent('Update');
            }
    
            if (action.choice === 'runSwitch') {
                const pokemon = action.pokemon;
                if (pokemon.hp && pokemon.hp <= pokemon.maxhp / 2 && pokemonOriginalHP! > pokemon.maxhp / 2) {
                    this.runEvent('EmergencyExit', pokemon);
                }
            }
    
            const switches = this.sides.map(
                side => side.active.some(pokemon => pokemon && !!pokemon.switchFlag)
            );
    
            for (let i = 0; i < this.sides.length; i++) {
                if (switches[i] && !this.canSwitch(this.sides[i])) {
                    for (const pokemon of this.sides[i].active) {
                        pokemon.switchFlag = false;
                    }
                    switches[i] = false;
                }
            }
    
            for (const playerSwitch of switches) {
                if (playerSwitch) {
                    this.makeRequest('switch');
                    return true;
                }
            }
    
            if (this.gen < 5) this.eachEvent('Update');
    
            if (this.gen >= 8 && this.queue.length && this.queue[0].choice === 'move') {
                // In gen 8, speed is updated dynamically so update the queue's speed properties and sort it.
                this.updateSpeed();
                for (const queueAction of this.queue) {
                    if (queueAction.pokemon) this.getActionSpeed(queueAction);
                }
                this.queue.sort();
            }
    
            return false;
        }
    },
    pokemon: {
        inherit: true,
        isTwist: '0'
    },
    side: {
        inherit: true,
        twist: '0',
        getChoice() {
            if (this.choice.actions.length > 1 && this.choice.actions.every(action => action.choice === 'team')) {
                return `team ` + this.choice.actions.map(action => action.pokemon!.position + 1).join(', ');
            }
            return this.choice.actions.map(action => {
                switch (action.choice) {
                case 'move':
                    let details = ``;
                    if (action.targetLoc && this.active.length > 1) details += ` ${action.targetLoc > 0 ? '+' : ''}${action.targetLoc}`;
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
        var twistForms = {
            ltwist: null,
            rtwist: null
        }
        var i = 0;
        for (const ally of side.pokemon) {
            if(i % 2 == 0){
                this.twistForms.ltwist = ally.baseSpecies;
            } else if(i % 2 == 1) {
                this.twistForms.rtwist = ally.baseSpecies;
            } i += 1;
            if (side.twist != '0'){
                this.twistForms = null; 
                return false;
            }
            // It checks to which name the pokemon's name corresponds between the one that was on the left and the one on the right,
            // whose names where saved inside the twistForms field by the runMega function.
            if(this.twistForms.ltwist && ally.baseSpecies === this.twistForms.ltwist) ally.isTwist = 'L';
            else if(this.twistForms.rtwist && ally.baseSpecies === this.twistForms.rtwist) ally.isTwist = 'R';
            ally.addVolatile('twist');
        }
        pokemon.canMegaEvo = 'Twist'; // in the case it isn't the same value as the one returned by canMegaEvo() function
        return true;
    }
};