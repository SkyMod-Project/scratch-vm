const path = require('path');
const test = require('tap').test;
const makeTestStorage = require('../fixtures/make-test-storage');
const readFileToBuffer = require('../fixtures/readProjectFile').readFileToBuffer;
const VirtualMachine = require('../../src/index');

const projectUri = path.resolve(__dirname, '../fixtures/hat-execution-order.sb2');
const project = readFileToBuffer(projectUri);

const compilerAndInterpreter = (name, callback) => {
    test(`${name} - interpreted`, t => {
        callback(t, {
            enabled: false
        });
    });
    test(`${name} - compiled`, t => {
        callback(t, {
            enabled: true
        });
    });
};

compilerAndInterpreter('complex', (t, co) => {
    const vm = new VirtualMachine();
    vm.setCompilerOptions(co);
    vm.attachStorage(makeTestStorage());

    // Evaluate playground data and exit
    vm.on('playgroundData', e => {
        const threads = JSON.parse(e.threads);
        t.ok(threads.length === 0);

        const resultKey = Object.keys(vm.runtime.targets[0].variables)[0];
        const results = vm.runtime.targets[0].variables[resultKey].value;
        t.deepEqual(results, ['3', '2', '1', 'stage']);

        t.end();
        vm.stop();
    });

    // Start VM, load project, and run
    t.doesNotThrow(() => {
        vm.start();
        vm.clear();
        vm.setCompatibilityMode(false);
        vm.setTurboMode(false);
        vm.loadProject(project).then(() => {
            vm.greenFlag();

            // After two seconds, get playground data and stop
            setTimeout(() => {
                vm.getPlaygroundData();
                vm.stopAll();
            }, 2000);
        });
    });
});
