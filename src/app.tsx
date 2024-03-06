import {Dispatch, useReducer} from "react";
import DigitButton from "./digit_button.tsx";
import OperationButton from "./operation_button.tsx";

type State = {
    current_operand?: string,
    previous_operand?: string,
    operation?: string,
    overwrite: boolean
}

export type CalculatorDispatch = Dispatch<CalculatorAction>

export type CalculatorAction =
    | { type: "add_digit", payload: { digit: string } }
    | { type: "delete_digit", payload: {} }
    | { type: "choose_operation", payload: { operation: string } }
    | { type: "clear", payload: {} }
    | { type: "evaluate", payload: {} }

const FORMATTER = new Intl.NumberFormat("en-us", {
    maximumFractionDigits: 0
})

function format(operand: string) {
    const [integer_string, decimal_string] = operand.split(".");
    const integer = parseFloat(integer_string)

    if (isNaN(integer)) return ""
    if (!operand.includes(".")) return FORMATTER.format(integer)

    return `${FORMATTER.format(integer)}.${decimal_string}`
}

function evaluate({current_operand, previous_operand, operation}: State) {
    const prev = parseFloat(previous_operand || "");
    const current = parseFloat(current_operand || "");
    if (isNaN(prev) || isNaN(current)) return ""

    let result: number;
    switch (operation) {
        case "+":
            result = prev + current;
            break
        case "-":
            result = prev - current;
            break
        case "*":
            result = prev * current;
            break
        case "÷":
            result = prev / current;
            break
        default:
            result = -1;
            return
    }

    return result !== undefined ? result.toString() : ""
}

function reducer(state: State, {type, payload}: CalculatorAction) {
    switch (type) {
        case "add_digit":
            if (state.overwrite) {
                return {
                    ...state,
                    current_operand: payload.digit,
                    overwrite: false
                }
            }

            if (payload.digit === "0" && state.current_operand === "0") return state;
            if (payload.digit === "." && state.current_operand?.includes(".")) return state;
            return {
                ...state,
                current_operand: `${state.current_operand || ""}${payload.digit}`
            }
        case "delete_digit":
            if (state.overwrite) return {...state, overwrite: false, current_operand: undefined}
            if (!state.current_operand) return state;
            if (state.current_operand.length === 1) return {
                ...state,
                current_operand: undefined
            }

            return {
                ...state,
                current_operand: state.current_operand.slice(0, -1)
            }
        case "choose_operation":
            if (!state.current_operand && !state.previous_operand) return state;
            if (!state.previous_operand) return {
                ...state,
                operation: payload.operation,
                previous_operand: state.current_operand,
                current_operand: undefined
            }

            if (!state.current_operand) {
                return {
                    ...state,
                    operation: payload.operation
                }
            }

            return {
                ...state,
                operation: payload.operation,
                previous_operand: evaluate(state),
                current_operand: undefined
            }
        case "evaluate":
            if (!state.operation || !state.current_operand || !state.previous_operand) return state;
            return {
                ...state,
                overwrite: true,
                previous_operand: undefined,
                operation: undefined,
                current_operand: evaluate(state)
            }
        case "clear":
            return {
                overwrite: false
            }
        default:
            return state
    }
}

function App() {
    const [{current_operand, previous_operand, operation}, dispatch] = useReducer(reducer, {
        overwrite: false
    });

    return (
        <div className={"calculator-grid"}>
            <div className={"output"}>
                <div className={"previous-operand"}>{format(previous_operand || "")} {operation}</div>
                <div className={"current-operand"}>{format(current_operand || "")}</div>
            </div>
            <button className={"span-two"} onClick={() =>
                dispatch({type: "clear", payload: {}})
            }>AC
            </button>
            <button onClick={() => dispatch({type: "delete_digit", payload: {}})}>DEL</button>
            <OperationButton dispatch={dispatch} operation={"÷"}/>
            <DigitButton dispatch={dispatch} digit={"1"}/>
            <DigitButton dispatch={dispatch} digit={"2"}/>
            <DigitButton dispatch={dispatch} digit={"3"}/>
            <OperationButton dispatch={dispatch} operation={"*"}/>
            <DigitButton dispatch={dispatch} digit={"4"}/>
            <DigitButton dispatch={dispatch} digit={"5"}/>
            <DigitButton dispatch={dispatch} digit={"6"}/>
            <OperationButton dispatch={dispatch} operation={"+"}/>
            <DigitButton dispatch={dispatch} digit={"7"}/>
            <DigitButton dispatch={dispatch} digit={"8"}/>
            <DigitButton dispatch={dispatch} digit={"9"}/>
            <OperationButton dispatch={dispatch} operation={"-"}/>
            <DigitButton dispatch={dispatch} digit={"."}/>
            <DigitButton dispatch={dispatch} digit={"0"}/>
            <button className={"span-two"} onClick={() => dispatch({type: "evaluate", payload: {}})}>=</button>
        </div>
    )
}

export default App;