var Flightplan = require('flightplan');
var exec = require('shelljs').exec;

var plan = new Flightplan();


var vagrantSshConfig = function(){
    var vagrantNodeMap = {
        'HostName': 'host',
        'User': 'username',
        'Port': 'port',
        'IdentityFile': 'privateKey',
    };
    var result = [];

    var rawConfig = exec('vagrant ssh-config', {silent:true});

    if (rawConfig.code != 0) {
        return;
    }

    var lines = rawConfig.output.split('\n');
    var hostConfig;
    for (var i in lines){
        var line = lines[i];
        if (!line.match(/\s\s\w/)) {
            if (line.length == 0) {
                continue;
            }
            hostConfig = {};
            result.push(hostConfig);
            continue;
        }
        var match = line.match(/  (\w+) (.+)/);

        if (match[1] in vagrantNodeMap){
            var key = vagrantNodeMap[match[1]];
            hostConfig[key] = match[2];
        }

    }
    return result;
}


plan.briefing({
    debug: false,
    destinations: {
        'vagrant': vagrantSshConfig(),
    }
});

plan.local('default', function(transport){
    transport.echo('bar');
})

plan.remote('default', function(transport){
    transport.echo('foo');
});
