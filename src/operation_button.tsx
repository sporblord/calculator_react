import {CalculatorDispatch} from "./app.tsx";

type Props = {
    dispatch: CalculatorDispatch,
    operation: string
}

export default function OperationButton({dispatch, operation}: Props) {
    return (
        <button onClick={() => dispatch({
            type: "choose_operation",
            payload: {operation: operation}
        })}>{operation}</button>
    )
}