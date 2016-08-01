#!/usr/bin/env node

var CronJob       = require('cron').CronJob
var child_process = require('child_process')
var kue           = require('kue')
var solidbot      = require('solidbot')

var db            = solidbot.bots.db
var cmd           = solidbot.bots.cmd

var crawler       = require('../')

// init
var interval = 4
var queue    = kue.createQueue()


// cron
new CronJob('*/'+ interval +' * * * * *', function() {
  console.log('Running Cron every '+ interval +' seconds')


}, null, true, 'America/Los_Angeles')


// single crawler
queue.process('crawler', crawler.bots.crawler)

// per site crawlers
var sites = [ 'www.reddit.com' ]

for (var i = 0; i < sites.length; i++) {
  var site = sites[i]
  queue.process('crawler' + '/' + sites[i], crawler.bots.crawler)  
}

// server
kue.app.listen(3006)
