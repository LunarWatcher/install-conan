"using strict"; // Fucking JS
const core = require("@actions/core");
const exec = require("child_process").exec;

/**
 * Wrapper function to execute a system command
 */
function executeCommand(command) {
    let child = exec (command, 
        function(error, stdout, stderr) {
            console.log(stdout);
            console.log("stderr: " + stderr);
            if (error != null) 
                console.log("Command errored out: " + error);
        });
    child();
}

// Install Conan
executeCommand("python -m pip install conan");

// Possibly unsupported on Windows
let CXX = core.getInput("CXX");
let CC = core.getInput("CC");
let conanProfile = core.get
// Generate the conan profile command
let base = "conan profile new --detect default"
let command = 
        (CXX == "" ? "" : "CXX=" + CXX + " ")
        + (CC == "" ? "" : "CC=" + CC + " ")
        + base;
executeCommand(command);
