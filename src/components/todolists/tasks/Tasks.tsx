import React, {ChangeEvent, useCallback} from 'react'
import {changeStatusAC, newTaskTitleAC, removeTaskAC} from "../../../state/reducers/tasks-reducer";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "../../ editableSpan/EditableSpan";
import {DeleteForever} from "@material-ui/icons";
import {useDispatch} from "react-redux";
import {TaskType} from "../Todolist";

type PropsType ={
    task: TaskType
    todolistId: string
}


export const Task = React.memo((props: PropsType) => {

    const dispatch = useDispatch();


    const removeTaskHandler = () => dispatch(removeTaskAC(props.task.id, props.todolistId))
    const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newStatusValue = e.currentTarget.checked;
        dispatch(changeStatusAC(props.task.id, newStatusValue, props.todolistId))
    }

    const addNewTitle = useCallback((newTitle: string) => {
        dispatch(newTaskTitleAC(props.task.id, newTitle, props.todolistId))
    }, [dispatch, props.todolistId, props.task.id])

    return (
        <>
            <li key={props.task.id} className={props.task.isDone ? "is-done" : ""}>
                <Checkbox color="primary"
                          inputProps={{'aria-label': 'secondary checkbox'}} onChange={onChangeStatusHandler}
                          checked={props.task.isDone}/>
                <EditableSpan value={props.task.title} newTitle={addNewTitle}/>
                <IconButton onClick={removeTaskHandler}><DeleteForever/></IconButton>
            </li>
        </>
    )

})