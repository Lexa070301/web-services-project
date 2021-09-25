import {makeAutoObservable} from "mobx";
import {usersAPI} from "../api/api";

type AgentsType = Array<{
    Name: string
    FullName: string
    Email: string
    Office: string
}> | null

class Agents {
    agents:AgentsType = null

    constructor() {
        makeAutoObservable(this)
    }

    loadAgents() {
        usersAPI.getAgents().then(response => this.agents = response)
    }
}


export default new Agents()