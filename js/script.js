(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('path', 'https://davids-restaurant.herokuapp.com/menu_items.json')
.directive('foundItems', foundItemsDirective);

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController (MenuSearchService) {
	var menu = this;
	menu.flag = false;
	menu.found = [];
	menu.searchTerm = '';

	menu.search = function (searchTerm) {
		var promise = MenuSearchService.getMatchedMenuItems(searchTerm);
		promise.then(function (response) {
			menu.found = response;
			menu.flag = true;
		})
		.catch(function (error) {
      console.log(error);
      menu.flag = true;
    })
	};

	menu.removeItem = function (index) {
		MenuSearchService.removeItem(index, menu.found);
	};
}

function foundItemsDirective () {
	var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
    	flag: '<',
      items: '<',
      onRemove: '&'
    },
    controller: NarrowItDownDirectiveController,
    controllerAs: 'menu',
    bindToController: true
  };

  return ddo;
}

function NarrowItDownDirectiveController () {
	var menu = this;
	menu.isEmpty = function () {
		if (menu.items.length > 0){
			return false;
		}
		if (menu.items.length === 0) {
			return true;
		}
	}
}


MenuSearchService.$inject = ['$http', 'path'];
function MenuSearchService ($http, path) {
	var service = this;

	service.getMatchedMenuItems = function (searchTerm) {
		return $http({
      method: "GET",
      url: (path)
    }).
    then(function (result) {
    	var foundItems = [];
    	for (var i = 0; i < result.data.menu_items.length; i++) {
    		if (result.data.menu_items[i].description.indexOf(searchTerm) !== -1){
    			foundItems.push(result.data.menu_items[i]);
    		}
   	  }
   	  return foundItems;
    })
		.catch(function (error) {
			console.log(error);
		});
	}

	service.removeItem = function (index, items) {
		items.splice(index, 1);
	}
}


})();