opac2.controller('DetailController', ['$scope', '$translate', '$routeParams', '$location', '$filter', '$timeout' ,'ApiServices', 'LocalSessionSettingsServices','SharedServices',
  function ($scope, $translate, $routeParams, $location, $filter,$timeout, ApiServices, LocalSessionSettingsServices,SharedServices) {
    //console.log("DetailController");
    //scroll top
    $("html, body").animate({
      scrollTop: 0
    }, "slow");
    //Ottiene i dati relativi al polo nella sessione dell'tente
    $scope.polo = LocalSessionSettingsServices.getPolo()
    $scope.flagVisualizza = true;
    //ottiene i dati della sintetica dalla sessione di impostazioni locale
    $scope.sintetica = LocalSessionSettingsServices.getSintetica();

    $scope.ricercaAvanzata = function (flag) {
      LocalSessionSettingsServices.setModifyFlag(flag);
      $location.path("/" + $scope.polo.code + "/ricercaAvanzata");
    };
    var showSingleDetail = function (id) {
      //creazione dei filtri e campi di ricerca
      var campoRic = {
        field: "id",
        value: id
        //		operator: "OR"
      };

      var filtersGroup = {
        filters: [campoRic]
      };

      //oggetto da inviare al server
      var toPostJson = {
        start: 0,
        maxRows: 10,
        sort: "score",
        isDetail: false,
        filters: {
          operator: "AND",
          filters: [filtersGroup

          ]
        }

      };
      return toPostJson;
    };

    //ripulisco il dettaglio della sessione locale
    LocalSessionSettingsServices.setDetail(null)

    //metodo per caambiare lingua
    $scope.changeLanguage = function (key) {
      $translate.use(key);
    };

    var documentSearch = function () {
      //Avvio la ricerca
      // $('#loading').modal('show');
    	 //Controllo se vid o autore
        if ($scope.idUrl[3].toUpperCase() === "V") {
        	$timeout(function(){      	
        	$location.path($scope.polo.code + "/authority/" + $scope.idUrl);
        		
        	})
        } else {
         
      ApiServices.ricerca(showSingleDetail($scope.idUrl)).then(function (success) {
        //console.log("SUCCESS detail", success.data);
        $('#loading').modal('hide');
        LocalSessionSettingsServices.setResponseFromSearch(success.data);

        $location.path($scope.polo.code + "/result");
          }, function (error) {
        //console.log("ERROR", error.data);
        $('#loading').modal('hide');
        //salvo in loca  $('#loading').modal('hide');le l'errore che si è verificato nella chiamata al server
        LocalSessionSettingsServices.setError(503);
        $location.path($scope.polo.code + "/error")

      });
        }
    }
    var authorSearch = function (toPostJson) {
      $timeout(function () {
        $location.path($scope.polo.code + "/dettaglio/documento/" + $scope.idUrl);
      }, 100);

    }

    var id = $routeParams.id;
    //	id = id.toUpperCase();
    $scope.idUrl = null;
    $scope.idUrl = id;
     
    $scope.controller = ($scope.idUrl[3].toUpperCase() != 'V') ? 'dettaglioDoc' : 'dettaglioAut';
      $scope.setPolo = function(poloObj, bibliotecaCode) {
  		var path = SharedServices.initPolo(poloObj, bibliotecaCode, 'ricercaAvanzata');
  	    $scope.polo = LocalSessionSettingsServices.getPolo();
  		documentSearch();
  	};
  	var poloCode = $routeParams.codPolo;
  	var bibliotecaCode = $routeParams.codBiblioteca;
  	prettyLog("Codice Polo nell'url", poloCode);
  	prettyLog("Biblioteca nell'url", bibliotecaCode)
  	$scope.loading = true;
  	
  	var loadPolo = function() {
	    LocalSessionSettingsServices.setOpacVersion(opac_version);

		$scope.polo = LocalSessionSettingsServices.getPolo();
		if($scope.polo != null)
			return;
		if (!isUndefined(poloCode)  && !isUndefined(poloApp.polo)) {
			$scope.setPolo(poloApp.polo, bibliotecaCode)
		} else {
			if (isUndefined(poloApp.poli)) {
				if (typeof poloApp.polo === 'object') {
					$scope.setPolo(poloApp.polo, undefined)
				} else {
					//polo non definito
					window.location.href = base_url;
				}

			} else {
			
					LocalSessionSettingsServices.setError(503);
					$location.path("/error");
			}
		}
	};
  	loadPolo();
  }]);
