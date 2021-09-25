import React, {useEffect} from 'react';
import './App.css';
import {
    BrowserRouter as Router, NavLink, Redirect,
    Route, Switch
} from "react-router-dom";
import {AsideMenu} from "./components/AsideMenu/AsideMenu";
import {UserInstance} from "./store/User";
import {observer} from "mobx-react-lite";
import {ForManager} from "./components/ForManager/ForManager";
import {Organizations} from "./components/Organizations/Organizations";
import {Login} from "./components/Login/Login";
import {form} from "./store/LoginForm";
import {Agents} from "./components/Agents/Agents";

const App = observer(() => {
    useEffect(() => {
        UserInstance.checkAuth();
    }, []);

    const managerRoutes = <>
        <Route path="/for-manager">
            <ForManager/>
        </Route>
        <Route path="/organizations">
            <Organizations/>
        </Route>
        <Route path="/agents">
            <Agents/>
        </Route>
    </>

    const accountantRoutes = <>
        <Route path="/for-accountant"></Route>
    </>
    const agentRoutes = <>
        <Route path="/for-agent"></Route>
    </>
    const adminRoutes = <>
        {managerRoutes}
        {accountantRoutes}
        {agentRoutes}
        <>
            <Route path="/for-agent"></Route>
        </>
    </>
    return (
        <Router>
            <AsideMenu/>
            <div className="App">
                <div className="container">
                    <Switch>
                        <Route path="/login">
                            <Login form={form}/>
                        </Route>
                        {
                            UserInstance.position === "Менеджер" &&
                            managerRoutes
                        }
                        {
                            UserInstance.position === "Бухгалтер" &&
                            accountantRoutes
                        }
                        {
                            UserInstance.position === "Агент" &&
                            agentRoutes
                        }
                        {
                            UserInstance.position === "Администратор" &&
                            adminRoutes
                        }
                    </Switch>
                </div>
            </div>
        </Router>
    );
});

export default App;
