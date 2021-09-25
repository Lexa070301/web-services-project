import classes from "./Title.module.css";

type title = {
    text: string
}

export const Title = (props:title) => {
    return (
        <h2 className={classes.title}>
            {props.text}
        </h2>
    )
}