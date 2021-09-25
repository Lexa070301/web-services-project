import {Title} from "../Title/Title";
import {
    NavLink
} from "react-router-dom";
import classes from "./ColumnMenu.module.css";

type item = {
    text: string
    link: string
}

type props = {
    title: string
    items: Array<item>
}

export const ColumnMenu = (props: props) => {
    return (
        <div>
            <Title text={props.title}/>
            <ul className={classes.list}>
                {props.items.map((item, index) => {
                    return (
                        <li key={index} className={classes.item}>
                            <NavLink to={item.link} className={classes.link}>
                                {item.text}
                            </NavLink>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
