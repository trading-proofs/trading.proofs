
xgit = (function() {
 var client_id     = function() { return xgit.client_id }
 var client_secret = function() { return xgit.client_secret }
 var anchor        = 'xgit core'
 var systemReady   = false
 var token         = ''
 var set_token     = function(t) { token = t }
 var get_token     = function( ) { return token }
 var gists         = []
 var set_gists     = function(t) { gists = t }
 var get_gists     = function( ) { return gists }
 
 var begin = function() {
   var token
   var url = window.location.href
   if (url.match(/\?code\=[a-z0-9]{20,20}$/i)) {
     var c    = url.replace(/.*?\?code\=/,'')
     var uri  = '' //'https://cors-anywhere.herokuapp.com/'
         uri += 'https://github.com/login/oauth/access_token'
         uri += '?client_id=' + client_id() + '&'
         uri += 'client_secret=' + client_secret() + '&'
         uri += 'code=' + c
     console.log('Requesting access: ' + uri)
     $.ajax({
       type: 'POST',
       url : uri,
       crossDomain: true,
       dataType: 'jsonp',
       // xhrFields: { // https://stackoverflow.com/a/42554319
         // withCredentials: true
       // },
       success: receiveToken,
     })
   } }
 
 var receiveToken = function(data) {
   console.log(data)
   var RE    = /access_token=(.*?)&/g
   var match = RE.exec(data)
   if (match) { set_token(match[1]); console.log('Token: ' + token); systemReady = true }
   if (systemReady) { requestGists() } }
   
 var requestGists = function() {
   systemReady = true
   if (typeof token !== 'undefined' && token !== '') { 
     $.ajax({
       type: 'GET',
       url : 'https://api.github.com/gists?access_token=' + token,
       success: loadGists,
     })
   } }

 var loadGists = function(list) {
   window.history.replaceState({}, '', window.location.href.replace(/\?code\=.*$/,''))
   set_gists(list)
   var modURL
   for (var i = 0; i < list.length; i++) {
     var n = list[i]
     var desc = n.description
     if (desc == anchor) {
       var o = n.files
       for (var k in o) {
         var detail = o[k]
             modURL = detail.raw_url || ''
         break
       }
       break
     }
   }
   $.ajax({url: modURL, complete: ready }) }
   
 var ready = function(data) {
   var t = data.responseText
   try { eval(t) } catch(err) { console.log(err) } }
 
 var github = function() {
   window.location.href = 'https://github.com/login/oauth/authorize?client_id=' + client_id() + '&scope=gist' }
 
 return {
   client_id     : 'a510507ee1b7f305909a',
   client_secret : 'bb1486eff69d8fd4910d4715562f7968c1a0699b',
   
   begin         : begin,
   github        : github,
   gists         : get_gists,
   token         : get_token,
 }
})()
