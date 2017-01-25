var app = angular.module('MyApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
		$routeProvider
		.when('/allProducts', {
	    	templateUrl: 'app/views/allProducts.html',
	    	controller: 'allProductsController'
		})
		.when('/product/:id', {
	    	templateUrl: 'app/views/product.html',
	    	controller: 'productController'
		})
		.when('/cart', {
	    	templateUrl: 'app/views/cart.html',
	    	controller: 'cartController'
		})
		.otherwise({redirectTo: '/allProducts'});
	}])
	.controller("allProductsController", ['$scope', '$log', '$location', '$http', function($scope, $log , $location, $http) {
		$log.debug('allProductsController controller initialized');
		$scope.openCatalog = function(){
			$log.debug("clicked on allProducts");
			$location.path('/allProducts');
		}
		$scope.openCart = function(){
			$log.debug("clicked on allProducts");
			$location.path('/cart');
		}

		$scope.openProduct = function(productId){
			$location.path('/product/'+productId);
		}

		$http.get('http://localhost:9000/allProducts')
			.success(function(data) {
				if(data.success == true) {
					$log.debug(data.message);
					$log.debug("list of products->",data.products);
					$scope.allProducts=data.products;
				} else {
					$log.error('data fetching fail');
				}
			})
			.error(function(error) {
				$log.error(error);
			})
	}])
	.controller("productController", ['$scope', '$log', '$location', '$routeParams', '$http', function($scope, $log , $location, $routeParams, $http) {
		$log.debug('productController controller initialized');
		$scope.openCatalog = function(){
			$log.debug("clicked on allProducts");
			$location.path('/allProducts');
		}
		$scope.openCart = function(){
			$log.debug("clicked on allProducts");
			$location.path('/cart');
		}

		$scope.id = $routeParams.id;
		$log.debug("product id in controller is",$scope.id);
		$http.get('http://localhost:9000/product/'+$scope.id)
			.success(function(data) {
				if(data.success == true) {
					$log.debug(data.message);
					$log.debug("product details->",data.product);
					$scope.product=data.product;
				} else {
					$log.error('data fetching fail');
				}
			})
			.error(function(error) {
				$log.error(error);
			})


		$scope.addToCart = function(id){
			var parameter = {
				productId: $scope.id,
				variantId: id
			}
			$http.post('http://localhost:9000/addToCart', parameter)
				.success(function(data) {
					if(data.success == true) {
						$log.debug('added successfully to cart');
						alert("successfully added to cart");
					} else {
						$log.error("Error");
					}
				})
				.error(function(error) {
					$log.error(JSON.stringify(error));
				})

		}
	}])
	.controller("cartController", ['$scope', '$log', '$location', '$http', function($scope, $log , $location, $http) {
		$log.debug('cartController controller initialized');
		$scope.openCatalog = function(){
			$log.debug("clicked on allProducts");
			$location.path('/allProducts');
		}
		$scope.openCart = function(){
			$log.debug("clicked on allProducts");
			$location.path('/cart');
		}
		$http.get('http://localhost:9000/cart')
			.success(function(data) {
				if(data.success == true) {
					$log.debug(data.message);
					$scope.cart=data.cart;
				} else {
					$log.error('data fetching fail');
				}
			})
			.error(function(error) {
				$log.error(error);
			})
	}]);