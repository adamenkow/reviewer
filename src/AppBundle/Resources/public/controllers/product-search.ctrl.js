angular
    .module('appModule')
    .controller('ProductSearchController', ProductSearchController);

	/** 
	 * @Class ProductSearchController
	 * @constructor
	 */
function ProductSearchController ($scope, $http, $rootScope, Console) {
    var vm = this;
    vm.selected = undefined;
    $scope.iframeHeight = window.innerHeight;
    $scope.product = {};
    $scope.animation = 'infinite';

	/** 
	 * This function looks for products from Ceneo.pl, based on the characters entered by user
	 * @method getLocation
	 * @param {String}val
	 */	
    $scope.getLocation = function (val) {
        Console.echo('Szukam produktow')
        return $http({
                url: 'api/products/' + val,
                method: 'GET',
                transformResponse: undefined
            })
            .then(function (response) {
                var $products = $(response.data.replace(/<img([^>]*)>/g,"<lazyimg $1>")).find('div.category-list-body div.cat-prod-row-body');//:lt(10)
                var products = [];

                $.each($products, function(index, productDOM){
                    var product = {};
                    product.id = $(productDOM).parent().data('pid');
                    product.name = $(productDOM).find('strong.cat-prod-row-name').text().trim();
                    product.price =  $(productDOM).find('strong.price').text().trim();
                    product.category =  $(productDOM).find('p.cat-prod-row-category a.dotted-link').text().trim();
                    product.score =  $(productDOM).find('span.product-score').children().remove().end().text().trim();
                    product.shops = $(productDOM).find('span.shop-numb').text();
                    product.votes =  $(productDOM).find('span.product-reviews-link__votes-count').text();

                    product.parameters = [];
                    var parametersDOM = $(productDOM).find('ul.prod-params.cat-prod-row-params li');
                    $.each(parametersDOM, function(i, val) {
                        var parameter = {};
                        parameter[$(val).text().split(':')[0]] = $(val).text().split(':')[1];
                        product.parameters.push( parameter)
                    });

                    var $imageDOM = $(productDOM).find('div.cat-prod-row-foto lazyimg');
                    product.image = (typeof $imageDOM.data('original') != "undefined" ) ? $imageDOM.attr('data-original') : $imageDOM.attr('src');

                    products.push(product);

                });

                return products;

            });
    };
    
	/** 
	 * This function maps the selected product model
	 * @method onSelect
	 * @param $item
	 * @param $model
	 */	
    $scope.onSelect = function($item, $model)
    {
        $rootScope.$emit('productSelected', $model);
        $scope.product = $model;
    };
}
