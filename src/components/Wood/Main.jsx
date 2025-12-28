import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';

import AI from "./AI.jsx";
import Placeholder from "./Placeholder.jsx";

export default function Main() {
    return (
        <div className="h-full flex flex-col bg-base-100">
            <BrowserRouter>
                <div className="flex justify-center">
                    <div className="navbar w-auto p-[0px]">
                        <Link className="capitalize btn shadow-sm btn-ghost md-p-2 h-full" to="/Wood/">AI</Link>
                        <Link className="capitalize btn shadow-sm btn-ghost md-p-2 h-full" to="/Wood/Placeholder">Placeholder</Link>
                    </div>
                </div>
                <div className="flex-1">
                    <Routes>
                        <Route path="/Wood/" element={<AI />} />
                        <Route path="/Wood/Placeholder" element={<Placeholder />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    )
};