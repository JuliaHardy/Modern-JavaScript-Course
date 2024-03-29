const ItemCtrl = (function() {
        const Item = function(id, name, calories){
                this.id = id;
                this.name = name;
                this.calories = calories;
        }

        const data = {
                items: [
                        // {id: 0, name: 'Steak Dinner', calories: 1200},
                        // {id: 1, name: 'Cake', calories: 500}
                ],
                currentItem: null,
                totalCalories: 0
        }
        //Public Methods
        return {
                getItems: function() {
                        return data.items;
                },
                addItem: function(name, calories) {
                        let ID;
                        if(data.items.length > 0){
                                ID = data.items[data.items.length -1].id + 1;
                        } else {
                                ID = 0;
                        }

                        calories = parseInt(calories);
                        newItem = new Item(ID, name, calories);
                        data.items.push(newItem);

                        return newItem;
                },
                getTotalCalories: function(){
                        let total = 0;
                        data.items.forEach(function(item){
                                total += item.calories;
                        });
                        data.totalCalories = total;

                        return data.totalCalories;
                },
                getItemById: function(id){
                        let found = null;

                        data.items.forEach(item => {
                                if(item.id === id){
                                        found = item
                                }
                        });
                        return found;
                },
                updateItem: function(name, calories){
                        calories = parseInt(calories);
                        let found = null;
                        data.items.forEach(item => {
                                if(item.id === data.currentItem.id){
                                        item.name = name;
                                        item.calories = calories;
                                        found = item;
                                }
                        });
                        return found;
                },
                setCurrentItem: function(item){
                        data.currentItem = item;
                },
                getCurrentItem: function(){
                        return data.currentItem;
                },

                logData: function(){
                        return data;
                }
        }
})();

const UICtrl = (function() {
        const UISelectors = {
                itemList: '#item-list',
                listItems: '#item-list li',
                addBtn: '.add-btn',
                updateBtn: '.update-btn',
                deleteBtn: '.delete-btn',
                backBtn: '.back-btn',
                ItemNameInput: '#item-name',
                ItemCaloriesInput: '#item-calories',
                totalCalories: '.total-calories'
        }

        return {
                populateItemList: function(items){
                        let html = '';

                        items.forEach(function(item){
                                html += `<li class="collection-item" id="item-${item.id}">
                                <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
                        </li>`
                        });

                        document.querySelector(UISelectors.itemList).innerHTML = html;
                },
                getItemInput: function(){
                        return {
                                name: document.querySelector(UISelectors.ItemNameInput).value,
                                calories: document.querySelector(UISelectors.ItemCaloriesInput).value
                        }
                },
                addListItem: function(item){
                        document.querySelector(UISelectors.itemList).style.display = 'block';
                        const li = document.createElement('li');
                        li.className = 'collection-item';
                        li.id = `item-${item.id}`;
                        li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;

                        document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
                },
                updateListItem: function(item){
                        let listItems = document.querySelectorAll(UISelectors.listItems);
                        
                },
                clearInput: function(){
                        document.querySelector(UISelectors.ItemNameInput).value = '';
                        document.querySelector(UISelectors.ItemCaloriesInput).value = '';
                },
                addItemToForm: function(){
                        document.querySelector(UISelectors.ItemNameInput).value = ItemCtrl.getCurrentItem().name;
                        document.querySelector(UISelectors.ItemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;

                        UICtrl.showEditState();
                },
                hideList: function(){
                        document.querySelector(UISelectors.itemList).style.display = 'none';
                },
                showTotalCalories: function(totalCalories){
                        document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
                },
                clearEditState: function(){
                        UICtrl.clearInput();
                        document.querySelector(UISelectors.updateBtn).style.display = 'none';
                        document.querySelector(UISelectors.deleteBtn).style.display = 'none';
                        document.querySelector(UISelectors.backBtn).style.display = 'none';
                        document.querySelector(UISelectors.addBtn).style.display = 'inline';
                },
                showEditState: function(){
                        document.querySelector(UISelectors.updateBtn).style.display = 'inline';
                        document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
                        document.querySelector(UISelectors.backBtn).style.display = 'inline';
                        document.querySelector(UISelectors.addBtn).style.display = 'none';
                },
                getSelectors: function(){
                        return UISelectors;
                }
        }
})();

const App = (function(ItemCtrl, UICtrl) {
        const loadEventListeners = function() {
                const UISelectors = UICtrl.getSelectors();
                document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

                // disable enter key on all buttons
                document.addEventListener('keypress', function(e){
                        if(e.keyCode === 13 || e.which === 13){
                                e.preventDefault();
                                return false;
                        }
                });

                document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

                document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        }

        const itemAddSubmit = (e) => {
                const input = UICtrl.getItemInput();
                
                if(input.name !== '' && input.calories !== ''){
                        const newItem = ItemCtrl.addItem(input.name, input.calories);
                        UICtrl.addListItem(newItem);

                        const totalCalories = ItemCtrl.getTotalCalories();
                        UICtrl.showTotalCalories(totalCalories);

                        UICtrl.clearInput();
                }
                e.preventDefault();
        }

        const itemEditClick = function(e){
                if(e.target.classList.contains('edit-item')){
                      const listId = e.target.parentNode.parentNode.id;
                      const listIdArr = listId.split('-');
                      const id = parseInt(listIdArr[1]);
                      
                      const itemToEdit = ItemCtrl.getItemById(id);

                      ItemCtrl.setCurrentItem(itemToEdit);
                      UICtrl.addItemToForm();
                }
                
                e.preventDefault();
        }

        const itemUpdateSubmit = function(e){
                const input = UICtrl.getItemInput();
                const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

                UICtrl.updateListItem(updatedItem);

                e.preventDefault();
        }

        return {
                init: function() {
                        UICtrl.clearEditState();
                        const items = ItemCtrl.getItems();

                        if(items.length === 0){
                                UICtrl.hideList();
                        } else {
                                UICtrl.populateItemList(items);
                        }
                        
                        const totalCalories = ItemCtrl.getTotalCalories();
                        UICtrl.showTotalCalories(totalCalories);

                        loadEventListeners();
                }
        }
})(ItemCtrl, UICtrl);

App.init();
