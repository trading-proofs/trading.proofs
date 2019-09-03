
xgit = (function() {
 var client_id     = function() { return xgit.client_id }
 var client_secret = function() { return xgit.client_secret }
 var anchor        = 'trading.proofs'
 var systemReady   = false
 var token         = ''
 var set_token     = function(t) { token = t }
 var get_token     = function( ) { return token }
 var gists         = []
 var set_gists     = function(t) { gists = t }
 var get_gists     = function( ) { return gists }
 var debug         = true
 var debugwr       = function(m) { if (debug) { console.log(m) } }
 
 var begin = function() {
   var token
   var url = window.location.href
   if (url.match(/\?code\=[a-z0-9]{20,20}$/i)) {
     var c    = url.replace(/.*?\?code\=/,'')
     var uri  = 'https://cors-anywhere.herokuapp.com/'
         uri += 'https://github.com/login/oauth/access_token'
         uri += '?client_id=' + client_id() + '&'
         uri += 'client_secret=' + client_secret() + '&'
         uri += 'code=' + c
     debugwr('Requesting access: ' + uri)
     $.ajax({
       type: 'POST',
       url : uri,
       success: receiveToken,
     })
   } }
 
 var receiveToken = function(data) {
   debugwr('Extracting token from response: ' + data)
   var RE    = /access_token=(.*?)&/g
   var match = RE.exec(data)
   if (match) { set_token(match[1]); debugwr('Token: ' + token); systemReady = true }
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
   debugwr(list)
   debugwr(anchor)
   window.history.replaceState({}, '', window.location.href.replace(/\?code\=.*$/,''))
   var modURL
   for (var i = 0; i < list.length; i++) {
     var n = list[i]
     var desc = n.description.toLowerCase()
     if (desc == anchor) {
       set_gists(n.files)
       retrieve()
       break
     }
   }
   if (modURL === undefined) { debugwr('No modURL found.'); return } }
   
 var retrieve = function() {
   var out  = []
   var list = get_gists()
   for (var file in list) {
     out.push(file.raw_url)
   }
  console.log(out)
   var p = $.when(1)
   out.forEach( function(raw, index) {
     p = p.then(function() {
       console.log(raw)
       return $.ajax({ url: raw })
     }).then(function(data) {
       console.log(data)
     })
   })
   p.then(function() {
     $(document).trigger('files-read')
   }) }
  
 var ready = function(data) {
   debugwr('Gist retrieved: ' + data)
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
