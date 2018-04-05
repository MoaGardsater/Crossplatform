angular.module('HotelApp', ['ionic'])


  // Lägg till denna metod för att visa flikarna längst ner på Android.
  .config(function ($ionicConfigProvider) {
    $ionicConfigProvider.platform.android.tabs.position("bottom");
  })

  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state("tabs", {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
      })

      .state("tabs.home", {
        url: "/home",
        views: {
          "home-tab": {
            templateUrl: "templates/home.html"
          }
        }
      })

      .state("tabs.list", {
        url: "/list",
        views: {
          "list-tab": {
            controller: "ListController",
            templateUrl: "templates/list.html"
          }
        }
      })
      .state("tabs.detail", {
        url: "/list/:aID",
        views: {
          "list-tab": {
            templateUrl: "templates/detail.html",
            controller: "ListController"
          }
        }
      })

    $urlRouterProvider.otherwise("/tab/home");
  })

  


  // My Controllers
  .controller("ListController", function ($scope, $http, $state, $stateParams, $ionicPopup, $filter) {

    $scope.dateDifference = function (checkin, checkout) {
      
            var checkin = new Date(checkin);
            var checkout = new Date(checkout);
      
            var timeDifference = Math.abs(checkout.getTime() - checkin.getTime());
            var daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
            var amountOfDays = parseInt(daysDifference);
            if (amountOfDays == 0) {
              amountOfDays = 1;
            }
            $scope.amountOfDays = amountOfDays;
            return amountOfDays;
          }
           
          $scope.today = $filter("date")(Date.now(), 'yyyy-MM-dd');
      
          $scope.getbookdate = function () {
            $scope.bookdate = $filter("date")($scope.data.checkin, 'yyyy-MM-dd');
            console.log($scope.bookdate);
          }
      
          $scope.confirm = function () {
            $scope.totalPriceFinal = ($scope.data.price - 0) * $scope.amountOfDays;
            $scope.data.days = $scope.amountOfDays;
            $scope.data.totalPrice = $scope.totalPriceFinal;


            console.log($scope.amountOfDays);
            console.log($scope.totalPriceFinal);
          }
      

    // data är ett objekt som lagrar info från formuläret
    $scope.data = {};

    // submit är en metod som tar emot formulärdata genom submit-knappen och ng-submit
    $scope.book = function () {
      // Hit kommer data att skickas
      var url = "https://moagardsater.com/ionic/index.php";
      // Data skickas via post
      $http.post(url, $scope.data)
        .then(function (response) {
          $scope.response = response;
          console.log($scope.response);
          $scope.data = {}
        })

        $ionicPopup.alert({
          title: "Bokningsbekräftelse",
          template: "<h5> Rum som är bokat: " + "<br>" + $scope.whichroom + "</h5>" +
          "<h5> Bokat av: " + "<br>" + $scope.data.firstname + " " + $scope.data.lastname + "</h5>" +
          "<hr>" +
          "<h5> Email: " + "<br>" + $scope.data.email + "</h5>" +
          "<h5> Telefonummer: " + "<br>" + $scope.data.tel + "</h5>" +
          "<hr>" +
          "<h5> Antal vuxna: " + "<br>" + $scope.data.adult + "</h5>" +
          "<h5> Antal barn: " + "<br>" + $scope.data.kid + "</h5>" +
          "<hr>" +
          "<h5> Checkin datum: " + "<br>" + $scope.data.checkin + "</h5>" +
          "<h5> Checkout datum: " + "<br>" + $scope.data.checkout + "</h5>" +
          "<hr>" +
          "<h3> Totalt pris: " + " " + $scope.totalPriceFinal + "</h3>",
  
        });


    }


    // Hämta JSON-listan via HTTP
    $http.get('../model/data.json')
      .success(function (data) {
        $scope.rooms = data;

        $scope.whichroom = $state.params.aID;
        console.log($scope.whichroom);

        // $state innehåller all info om en aktuell state
        console.log("$state : " + $state);

        // $stateParams innehåller enbart info om
        // parametrar t.ex. aID som vi skickar via href
        // Titta i filen list.html under ion-item
        console.log("$stateParams : " + $stateParams.aID);

      })



  })
  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })


