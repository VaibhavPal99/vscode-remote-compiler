import { useEffect, useState } from "react"
import './Home.css'

export const Home = () => {

    const [inputBox, setInputBox] = useState('');
    const [outputBox, setOutputBox] = useState('');

    const vscode = (window as any).acquireVsCodeApi();

    const handleRunCode = () => {
        vscode.postMessage({
            command : 'runCode',
            input: inputBox
        })
    }

    useEffect(() => {
        window.addEventListener('message', (event) => {
            const message = event.data;
            if (message.command === 'runCodeResult') {
                setOutputBox(message.output);
            }
        });

        return () => window.removeEventListener('message', () => {});
    },[])

    return (
        <>
        
        <button onClick={handleRunCode}>Run</button>


        <h3>Input</h3>
        <textarea id="inputbox" value={inputBox} 
        placeholder="Enter Input..."
        onChange={(e)=> {
            setInputBox(e.target.value);
        }}></textarea>
    

        <h3>Output</h3>
        <textarea id="outputBox"  value={outputBox}></textarea>

        </>
    )
}