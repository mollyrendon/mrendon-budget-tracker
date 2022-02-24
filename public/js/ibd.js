/*Database:
This section of code creates a variable to hold a database connection.
*/
let db;

/*Connection:
This piece of code estrablishes a connection to the IndexedDB database 'budget_tracker'.  The '1' means that it sets it to version 1.  
*/
const request = indexedDB.open("budget_tracker", 1);


/*Upgrade: 

*/
request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore('new_budget', { atuoIncrement: true });
};


/*On Success:

*/
request.onsuccess = function (event) {
    db = event.target.result;
    if (navigator.onLine) {
        uploadBudget();
    }
};


/*On Error: 

*/
request.onerror = function (event) {
    console.log("Error: " + event.target.errorCode);
};


/*Save Record: 

*/
function saveRecord(record) {
    const transaction = db.transaction(["new_budget"], "readwrite");

    const store = transaction.objectStore("new_budget");

    store.add(record);
}


/*Upload Budget: 

*/
function uploadBudget() {
    const transaction = db.transaction(["new_budget"], "readwrite");

    const store = transaction.objectStore("new_budget");

    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
                .then(response => response.json())
                .then(() => {
                    const transaction = db.transaction(["new_budget"], "readwrite");
                    const store = transaction.objectStore("new_budget");
                    store.clear();
                });
        }
    };
}
function deletePending() {
    const transaction = db.transaction(["new_budget"], "readwrite");
    const store = transaction.objectStore("new_budget");
    store.clear();
}

window.addEventListener("online", uploadBudget);