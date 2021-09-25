import {makeAutoObservable} from "mobx";
import {usersAPI} from "../api/api";

type OrganisationsType = Array<{
    id: number
    Title: string
}> | null

class Organisations {
    organisations:OrganisationsType = null

    constructor() {
        makeAutoObservable(this)
    }

    loadOrganisations() {
        usersAPI.getOrganisations().then(response => this.organisations = response)
    }
}


export default new Organisations()