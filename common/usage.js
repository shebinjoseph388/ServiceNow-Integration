module.exports = {
    processArgs: function(filename) {
       
        function printUsageAndExit() {
            console.log("\nUsage: node " + filename + " [ -h ] [ -p <port> ] [ -v ]");
            console.log("   -h, --help                  Show this usage help");
            console.log("   -p <port>, --port=<port>    HTTP server listen port (default 3000)");
            console.log("   -v, --verbose               Verbose HTTP output");
            process.exit(-1);
        }

        var minimist = require('minimist');

        var o = {
            port: 3000, 
            verbose: false
        };

        var argv = minimist(process.argv.slice(2));
        o.verbose = 'verbose' in argv || 'v' in argv;

       
        if ('help' in argv || 'h' in argv) {
            printUsageAndExit();
        }

        
        if ('port' in argv) {
            o.port = argv['port'];
        } else if ('p' in argv) {
            o.port = argv['p'];
        }
        if (isNaN(o.port) || o.port % 1 !== 0) {
            console.log("Error: port must be an integer");
            printUsageAndExit();
        }

        return o;
    } 
}