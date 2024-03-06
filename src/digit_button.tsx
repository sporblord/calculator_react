import {CalculatorDispatch} from "./app.tsx";

type Props = {
    dispatch: CalculatorDispatch,
    digit: string
}

export default function DigitButton({dispatch, digit}: Props) {
    return (
        <button onClick={() => dispatch({
            type: "add_digit",
            payload: {digit: digit}
        })}>{digit}</button>
    )
}