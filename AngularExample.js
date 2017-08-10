(function () {
    'use strict';

    var sagasMultiSelectListController = function ($scope, $rootScope, $interval, toaster, openSagasService, treeConfig, JSONFormatterConfig) {
        var vm = this;

        vm.LoadOpenSagas = loadOpenSagas;
        vm.SetSagaData = setSagaData;
        vm.SendContinueCommand = sendContinueCommand;

        treeConfig.defaultCollapsed = true;
        JSONFormatterConfig.hoverPreviewEnabled = true;
        JSONFormatterConfig.hoverPreviewArrayCount = 100;
        JSONFormatterConfig.hoverPreviewFieldCount = 5;

        vm.OpenSagas = [];
        vm.SelectedSaga = null;
        vm.SagaData = {};

        vm.RavenDbConnections = [];

        vm.SagasLoaded = false;
        vm.Loaded = false;

        loadRavenDbConnections();

        //* Load RavenDB connections *\\
        function loadRavenDbConnections() {
            openSagasService.getRavenDbConnections(loadRavenDbConnectionsSuccess, loadRavenDbConnectionsFailed);
        }

        function loadRavenDbConnectionsSuccess(resp) {
            vm.RavenDbConnections = resp.Data;
            vm.Loaded = true;
        }

        function loadRavenDbConnectionsFailed(resp) {
            toaster.error('Unable to load RavenDB connections: ' + resp.Message);
            vm.Loaded = true;
        }

        //* Load all open sagas *\\
        function loadOpenSagas() {
            vm.LoadingSagas = true;

            vm.SelectedSaga = null;
            vm.OpenSagas = [];
            vm.SagaData = {};
            vm.ShowSagaData = false;

            openSagasService.getOpenSagas("\"" + vm.SelectedConnection + "\"", onSuccess, onFailed);
        }

        function onSuccess(resp) {
            vm.LoadingSagas = false;

            if (resp.Message != null)
                onFailed(resp);
            else {
                vm.SagasLoaded = true;
                vm.OpenSagas = resp.Data;
            }
        }

        function onFailed(resp) {
            vm.LoadingSagas = false;
            toaster.pop('error', resp.Message);
            vm.SagasLoaded = true;
            vm.Message = resp.Message;
        }

        //* Load saga data *\\
        function setSagaData(key, collection) {

            vm.SelectedSaga = {
                Connection: vm.SelectedConnection,
                Collection: collection,
                Key: key
            };

            openSagasService.getSagaData(vm.SelectedSaga, onLoadSagaDataSuccess, onLoadSagaDataFailed);
        }

        function onLoadSagaDataSuccess(resp) {
            if (resp.Message != null) {
                vm.SagaData = resp.Message;
            } else {
                vm.SagaData = resp.Data;
            }
            vm.ShowSagaData = true;
        }

        function onLoadSagaDataFailed(resp) {
            vm.SagaData = resp.Message;
            vm.ShowSagaData = true;
        }

        //* Send Continue Command *\\
        function sendContinueCommand() {
            openSagasService.sendContinueCommand(vm.SelectedSaga, onSendContinueCommandSuccess, onSendContinueCommandFailed);
        }

        function onSendContinueCommandSuccess(resp) {
            toaster.pop('info', 'Sending continue command succeeded');
        }

        function onSendContinueCommandFailed(resp) {
            toaster.pop('error', resp.Message);
        }
    }

    angular
        .module('ravendb.app.sagasMultiSelectList', [
            "ui.directives",
            'ui.bootstrap',
            'ngTouch',
            'ui.select'
        ])
        .component('sagasMultiSelectList', {
            bindings: {

            },
            controllerAs: 'vm',
            templateUrl: '/js/components/RavenDB/Bus/Components/sagasMultiSelectListTmpl.html',
            controller: sagasMultiSelectListController
        });
})();
