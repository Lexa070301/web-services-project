import classes from "./Organizations.module.css";
import Org from "../../store/Organisations";
import {observer} from "mobx-react-lite";
import {toJS} from "mobx";
import {Title} from "../common/Title/Title";
import {useEffect} from "react";

export const Organizations = observer(() => {
    useEffect(() => {
        if(!toJS(Org.organisations)) Org.loadOrganisations();
    }, []);
    
    return (
        <div>
            <Title text={"Организации"}/>
            <div className={classes.organizations}>
                {toJS(Org.organisations)?.map((item, index) => {
                    return (
                        <div className={classes.item} key={index}>
                            <span>{item.Title}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
});