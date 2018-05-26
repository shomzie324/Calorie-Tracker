// Storage Controller

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
        items: [
            // {id: 0, name: "Steak Dinner", calories: 1200},
            // {id: 1, name: "Cookie", calories: 400},
            // {id: 2, name: "Eggs", calories: 200}
        ],
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

        getTotalCalories: function () {
            let total = 0;

            // add up calories of each item
            state.items.forEach(function(item) {
                total += item.calories;
            });

            // update total calories in state
            state.totalCalories = total;

            return state.totalCalories;
        }
    }
})();


// UI Controller
const UICtrl = (function () {
    const UISelectors = {
        itemList: "#item-list",
        addBtn: ".add-btn",
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
        }
    }
})();


// App Controller, return public methods
const App = (function (ItemCtrl, UICtrl) {
    // Load event listeners
    const loadEventListeners = function () {
        // get UI selectors
        const UISelectors = UICtrl.getSelectors();

        // Add Item Event
        document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);
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

            // clear input fields
            UICtrl.clearInputFields();
        }

        e.preventDefault();
    }

    // return public methods and variables
    return {
        init: function() {

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
})(ItemCtrl, UICtrl);

// Initialize App
App.init();