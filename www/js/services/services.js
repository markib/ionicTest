/**
 * Created by Bikram Maharjan on 7/23/2016.
 */
angular.module('starter.services', [])


  .factory('sharedCartService', ['$ionicPopup',function($ionicPopup){

        var cartObj = {};
        cartObj.cart=[];
        cartObj.total_amount=0;
        cartObj.total_qty=0;

        cartObj.cart.add=function(id,image,name,price,qty){
            if( cartObj.cart.find(id)!=-1 ){
                var alertPopup = $ionicPopup.alert({
                    title: 'Product Already Added',
                    template: 'Increase the qty from the cart'
                });
                //cartObj.cart[cartObj.cart.find(id)].cart_item_qty+=1;
                //cartObj.total_qty+= 1;
                //cartObj.total_amount+= parseInt(cartObj.cart[cartObj.cart.find(id)].cart_item_price);
            }
            else{
                cartObj.cart.push( { "cart_item_id": id , "cart_item_image": image , "cart_item_name": name , "cart_item_price": price , "cart_item_qty": qty } );
                cartObj.total_qty+=1;
                cartObj.total_amount+=parseInt(price);
            }
        };

        cartObj.cart.find=function(id){
            var result=-1;
            for( var i = 0, len = cartObj.cart.length; i < len; i++ ) {
                if( cartObj.cart[i].cart_item_id === id ) {
                    result = i;
                    break;
                }
            }
            return result;
        };

        cartObj.cart.drop=function(id){
            var temp=cartObj.cart[cartObj.cart.find(id)];
            cartObj.total_qty-= parseInt(temp.cart_item_qty);
            cartObj.total_amount-=( parseInt(temp.cart_item_qty) * parseInt(temp.cart_item_price) );
            cartObj.cart.splice(cartObj.cart.find(id), 1);

        };

        cartObj.cart.increment=function(id){
            cartObj.cart[cartObj.cart.find(id)].cart_item_qty+=1;
            cartObj.total_qty+= 1;
            cartObj.total_amount+=( parseInt( cartObj.cart[cartObj.cart.find(id)].cart_item_price) );
        };

        cartObj.cart.decrement=function(id){

            cartObj.total_qty-= 1;
            cartObj.total_amount-= parseInt( cartObj.cart[cartObj.cart.find(id)].cart_item_price) ;


            if(cartObj.cart[cartObj.cart.find(id)].cart_item_qty == 1){  // if the cart item was only 1 in qty
                cartObj.cart.splice( cartObj.cart.find(id) , 1);  //edited
            }else{
                cartObj.cart[cartObj.cart.find(id)].cart_item_qty-=1;
            }

        };

        return cartObj;
    }])

    .factory('getCategories', ['$http' ,'$q',function($http,$q){

       // var categories = [];
        var ApiUrl = "http://demo.basketnepal.com/api"; // API Base url
        var ws_key = 'H7DGGVU3C1A4DSPNGTHTRKEILLL1YLKP' ;

            // interface
            var service = {
                categories: [],
                getCategories: getCategories
            };
            return service;

            // implementation
            function getCategories() {
                var def = $q.defer();

                return $http.get(ApiUrl + "/categories/"+"?output_format=JSON"+"&display=full"+"&ws_key="+ws_key).success(function(data) {
                        service.categories = data;
                        def.resolve(data);
                    })
                    .error(function() {
                        def.reject("Failed to get datas");
                    });
                return def.promise;
            }
    }])



    .factory('getProductsService',['$http',function($http){
       var products = {};
        var ApiUrl = "http://demo.basketnepal.com/api"; // API Base url
        var ws_key = 'H7DGGVU3C1A4DSPNGTHTRKEILLL1YLKP' ;
        var id_category_default = "";
        var sort = "";

        // instantiate our initial object
        var getProductsService = function() {

        };
        // define the GetProducts method which will fetch data
        // from GH API and *returns* a promise
        getProductsService.prototype.getProducts = function() {

            // Generally, javascript callbacks, like here the $http.get callback,
            // change the value of the "this" variable inside it
            // so we need to keep a reference to the current instance "this" :
          //  console.log('cat',getProductsService.id_category_default);
            var self = this;
            if (getProductsService.id_category_default) {
                return $http.get(ApiUrl + "/products/" + "?output_format=JSON" + "&display=full" + "&filter[id_category_default]=" + getProductsService.id_category_default + "&ws_key=" + ws_key).then(function (response) {

                    // when we get the results we store the data in product
                    self.products = response.data

                    // promises success should always return something in order to allow chaining
                    return response;

                });

            }
            if (getProductsService.sort) {
                return $http.get(ApiUrl + "/products/" + "?output_format=JSON" + "&display=full" + "&sort=" + [getProductsService.sort] + "&ws_key=" + ws_key).then(function (response) {

                    // when we get the results we store the data in product
                    self.products = response.data

                    // promises success should always return something in order to allow chaining
                    return response;

                });

            }
            else {
                return $http.get(ApiUrl + "/products/" + "?output_format=JSON" + "&display=full" + "&ws_key=" + ws_key).then(function (response) {

                    // when we get the results we store the data in product
                    self.products = response.data

                    // promises success should always return something in order to allow chaining
                    return response;

                });
            }
            ;
        }
        return getProductsService;



    }])

    .factory('sharedFilterService', [function(){

        var obj = {};
        obj.str = "http://www.yoursite.com/foodcart/server_side/food_menu.php?till=";
        obj.sort = "";
        obj.search = "";
        obj.category = "";
        obj.tillcategory=0;

        //console.log("URL",obj.category);

        obj.getUrl=function(){

            obj.till=obj.till + 5;
            obj.str="http://www.yoursite.com/foodcart/server_side/food_menu.php?till="+obj.till; // pass the value to url

            if(obj.sort!="" && obj.category!=""){
                obj.str= obj.str+"&category="+obj.category+"&sort="+obj.sort;
            }
            else if(obj.category!="" ){
                obj.str= obj.str+"&category="+obj.category;
            }
            else if(obj.sort!=""){
                obj.str= obj.str+"&sort="+obj.sort;
            }
            console.log("URL",obj.str);
            return obj.str;
        };
        return obj;
    }])


    .service('BlankService', [function(){

    }]);

