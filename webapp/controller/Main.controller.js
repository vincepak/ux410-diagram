sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/viz/ui5/controls/common/feeds/FeedItem",
	"sap/viz/ui5/data/DimensionDefinition",
	"sap/viz/ui5/data/MeasureDefinition",
	"sap/viz/ui5/data/FlattenedDataset",
		// "sap/m/Column",
	"sap/m/Label",
	"sap/ui/core/Item",
	"sap/m/ColumnListItem",
	"sap/m/Toolbar"
], function (Controller, FeedItem, DimensionDefinition,MeasureDefinition,FlattenedDataset,/* Column, */ Label, Item, ColumnListItem, Toolbar) {
	"use strict";

	return Controller.extend("student00.sap.training.diagram.controller.Main", {
		onInit: function () {
			this.sCurrentVizFrame = "idLineChartVizFrame";
			this.sCurrentSelectedDimension="0";
			
			this._createFeedMap();
			this._createDataSetMap();
			
			this._dataSet = this._createDataSet();
			
			this._createLineDiagram();
		},
		
		_createFeedMap:function(){
			this.feedMap={};
			this.feedMap.saleAmount = new FeedItem({
				"uid":"valueAxis",
				"type":"Measure",
				"values":["SalesAmount"]
			});
			
			this.feedMap.products = new FeedItem({
				"uid":"categoryAxis",
				"type":"Dimension",
				"values":["Products"]
			});
			
			this.feedMap.subregion = new FeedItem({
				"uid":"categoryAxis",
				"type":"Dimension",
				"values":["Sub_Region_Name"]
			});
			
			this.feedMap.productsSubregion = new FeedItem({
				"uid":"categoryAxis",
				"type":"Dimension",
				"values":["Products", "Sub_Region_name"]
			});
		},
		
		_createDataSetMap: function(){
			this.dataSetMap = {};
			this.dataSetMap.productDim = new DimensionDefinition({
				name: "Products",
				value:"{SalesModel>PRODUCT_NAME}"
			});
			
			this.dataSetMap.subRegionDim = new DimensionDefinition({
				name: "Sub_Region_Name",
				value:"{SalesModel>SUB_REGION_NAME}"
			});
			
			this.dataSetMap.salesAmountMeasure = new MeasureDefinition({
				name: "SalesAmount",
				value: "{SalesModel>SALES_AMOUNT}"
			});
		},
		
		_createDataSet:function(){
			var oDataSet = new FlattenedDataset({
				data: { path: "SalesModel>/SalesFigures"}
			});
			
			return oDataSet;
		},
		
		_handleSelection:function(selectedItem){
			var oVizFrame = this.getView().byId(this.sCurrentVizFrame);
			var oDataSet = oVizFrame.getDataset();
			
			oDataSet.removeAllDimensions();
			oDataSet.removeAllMeasures();
			oVizFrame.removeAllFeeds();
			
			switch(selectedItem){
				case "0":{
					oDataSet.addDimension(this.dataSetMap.productDim);
					oDataSet.addMeasure(this.dataSetMap.salesAmountMeasure);
					oVizFrame.addFeed(this.feedMap.products);
					oVizFrame.addFeed(this.feedMap.saleAmount);
				}
			}
		},
		
		_createLineDiagram: function () {
			var oVizFrame = this.getView().byId("idLineChartVizFrame");
			var oPop = this.getView().byId("idLineChartPopover");
			oVizFrame.setDataset(this._createDataSet());
			this._handleSelection(this.sCurrentSelectedDimension);
			oVizFrame.setVizProperties({
				plotArea: {
					dataLabel: {
						visible: true
					}
				},
				title: {
					visible: false
				}
			});
			oVizFrame.setVizType('line');
			oPop.connect(oVizFrame.getVizUid());
		},
	});
});