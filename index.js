"using strict"; // Fucking JS
const core = require("@actions/core");
const exec = require("child_process").exec;

/**
 * Wrapper function to execute a system command
 */
function executeCommand(command) {
    return exec (command, 
        function(error, stdout, stderr) {
            console.log(stdout);
            console.log("stderr: " + stderr);
            if (error != null) {
                console.log("Command errored out: " + error);
                process.exit(-3);
            }
        });
}

// Install Conan
let py = executeCommand("python -m pip install conan");

// exec is async. Without this,
// conan will execute in parallel with the install, 
// which is relatively slow.
py.on("exit", () => {
    try {
        executeCommand("conan profile detect default");
    } catch (e) {
        executeCommand("conan profile new --detect default");
    }
});
