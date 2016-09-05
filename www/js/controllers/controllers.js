/**
 * Created by Bikram Maharjan on 7/23/2016.
 */
angular.module('starter.controllers', [])

    .controller('menuCtrl', function($scope,$http,sharedCartService,getProductsService) {

        //put cart after menu
        var cart = sharedCartService.cart;
        $scope.slide_items=[    {"p_id":"1",
            "p_name":"New Chicken Maharaja",
            "p_description":"Product Description",
            "p_image_id":"slide_1",
            "p_price":"183"},

            {"p_id":"2",
                "p_name":"Big Spicy Chicken Wrap",
                "p_description":"Product Description",
                "p_image_id":"slide_2",
                "p_price":"171"},

            {"p_id":"3",
                "p_name":"Big Spicy Paneer Wrap",
                "p_description":"Product Description",
                "p_image_id":"slide_3",
                "p_price":"167"}
        ];

        $scope.noMoreItemsAvailable = false; // lazy load list

        //loads the menu----onload event
        $scope.$on('$stateChangeSuccess', function() {
            $scope.loadMore();  //Added Infine Scroll
        });

        // Loadmore() called inorder to load the list
        $scope.loadMore = function() {

            $scope.numberOfItemsToDisplay = 10; // number of item to load each time

            var pdata =  new getProductsService();
            pdata.getProducts().then(function(){
               // console.log('test',pdata.products);
              $scope.menu_items = pdata.products.products;

                $scope.items=[];

               // var image = [];
                angular.forEach($scope.menu_items,function(value,key) {
                    //  console.log('value',value.id_default_image);
                    // console.log('key',key);
                    var idImage = value.id_default_image;
                    var imagePath = 'http://demo.basketnepal.com/img/p/';
                    for ($i = 0; $i < idImage.length; $i++) {
                        imagePath += idImage[$i] + '/';

                    }
                    // var images=[];
                    var images = imagePath + idImage + '.jpg';
                    //$scope.menu_items.push({'url':images})  ;

                    value.url = images;
                    $scope.items.push(value);

                    if (pdata.products.products.length > $scope.numberOfItemsToDisplay) {
                        $scope.numberOfItemsToDisplay += 10; // load 10 more items
                        //more data can be loaded or not
                    }

                        // console.log('img',$scope.menu_items);

                })


                $scope.$broadcast('scroll.infiniteScrollComplete');
                if (pdata.products.products.length == 0) {
                    $scope.noMoreItemsAvailable = true;
                }
            })

        };



        //show product page
        $scope.showProductInfo=function (imgurl,itemName,price) {
            //sessionStorage.setItem('product_info_id', $scope.menu_items.id);
          // console.log('menus',description);
           // sessionStorage.setItem('product_info_desc', description);
            sessionStorage.setItem('product_info_img', imgurl);
            sessionStorage.setItem('product_info_name', itemName);
            sessionStorage.setItem('product_info_price', price);
            window.location.href = "#/page13";
        };

        //add to cart function
        $scope.addToCart=function(id,image,name,price){

            cart.add(id,image,name,price,1);
        };
    })

    .controller('cartCtrl', function($scope,sharedCartService,$ionicPopup,$state) {

        //onload event-- to set the values
        $scope.$on('$stateChangeSuccess', function () {
            $scope.cart=sharedCartService.cart;
            $scope.total_qty=sharedCartService.total_qty;
            $scope.total_amount=sharedCartService.total_amount;
        });

        //remove function
        $scope.removeFromCart=function(c_id){
            $scope.cart.drop(c_id);
            $scope.total_qty=sharedCartService.total_qty;
            $scope.total_amount=sharedCartService.total_amount;

        };

        $scope.inc=function(c_id){
            $scope.cart.increment(c_id);
            $scope.total_qty=sharedCartService.total_qty;
            $scope.total_amount=sharedCartService.total_amount;
        };

        $scope.dec=function(c_id){
            $scope.cart.decrement(c_id);
            $scope.total_qty=sharedCartService.total_qty;
            $scope.total_amount=sharedCartService.total_amount;
        };

        $scope.checkout=function(){
            if($scope.total_amount>0){
                $state.go('checkOut');
            }
            else{
                var alertPopup = $ionicPopup.alert({
                    title: 'No item in your Cart',
                    template: 'Please add Some Items!'
                });
            }
        };

    })

    .controller('checkOutCtrl', function($scope) {
        $scope.loggedin=function(){
            if(sessionStorage.getItem('loggedin_id')==null){return 1;}
            else{
                $scope.loggedin_name= sessionStorage.getItem('loggedin_name');
                $scope.loggedin_id= sessionStorage.getItem('loggedin_id');
                $scope.loggedin_phone= sessionStorage.getItem('loggedin_phone');
                $scope.loggedin_address= sessionStorage.getItem('loggedin_address');
                $scope.loggedin_pincode= sessionStorage.getItem('loggedin_pincode');
                return 0;
            }
        };



    })

    .controller('indexCtrl', function($scope,sharedCartService) {
        //$scope.total = 10;
    })

    .controller('loginCtrl', function($scope,$http,$ionicPopup,$state,$ionicHistory) {
        $scope.user = {};

        $scope.login = function() {
            str="http://www.yoursite.com/foodcart/server_side/user-details.php?e="+$scope.user.email+"&p="+$scope.user.password;
            $http.get(str)
                .success(function (response){
                    $scope.user_details = response.records;
                    sessionStorage.setItem('loggedin_name', $scope.user_details.u_name);
                    sessionStorage.setItem('loggedin_id', $scope.user_details.u_id );
                    sessionStorage.setItem('loggedin_phone', $scope.user_details.u_phone);
                    sessionStorage.setItem('loggedin_address', $scope.user_details.u_address);
                    sessionStorage.setItem('loggedin_pincode', $scope.user_details.u_pincode);

                    $ionicHistory.nextViewOptions({
                        disableAnimate: true,
                        disableBack: true
                    });
                    lastView = $ionicHistory.backView();
                    console.log('Last View',lastView);
                    //BUG to be fixed soon
                    /*if(lastView.stateId=="checkOut"){ $state.go('checkOut', {}, {location: "replace", reload: true}); }
                     else{*/
                    $state.go('profile', {}, {location: "replace", reload: true});
                    //}

                }).error(function() {
                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: 'Please check your credentials!'
                });
            });
        };

    })

    .controller('signupCtrl', function($scope,$http,$ionicPopup,$state,$ionicHistory) {

        $scope.signup=function(data){

            var link = 'http://www.yoursite.com/foodcart/server_side/signup.php';
            $http.post(link, {n : data.name, un : data.username, ps : data.password , ph: data.phone , add : data.address , pin : data.pincode })
                .then(function (res){
                    $scope.response = res.data.result;



                    if($scope.response.created=="1"){
                        $scope.title="Account Created!";
                        $scope.template="Your account has been successfully created!";

                        //no back option
                        $ionicHistory.nextViewOptions({
                            disableAnimate: true,
                            disableBack: true
                        });
                        $state.go('login', {}, {location: "replace", reload: true});

                    }else if($scope.response.exists=="1"){
                        $scope.title="Email Already exists";
                        $scope.template="Please click forgot password if necessary";

                    }else{
                        $scope.title="Failed";
                        $scope.template="Contact Our Technical Team";
                    }

                    var alertPopup = $ionicPopup.alert({
                        title: $scope.title,
                        template: $scope.template
                    });


                });

        }
    })

    .controller('filterByCtrl', function($scope,$http,getCategories,getProductsService) {


        var ct = this;
      //  ct.categories = [];

        ct.getCategories = function() {
            getCategories.getCategories()
                .then(function(categories) {
                        ct.categories = categories;
                       // console.log('categories retrieval failed.',ct.categories);
                    $scope.Categories = ct.categories;
                        console.log('categories returned to controller.');
                        //console.log('categories',ct.categories);
                    },
                    function(data) {
                        console.log('categories retrieval failed.')
                    });
        };

        ct.getCategories();

       /* $scope.Categories = [
            {id: 1, name: 'Bag'},
            {id: 2, name: 'Dress'}
        ];*/

        $scope.getCategory = function(cat_list){
            categoryAdded = cat_list;
            var c_string=""; // will hold the category as string

            for(var i=0;i<categoryAdded.length;i++){
                c_string+=(categoryAdded[i].id+"||"); }

            c_string = c_string.substr(0, c_string.length-2);
            //console.log('cid',c_string);
           // var cdata = new getProductsService();
           getProductsService.id_category_default = c_string;
           // console.log('cdata',getProductsService.id_category_default);
            window.location.href = "#/page1";
        };


    })

    .controller('sortByCtrl', function($scope,getProductsService) {
        $scope.sort=function(sort_by){
            getProductsService.sort=sort_by;
            console.log('sort',sort_by);
            window.location.href = "#/page1";
        };
    })

    .controller('paymentCtrl', function($scope) {

    })

    .controller('profileCtrl', function($scope,$rootScope,$ionicHistory,$state) {

        $scope.loggedin_name= sessionStorage.getItem('loggedin_name');
        $scope.loggedin_id= sessionStorage.getItem('loggedin_id');
        $scope.loggedin_phone= sessionStorage.getItem('loggedin_phone');
        $scope.loggedin_address= sessionStorage.getItem('loggedin_address');
        $scope.loggedin_pincode= sessionStorage.getItem('loggedin_pincode');


        $scope.logout=function(){
            delete sessionStorage.loggedin_name;
            delete sessionStorage.loggedin_id;
            delete sessionStorage.loggedin_phone;
            delete sessionStorage.loggedin_address;
            delete sessionStorage.loggedin_pincode;

            console.log('Logoutctrl',sessionStorage.getItem('loggedin_id'));

            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
            $state.go('menu', {}, {location: "replace", reload: true});
        };
    })

    .controller('myOrdersCtrl', function($scope) {

    })

    .controller('editProfileCtrl', function($scope) {

    })

    .controller('favoratesCtrl', function($scope) {

    })

    .controller('productPageCtrl', function($scope) {

        //onload event
        angular.element(document).ready(function () {
          //  $scope.id= sessionStorage.getItem('product_info_id');
        //   $scope.desc= sessionStorage.getItem('product_info_desc');
            $scope.img= sessionStorage.getItem('product_info_img');
            $scope.name= sessionStorage.getItem('product_info_name');
            $scope.price= sessionStorage.getItem('product_info_price');
        });


    })


