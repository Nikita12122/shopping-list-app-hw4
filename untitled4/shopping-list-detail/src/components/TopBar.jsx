import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

export default function TopBar() {
    const { toggleTheme } = useContext(ThemeContext);
    const { i18n } = useTranslation();

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
                marginBottom: "1rem"
            }}
        >
            <button
                onClick={toggleTheme}
                style={{ padding: "0.4rem 0.8rem" }}
                title="Toggle theme"
            >
                🌓
            </button>

            <button
                onClick={() => i18n.changeLanguage("en")}
                style={{ padding: "0.4rem 0.8rem" }}
            >
                EN
            </button>

            <button
                onClick={() => i18n.changeLanguage("cs")}
                style={{ padding: "0.4rem 0.8rem" }}
            >
                CZ
            </button>
        </div>
    );
}
