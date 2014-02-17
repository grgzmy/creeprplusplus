var express = require('express')
var app = express()
var token = 'CAACEdEose0cBACAHJLxlCofUCkpfqdRcFtnyt4Fs76mRrsJRx2IZBG3LfnSyEuXqTPFGzGxAWrYZAZBzGWzTvZCkYi2U7wEkz1irSCKhnUFBpiHZBamEXoohk76l8HApsJot80mSwERDmM962Xza1ZB0lXJ5z0PmOgZBdjnQ9VicoRwq4wd60JhzOFhRUAP8PQZD'
var fb = require('fb');
var dcopy = require("deep-copy");

var oldFriends = [];
var i = 1;
fb.setAccessToken(token);

var getFriends = function(callBack, httpResponse){
	fb.api('me', {fields: ['id', 'friends']}, function(res){
		if(!res || res.error){
			console.log(!res ? 'err yo' : res.error);
			return;
		}
		console.log(res.id);
		console.log(res.friends.data.length);
		callBack(res.friends.data, httpResponse);
	});	
};


var containsFriend = function(list, friend){
	for (var i = 0; i<list.length; i++){
		if (list[i].id === friend.id){
			return true;
		}
	}
	return false;
};

var compare = function(res, deletions){
	var copyToOldFriends = function (friendsList, res){
		oldFriends = dcopy(friendsList);
		res.send("Noobie");
	};

	var copyToNewFriends = function (friendsList, res){
		newFriends = dcopy(friendsList);
		for (var i = 0; i<oldFriends.length; i++){
		if(!containsFriend(newFriends, oldFriends[i])){
			console.log(oldFriends[i].id);
			deletions.push(oldFriends[i]);
			}
		}

		oldFriends = dcopy(newFriends);
		if(deletions.length>0){
			res.send("deletions" + deletions);
		}else{
			res.send("no deletions");
		}

	};


	if(oldFriends.length <1){
		res.send("Noobie \n");
		getFriends(copyToOldFriends, res);
		console.log("old friends typeof " + typeof(oldFriends));
		console.log("old friends now of size " + oldFriends.length);
		
		return
	}

	var newFriends = [];
	getFriends(copyToNewFriends, res);
	
	
};


app.get('/', function(req, res){
	var deletions = [];
	
	compare(res, deletions);
});

app.listen(3003);