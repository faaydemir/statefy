import React from "react";
import { useState, useEffect } from "react";

/**
 * @template TState
 * @param {TState} state
 * @returns {Statefied<TState>}
 */
export default function statefy(state) {
    return new Statefied(state);
}



let componentIndex = 0;
/**
 * @param  {Statefied} statefy - statefied object
 * @param  {...string} usedProps - used properties 
 */
export function useStatefy(statefy, ...usedProps) {
    const componentUnique = componentIndex++
    const [state, setState] = useState(statefy.state())

    const attach = () => statefy.addSetter(componentUnique, createSetter(setState, usedProps));
    const detach = () => statefy.removeSetter(componentUnique)

    useEffect(() => attach(), []);
    useEffect(() => () => detach(), []);

    return state;
}


/**
 * decorate setter functions to prevent unnecessary calls by checking if used props are modified
 * @template {Function} TSetter
 * @param {TSetter} setter
 * @param {string[]} usedProps
 * @returns {TSetter}
 */
const createSetter = (setter, usedProps) => {
    const usedPropsSet = new Set(usedProps);
    const isAllPropsUsed = usedPropsSet.size === 0;

    function setState(newState, modifiedProps) {
        const isUsedPropsUpdated = isAllPropsUsed || intersectAny(modifiedProps, usedPropsSet)
        if (isUsedPropsUpdated) return setter(newState);
    }
    return setState;
}

/**
 * if any of item item of a is in b return true,
 * otherwise returns false
 * @param {string[]} a 
 * @param {Set<string>} b 
 * @returns 
 */
function intersectAny(a, b) {

    if (a == null || b == null) return false;
    for (let i = 0; i < a.length; ++i) {
        if (b.has(a[i])) return true;
    }
    return false;
}


/**
 * @template TState
 */
export class Statefied {
    /**
     * @param  {TState} state,
     */
    constructor(state) {
        this.store = new StateStore(state);
        this.setterMap = {};
        this.setters = []
    }

    mutate(args) {
        const newState = this.store.set(args);
        const modifiedProps = Object.keys(args);
        this.setters.forEach(s => s(newState, modifiedProps));
    }

    async mutateAsync(args) {
        const newState = this.store.set(args);
        const modifiedProps = Object.keys(args);
        const setterAwaiters = this.setters.map(s => new Promise(() => s(newState, modifiedProps)));
        await Promise.all(setterAwaiters);
    }

    /**
     * @returns {TState}
     */
    get() {
        return this.store.get();
    }

    addSetter(setterId, setter) {
        this.setterMap[setterId] = setter
        this.setters = Object.values(this.setterMap)
    }

    removeSetter(setterId) {
        delete this.setterMap[setterId];
        this.setters = Object.values(this.setterMap)
    }
}


/**
 * @template ST
 */
class StateStore {
    static storeIndex = 0
    static states = {}

    /**
     * @param  {ST} defaultState,
     */
    constructor({ ...defaultState }) {
        this.unique = StateStore.storeIndex++;
        StateStore.states[this.unique] = { ...defaultState }
    }

    /**
     * @returns {ST} current state
     */
    get() {
        const currentState = StateStore.states[this.unique];
        return { ...currentState };
    }

    /**
     * @returns {ST} modified state
     */
    set(state) {
        const currentState = StateStore.states[this.unique];
        StateStore.states[this.unique] = { ...currentState, ...state };
        return this.get();
    }
}