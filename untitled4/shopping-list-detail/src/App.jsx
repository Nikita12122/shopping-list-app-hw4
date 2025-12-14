import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShoppingListsOverview from "./pages/ShoppingListsOverview";
import ShoppingListDetailPage from "./pages/ShoppingListDetailPage";

export default function App() {
    return (
        <Router>
            <Routes>
                {/* Overview page — shows all lists */}
                <Route path="/" element={<ShoppingListsOverview />} />

                {/* Detail page — opens individual list by ID */}
                <Route path="/list/:id" element={<ShoppingListDetailPage />} />
            </Routes>
        </Router>
    );
}
