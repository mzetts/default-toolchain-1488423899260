"use strict";
/* global process */
/* global __dirname */
/*eslint-env node*/

/*******************************************************************************
 * Copyright (c) 2015 IBM Corp.
 *
 * All rights reserved.
 *
 *******************************************************************************/
/////////////////////////////////////////
///////////// Setup Node.js /////////////
/////////////////////////////////////////
var express 		= require('express');
var session 		= require('express-session');
var cookieParser 	= require('cookie-parser');
var bodyParser 		= require('body-parser');
var http 		= require('http');
var app 		= express();
var url 		= require('url');
var cors 		= require('cors');
var fs 			= require('fs');
var hfc			= require('hfc');
//var cfenv		= require('cfenv');


//Our own modules
var blocks 		= require(__dirname+'/Server_Side/blockchain/blocks/blocks.js');
var block 		= require(__dirname+'/Server_Side/blockchain/blocks/block/block.js');
var participants 	= require(__dirname+'/Server_Side/blockchain/participants/participants.js');
var identity 	 	= require(__dirname+'/Server_Side/admin/identity/identity.js');
var vehicles	 	= require(__dirname+'/Server_Side/blockchain/assets/vehicles/vehicles.js')
var vehicle 	 	= require(__dirname+'/Server_Side/blockchain/assets/vehicles/vehicle/vehicle.js')
var demo 	 	= require(__dirname+'/Server_Side/admin/demo/demo.js')
var chaincode 	 	= require(__dirname+'/Server_Side/blockchain/chaincode/chaincode.js')
var transactions 	= require(__dirname+'/Server_Side/blockchain/transactions/transactions.js');
var startup		= require(__dirname+'/Server_Side/configurations/startup/startup.js');
var configFile 		= require(__dirname+'/Server_Side/configurations/configuration.js');


//User manager modules
var user_manager = require(__dirname+'/utils/user.js');


// For logging
var TAG = "app.js:";

//Define port number for app server to use
var port = configFile.config.app_port;

////////  Pathing and Module Setup  ////////
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({secret: 'Somethignsomething1234!test', resave: true, saveUninitialized: true}));

// Enable CORS preflight across the board.
app.options('*', cors());
app.use(cors());


app.use(express.static(__dirname + '/Client_Side'));

//===============================================================================================
//	Routing
//===============================================================================================

//-----------------------------------------------------------------------------------------------
//	Admin - Identity
//-----------------------------------------------------------------------------------------------

app.post('/admin/identity', function(req, res) 	//Sets the session user to have the account address for the page they are currently on
{
	identity.create(req, res);
});

//-----------------------------------------------------------------------------------------------
//	Admin - Demo
//-----------------------------------------------------------------------------------------------

app.post('/admin/demo', function(req, res)
{
	demo.create(req, res);
});

app.get('/admin/demo', function(req, res)
{
	demo.read(req, res);
});

//-----------------------------------------------------------------------------------------------
//	Blockchain - chaincode
//-----------------------------------------------------------------------------------------------
app.post('/blockchain/chaincode/vehicles', function(req, res){
	chaincode.vehicles.create(req, res)
});

//-----------------------------------------------------------------------------------------------
//	Blockchain - Blocks
//-----------------------------------------------------------------------------------------------
app.get('/blockchain/blocks', function(req, res){
	blocks.read(req, res);
});

app.get('/blockchain/blocks/:blockNum(\\d+)', function(req, res){
	block.read(req, res);
});

//-----------------------------------------------------------------------------------------------
//	Blockchain - Assets - Vehicles
//-----------------------------------------------------------------------------------------------
app.post('/blockchain/assets/vehicles' , function(req,res)
{
	vehicles.create(req,res)
});

app.get('/blockchain/assets/vehicles' , function(req,res)
{
	vehicles.read(req,res)
});

//-----------------------------------------------------------------------------------------------
//	Blockchain - Assets - Vehicles - Vehicle
//-----------------------------------------------------------------------------------------------

app.get('/blockchain/assets/vehicles/:v5cID' , function(req,res)
{
	vehicle.read(req,res)
});

//-----------------------------------------------------------------------------------------------
//	Blockchain - Assets - Vehicles - Vehicle - Owner
//-----------------------------------------------------------------------------------------------
app.get('/blockchain/assets/vehicles/:v5cID/owner' , function(req,res)
{
	vehicle.owner.read(req,res)
});

app.put('/blockchain/assets/vehicles/:v5cID/owner' , function(req,res)
{
	vehicle.owner.update(req,res)
});

//-----------------------------------------------------------------------------------------------
//	Blockchain - Assets - Vehicles - Vehicle - VIN
//-----------------------------------------------------------------------------------------------
app.get('/blockchain/assets/vehicles/:v5cID/VIN' , function(req,res)
{
	vehicle.VIN.read(req,res)
});

app.put('/blockchain/assets/vehicles/:v5cID/VIN' , function(req,res)
{
	vehicle.VIN.update(req,res)
});

//-----------------------------------------------------------------------------------------------
//	Blockchain - Assets - Vehicles - Vehicle - Colour
//-----------------------------------------------------------------------------------------------
app.get('/blockchain/assets/vehicles/:v5cID/colour' , function(req,res)
{
	vehicle.colour.read(req,res)
});

app.put('/blockchain/assets/vehicles/:v5cID/colour' , function(req,res)
{
	vehicle.colour.update(req,res)
});


//-----------------------------------------------------------------------------------------------
//	Blockchain - Assets - Vehicles - Vehicle - Make
//-----------------------------------------------------------------------------------------------
app.get('/blockchain/assets/vehicles/:v5cID/make' , function(req,res)
{
	vehicle.make.read(req,res)
});

app.put('/blockchain/assets/vehicles/:v5cID/make' , function(req,res)
{
	vehicle.make.update(req,res)
});

//-----------------------------------------------------------------------------------------------
//	Blockchain - Assets - Vehicles - Vehicle - Model
//-----------------------------------------------------------------------------------------------
app.get('/blockchain/assets/vehicles/:v5cID/model' , function(req,res)
{
	vehicle.model.read(req,res)
});

app.put('/blockchain/assets/vehicles/:v5cID/model' , function(req,res)
{
	vehicle.model.update(req,res)
});

//-----------------------------------------------------------------------------------------------
//	Blockchain - Assets - Vehicles - Vehicle - Reg
//-----------------------------------------------------------------------------------------------
app.get('/blockchain/assets/vehicles/:v5cID/reg' , function(req,res)
{
	vehicle.reg.read(req,res)
});

app.put('/blockchain/assets/vehicles/:v5cID/reg' , function(req,res)
{
	vehicle.reg.update(req,res)
});

//-----------------------------------------------------------------------------------------------
//	Blockchain - Assets - Vehicles - Vehicle - Scrapped
//-----------------------------------------------------------------------------------------------
app.delete('/blockchain/assets/vehicles/:v5cID' , function(req,res)
{
	vehicle.delete(req,res)
});

app.get('/blockchain/assets/vehicles/:v5cID/scrap' , function(req,res)
{
	vehicle.scrapped.read(req,res)
});

//-----------------------------------------------------------------------------------------------
//	Blockchain - Participants
//-----------------------------------------------------------------------------------------------
app.post('/blockchain/participants', function(req,res){
	participants.create(req, res);
});

app.get('/blockchain/participants', function(req,res){
	participants.read(req,res);
});

app.get('/blockchain/participants/regulators', function(req, res){
	participants.regulators.read(req,res);
});

app.get('/blockchain/participants/manufacturers', function(req, res){
	participants.manufacturers.read(req,res);
});

app.get('/blockchain/participants/dealerships', function(req, res){
	participants.dealerships.read(req,res);
});

app.get('/blockchain/participants/lease_companies', function(req, res){
	participants.lease_companies.read(req,res);
});

app.get('/blockchain/participants/leasees', function(req, res){
	participants.leasees.read(req,res);
});

app.get('/blockchain/participants/scrap_merchants', function(req, res){
	participants.scrap_merchants.read(req,res);
});


//-----------------------------------------------------------------------------------------------
//	Blockchain - Transactions
//-----------------------------------------------------------------------------------------------
app.get('/blockchain/transactions', function(req, res){
	transactions.read(req, res);
});



///////////  Configure Webserver  ///////////
app.use(function (req, res, next) {
    var keys;
    console.log('------------------------------------------ incoming request ------------------------------------------');
    console.log('New ' + req.method + ' request for', req.url);
    req.bag = {};											//create my object for my stuff
    req.session.count = eval(req.session.count) + 1;
    req.bag.session = req.session;

    var url_parts = url.parse(req.url, true);
    req.parameters = url_parts.query;
    keys = Object.keys(req.parameters);
    if (req.parameters && keys.length > 0) console.log({parameters: req.parameters});		//print request parameters
    keys = Object.keys(req.body);
    if (req.body && keys.length > 0) console.log({body: req.body});						//print request body
    next();
});

////////////////////////////////////////////
////////////// Error Handling //////////////
////////////////////////////////////////////
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use(function (err, req, res, next) {		// = development error handler, print stack trace
    console.log("Error Handler -", req.url, err);
    var errorCode = err.status || 500;
    res.status(errorCode);
    req.bag.error = {msg: err.stack, status: errorCode};
    if (req.bag.error.status == 404) req.bag.error.msg = "Sorry, I cannot locate that file";
    //res.render('template/error', {bag: req.bag});
    res.send({"message":err})
});

// Track the application deployments
require("cf-deployment-tracker-client").track();

// ============================================================================================================================
// 														Launch Webserver
// ============================================================================================================================
var server = http.createServer(app).listen(port, function () {
	
	//var result = startup.create()
	
});
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
process.env.NODE_ENV = 'production';


server.timeout = 2400000;																// Ta-da.
console.log('------------------------------------------ Server Up - ' + configFile.config.app_url + ' ------------------------------------------');


console.log("ENV VARIABLES", configFile.config.api_ip, configFile.config.api_port_external);

//Set up connection to the CA
//finalSetup();



/**********************************TESTING HFC CREATE USER LOCALLY************************************************/
var chain;

function finalSetup() { //To use node SDK instead now

	chain = hfc.newChain("theChain");

	chain.setKeyValStore( hfc.newFileKeyValStore('/tmp/KeyValStore') );
	//chain.setECDSAModeForGRPC(true);

	//var pem = fs.readFileSync('node_modules/hfc/certificate.pem');

	chain.setMemberServicesUrl("grpc://localhost:50051")//, {pem:pem, hostnameOverride:'tlsca'});	//2aee5d0d-16c7-4e3e-9f8e-d18845452201_ca.us.blockchain.ibm.com:30303 	, {pem:pem, hostnameOverride:'tlsca'}

	chain.addPeer("grpc://localhost:30303")//, {pem:pem, hostnameOverride:'tlsca'});		//2aee5d0d-16c7-4e3e-9f8e-d18845452201_vp0.us.blockchain.ibm.com:30303	, {pem:pem, hostnameOverride:'tlsca'}

	chain.enroll("WebAppAdmin", "DJY27pEnl16d", function(err, webAppAdmin) {

		if (err) return console.log("ERROR: failed to register, %s",err);
		// Successfully enrolled WebAppAdmin during initialization.
		// Set this user as the chain's registrar which is authorized to register other users.
		chain.setRegistrar(webAppAdmin);

		//createUser();

	});

}

function createUser(){

	var registrationRequest = {
					enrollmentID: "AF",
					// Customize account & affiliation
					account: "group1",
					affiliation: "00001"
				};

	chain.register( registrationRequest, function(err, secret) {
		if (err) return console.log("ERROR: %s",err);

		console.log("Registered user with secret:",secret)

		chain.getMember("AF", function(err, member){
			
			member.setAccount("group1")
			member.setAffiliation("00010")
			member.setRoles(["1"])
			member.saveState()

			console.log("NEW USER AF", member)

		})
	});
}




