/*Database:
This section of code creates a variable to hold a database connection.
*/
let db;

/*Connection:
This piece of code estrablishes a connection to the IndexedDB database 'budget_tracker'.  The '1' means that it sets it to version 1.  
*/
const request = indexedDB.open("budget_tracker", 1);


/*Upgrade: 
This section of code is trying to create a new object store called "new_budget" with the autoIncrement: true.  The new object store called "new_budget" will be created in the database.  The event.target.result is the target of the
event, which is the database.  The db variable would then contain all of the information about the newly created object store, such as its name and the location within the database.  
*/
request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore('new_budget', { atuoIncrement: true });
};


/*On Success:
This piece of code is a function that is called when the user clicks the button.  The event object passed to this function has an 'onsuccess' property which will be true if the request was sucessful and false otherwise.  
*/
request.onsuccess = function (event) {
    db = event.target.result;
    if (navigator.onLine) {
        uploadBudget();
    }
};

request.onerror = function (event) {
    console.log("Error: " + event.target.errorCode);
};


/*Save Record: 
This piece of code saves a record to the new_budget object store.  The transaction is created with readwrite permissioins, and then the record is saved by adding it to the new_budget object store.
*/
function saveRecord(record) {
    const transaction = db.transaction(["new_budget"], "readwrite");

    const store = transaction.objectStore("new_budget");

    store.add(record);
}


/*Upload Budget: 
This section of code creates a transaction in the database and stores the new budget object.  It first creates a transaction object and sets the readwrite property to be true.  The code then creates an object store called new_budget, which is stored in the transaction object.  It then
gets all of the records from that store using getAll().  It then check if there are any results before calling fetch() with a POST request and passing in JSON data for each result.  Finally it calls .then() on response to handle success or failure.
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