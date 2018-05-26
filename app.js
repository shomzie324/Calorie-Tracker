// Storage Controller
const StorageCtrl = (function(){
    // public methods
    return {
        storeItem: function(item){
            let items;
            // check if any items in local storage
            if(localStorage.getItem("items") === null){
                items = [];
                // push new item
                items.push(item);

                // Set local storage
                localStorage.setItem("items", JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem("items"));

                //add new item
                items.push(item);

                // reset local storage
                localStorage.setItem("items", JSON.stringify(items));
            }
        },

        getItemsFromStorage: function () {
            let items;
            if (localStorage.getItem("items" === null)){
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem("items"));
            }

            return items;
        },

        updateItemStorage: function (updatedItem){
            let items = JSON.parse(localStorage.getItem("items"));

            // find item and replace it with updated item
            items.forEach(function (item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });

            // re set local storage
            localStorage.setItem("items", JSON.stringify(items));
        },

        deleteItemFromStorage: function (id) {
            let items = JSON.parse(localStorage.getItem("items"));

            // find item and delete
            items.forEach(function (item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
            });

            // re set local storage
            localStorage.setItem("items", JSON.stringify(items));  
        },

        clearStorageItems: function (){
            localStorage.removeItem("items");
        }
    }
})();

// Item Controller
const ItemCtrl = (function () {
    // Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const state = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    // Return what parts of state that is allowed to accesible
    // without returning something in an IIFE, nothing inside the controller // can be accesed
    return {
        getState: function() {
            return state;
        },
        getItems: function(){
            return state.items;
        },

        getCurrentItem: function () {
            return state.currentItem;
        },

        addItem: function(name, calories) {
            let id;
            // create ID based on last item's id
            if(state.items.length > 0) {
                id = state.items[state.items.length - 1].id + 1;
            } else {
                id = 0;
            }

            // turn caloris to a number
            calories = parseInt(calories);

            // Create new item
            newItem = new Item(id, name, calories);

            // add to items array
            state.items.push(newItem);

            return newItem;
        },

        getItemById: function (id) {
            let found = null;

            // loop through items

            state.items.forEach(function(item) {
                if(item.id === id) {
                    found = item;
                }
            });

            return found;
        },
 
        updateItem: function (newName, newCalories) {
            calories = parseInt(calories);

            let found = null;

            state.items.forEach(function(item) {
                if(item.id === state.currentItem.id){
                    item.name = newName;
                    item.calories = newCalories;
                    found = item;
                }
            });

            return found;
        },

        deleteItem: function (id) {
            // get ids
            ids = state.items.map(function(item) {
                return item.id;
            });

            //get index

            const index = ids.indexOf(id);

            // remove item
            state.items.splice(index, 1);
        },

        clearAllItems: function () {
            state.items = [];
        },

        getTotalCalories: function () {
            let total = 0;

            // add up calories of each item
            state.items.forEach(function(item) {
                total += parseInt(item.calories);
            });

            // update total calories in state
            state.totalCalories = total;

            return state.totalCalories;
        },

        setCurrentItem: function (item) {
            state.currentItem = item;
        }
    }
})();


// UI Controller
const UICtrl = (function () {
    const UISelectors = {
        itemList: "#item-list",
        listItems: "#item-list li",
        addBtn: ".add-btn",
        updateBtn: ".update-btn",
        deleteBtn: ".delete-btn",
        clearBtn:".clear-btn",
        backBtn: ".back-btn",
        itemNameInput: "#item-name",
        itemCaloriesInput: "#item-calories",
        totalCalories: ".total-calories"
    }
    
    // return public methods and variables
    return {
        populateItemList: function(items){
            let html = '';

            items.forEach(function(item) {
                html += `
                <li id="item-${item.id}" class="collection-item">
                    <strong>${item.name}: </strong>
                    <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class=" edit-item fa fa-pencil-alt"></i>
                    </a>
                </li>
                `
            });

            // add list items to UI
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },

        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },

        addListItem: function(item) {
            // show list
            document.querySelector(UISelectors.itemList).style.display = "block";

            // create li element
            const li = document.createElement("li");

            // add classes and idto li
            li.className = "collection-item";
            li.id = `item-${item.id}`;

            // add html
            li.innerHTML = `
            <strong>${item.name}: </strong>
            <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class=" edit-item fa fa-pencil-alt"></i>
            </a>
            `

            // insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },

        updateListItem: function (item) {

            //get all of the li elements in the UI
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // convert node list into array
            listItems = Array.from(listItems);

            // loop through li elements to find the element that needs to be updated
            listItems.forEach(function(listItem) {
                const itemId = listItem.getAttribute("id");

                if (itemId === `item-${item.id}`){
                    document.querySelector(`#${itemId}`).innerHTML =`
                    <strong>${item.name}: </strong>
                    <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class=" edit-item fa fa-pencil-alt"></i>
                    </a>
                    `;
                }
            });
        },

        deleteListItem: function(id) {
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
        },

        clearInputFields: function () {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },

        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = "none";
        },

        getSelectors: function() {
            return UISelectors;
        },

        showTotalCalories: function(calories) {
            document.querySelector(UISelectors.totalCalories).textContent = calories;
        },

        clearEditState: function() {
            UICtrl.clearInputFields();
            document.querySelector(UISelectors.updateBtn).style.display = "none";
            document.querySelector(UISelectors.deleteBtn).style.display = "none";
            document.querySelector(UISelectors.backBtn).style.display = "none";
            document.querySelector(UISelectors.addBtn).style.display = "inline";
        },

        removeItems: function () {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // conver to array
            listItems = Array.from(listItems);

            listItems.forEach(function (item){
                item.remove();
            })
        },

        addItemToForm: function() {
            name = ItemCtrl.getCurrentItem().name;
            calories = ItemCtrl.getCurrentItem().calories;
            console.log(name, calories);
            document.querySelector(UISelectors.itemNameInput).value = name;
            console.log(document.querySelector(UISelectors.itemNameInput).value);
            document.querySelector(UISelectors.itemCaloriesInput).value = calories;
            UICtrl.showEditState();
        },

        showEditState: function() {
            document.querySelector(UISelectors.updateBtn).style.display = "inline";
            document.querySelector(UISelectors.deleteBtn).style.display = "inline";
            document.querySelector(UISelectors.backBtn).style.display = "inline";
            document.querySelector(UISelectors.addBtn).style.display = "none";
        },
    }
})();


// App Controller, return public methods
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
    // Load event listeners
    const loadEventListeners = function () {
        // get UI selectors
        const UISelectors = UICtrl.getSelectors();

        // Add Item Event
        document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);

        // disable submit on eneter
        document.addEventListener("keypress", function(e) {
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        });

        // Edit Icon click event
        document.querySelector(UISelectors.itemList).addEventListener("click", itemEditClick);

        // Update Item click event
        document.querySelector(UISelectors.updateBtn).addEventListener("click", itemUpdateSubmit);

        // delete button event
        document.querySelector(UISelectors.deleteBtn).addEventListener("click", itemDeleteSubmit);

        // back button event
        document.querySelector(UISelectors.backBtn).addEventListener("click", UICtrl.clearEditState);

        // clear button event
        document.querySelector(UISelectors.clearBtn).addEventListener("click", clearAllItemsClick);
    }

    // Add item submit
    const itemAddSubmit = function(e) {
        // get form input from UI controller
        const input = UICtrl.getItemInput();

        // only add if both fields are not empty
        if(input.name !== '' && input.calories !== ''){
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // Add item to ui list
            UICtrl.addListItem(newItem);

            // get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Update total calories on the UI
            UICtrl.showTotalCalories(totalCalories);

            // Store in local storage
            StorageCtrl.storeItem(newItem);

            // clear input fields
            UICtrl.clearInputFields();
        }

        e.preventDefault();
    }

    // Update icon clicked
    const itemEditClick = function(e) {
        if(e.target.classList.contains("edit-item")){
            // get list item id
            const listId = e.target.parentNode.parentNode.id;

            // Break into an array
            const listIdArr = listId.split("-");

            // get actual id
            const id = parseInt(listIdArr[1]);

            // get item
            const itemToEdit = ItemCtrl.getItemById(id);

            //set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // add item to form
            UICtrl.addItemToForm();
        } 

        e.preventDefault();
    }

    // Update Item submit
    const itemUpdateSubmit = function (e) {
        // get item input
        const input = UICtrl.getItemInput();

        // update item in state
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        console.log(updatedItem);

        // update item in UI
        UICtrl.updateListItem(updatedItem);

        // get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Update total calories on the UI
        UICtrl.showTotalCalories(totalCalories);

        // Update Local Storage
        StorageCtrl.updateItemStorage(updatedItem);

        // clear edit fields
        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Delete button Event
    const itemDeleteSubmit = function(e) {
        // get current item

        const currentItem = ItemCtrl.getCurrentItem();

        // delete from state
        ItemCtrl.deleteItem(currentItem.id);

        // delete item from UI
        UICtrl.deleteListItem(currentItem.id);

        // update total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        // delete item from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        // clear fields
        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Clear items event
    const clearAllItemsClick = function () {
        // Delete all items from state
        ItemCtrl.clearAllItems();

        // update calories
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        // remove all items from the UI
        UICtrl.removeItems();

        // remove all items for local storage
        StorageCtrl.clearStorageItems();

        // Hide UL
        UICtrl.hideList();

    }

    // return public methods and variables
    return {
        init: function() {

            // Hide edit UI controls
            UICtrl.clearEditState();

            // get items from item controller
            const items = ItemCtrl.getItems();

            // Check if there are any items
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                // populate ul with items
                UICtrl.populateItemList(items);

                // get total calories
                const totalCalories = ItemCtrl.getTotalCalories();

                // Update total calories on the UI
                UICtrl.showTotalCalories(totalCalories);
            }

            // load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init();