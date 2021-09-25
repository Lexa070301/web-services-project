import {makeAutoObservable} from "mobx";
import {loginAPI} from "../api/api";

type position = "Менеджер" | "Бухгалтер" | "Агент" | "Администратор" | null

export const UserInstance = new class User {
    position: position = null
    isEntered: boolean = false

    constructor() {
        makeAutoObservable(this)
    }

    login(position: position) {
        this.isEntered = true
        this.position = position
    }

    logout() {
        this.isEntered = false
        this.position = null
        localStorage.removeItem('token')
    }


    async checkAuth() {
        try {
            const token = localStorage.getItem('token')
            if (token) {
                loginAPI.checkAuth().then(response => {
                    this.login(response[0].Title)
                })
            } else {
                this.logout()
            }

        } catch (e) {
            console.error(e)
        }
    }
}
