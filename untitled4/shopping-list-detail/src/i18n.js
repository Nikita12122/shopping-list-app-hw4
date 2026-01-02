import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    resources: {
        en: {
            translation: {
                myLists: "My Shopping Lists",
                newList: "+ New List",
                showArchived: "Show archived",
                createList: "Create List",
                listNamePlaceholder: "List name...",
                cancel: "Cancel",
                add: "Add",
                confirmDelete: "Confirm Delete",
                areYouSure: "Are you sure?",
                delete: "Delete",
                back: "Back",

                archive: "Archive",
                restore: "Restore",
                membersCount: "{{count}} members",
                member: "member",

                ownerLabel: "Owner",
                youLabel: "You",


                statistics: "Statistics",
                items: "Items",
                all: "All",
                unresolved: "Unresolved",
                resolved: "Resolved",
                undo: "Undo",
                resolve: "Resolve",
                addItemPlaceholder: "Add item...",
                deleteList: "Delete list",
                members: "Members",
                newMemberPlaceholder: "New member...",
                remove: "Remove",
                leaveList: "Leave list",
                renameList: "✍ Rename List",
                save: "Save",
                owner: "Owner",
                you: "You",
                friend: "Friend",
                overview: "Overview"

            }
        },
        cs: {
            translation: {
                myLists: "Moje nákupní seznamy",
                newList: "+ Nový seznam",
                showArchived: "Zobrazit archivované",
                createList: "Vytvořit seznam",
                listNamePlaceholder: "Název seznamu...",
                cancel: "Zrušit",
                add: "Přidat",
                confirmDelete: "Potvrdit smazání",
                areYouSure: "Jste si jisti?",
                delete: "Smazat",
                back: "Zpět",

                statistics: "Statistiky",
                items: "Položky",
                all: "Vše",
                unresolved: "Nevyřešené",
                resolved: "Vyřešené",
                undo: "Vrátit",
                resolve: "Vyřešit",
                addItemPlaceholder: "Přidat položku...",
                deleteList: "Smazat seznam",
                members: "Členové",
                newMemberPlaceholder: "Nový člen...",
                remove: "Odebrat",
                leaveList: "Opustit seznam",
                renameList: "✍ Přejmenovat seznam",
                save: "Uložit",
                owner: "Vlastník",
                you: "Vy",
                friend: "Přítel",


                archive: "Archivovat",
                restore: "Obnovit",
                membersCount: "{{count}} členů",
                member: "člen",

                ownerLabel: "Vlastník",
                youLabel: "Vy",
                overview: "Přehled"

            }
        }
    }
});

export default i18n;
